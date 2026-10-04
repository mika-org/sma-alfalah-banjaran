import { NextResponse } from "next/server";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusPendaftaran } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { tindakan, nisCustom, kelas = "X", catatanAdmin } = body;

    const calonSiswa = await prisma.calonSiswa.findUnique({
      where: { id },
      include: {
        siswa: {
          include: {
            akun_orang_tua: true,
          },
        },
      },
    });

    if (!calonSiswa) {
      return NextResponse.json(
        { error: "Data calon siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    // Aksi TOLAK
    if (tindakan === "TOLAK") {
      const updated = await prisma.calonSiswa.update({
        where: { id },
        data: {
          status: StatusPendaftaran.DITOLAK,
          catatan_admin: catatanAdmin || "Berkas pendaftaran tidak memenuhi kriteria penerimaan.",
          diverifikasi_pada: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Status calon siswa berhasil diubah menjadi Ditolak.",
        calonSiswa: updated,
      });
    }

    // Aksi TERIMA / JADIKAN SISWA
    if (tindakan === "TERIMA") {
      if (calonSiswa.siswa) {
        return NextResponse.json(
          {
            error: `Calon siswa ini sudah diverifikasi sebelumnya sebagai siswa dengan NIS: ${calonSiswa.siswa.nis}.`,
          },
          { status: 400 }
        );
      }

      // 1. Tentukan NIS yang unik
      let finalNis = nisCustom ? nisCustom.trim() : "";
      if (!finalNis) {
        const yearPrefix = calonSiswa.tahun_ajaran.slice(2, 4) || "26"; // misal 26 dari 2026
        const totalSiswa = await prisma.siswa.count();
        const seq = String(totalSiswa + 1).padStart(4, "0");
        finalNis = `${yearPrefix}${seq}`; // contoh: 260001
      }

      // Cek apakah NIS sudah dipakai
      const existingNis = await prisma.siswa.findUnique({
        where: { nis: finalNis },
      });
      if (existingNis) {
        finalNis = `${finalNis}-${Math.floor(100 + Math.random() * 900)}`;
      }

      // Cek apakah NISN sudah ada di tabel siswa
      const existingNisn = await prisma.siswa.findUnique({
        where: { nisn: calonSiswa.nisn.trim() },
      });
      if (existingNisn) {
        return NextResponse.json(
          {
            error: `Siswa dengan NISN ${calonSiswa.nisn} sudah terdaftar di sistem dengan nama ${existingNisn.nama_lengkap}.`,
          },
          { status: 400 }
        );
      }

      // 2. Buat data Siswa
      const newSiswa = await prisma.siswa.create({
        data: {
          nis: finalNis,
          nisn: calonSiswa.nisn.trim(),
          nama_lengkap: calonSiswa.nama_lengkap,
          jenis_kelamin: calonSiswa.jenis_kelamin,
          tempat_lahir: calonSiswa.tempat_lahir,
          tanggal_lahir: calonSiswa.tanggal_lahir,
          alamat: calonSiswa.alamat,
          asal_sekolah: calonSiswa.asal_sekolah,
          no_hp: calonSiswa.no_hp_siswa,
          kelas: kelas.trim() || "X",
          tahun_ajaran: calonSiswa.tahun_ajaran,
          status: "AKTIF",
          calon_siswa_id: calonSiswa.id,
        },
      });

      // 3. Buat Akun Orang Tua yang UNIQUE
      const cleanNisn = calonSiswa.nisn.replace(/\D/g, "") || String(Date.now()).slice(-6);
      let baseUsername = `ortu_${cleanNisn}`;
      let finalUsername = baseUsername;
      let counter = 1;

      // Cek keunikan username
      while (true) {
        const exists = await prisma.akunOrangTua.findUnique({
          where: { username: finalUsername },
        });
        if (!exists) break;
        finalUsername = `${baseUsername}_${counter}`;
        counter++;
      }

      // Buat password acak yang aman dan mudah diingat
      const randomPin = Math.floor(1000 + Math.random() * 9000);
      const plainPassword = `falah${randomPin}`;
      const hashedPassword = await hashPassword(plainPassword);

      const namaOrtu =
        calonSiswa.nama_ayah ||
        calonSiswa.nama_ibu ||
        `Orang Tua dari ${calonSiswa.nama_lengkap}`;

      const akunOrtu = await prisma.akunOrangTua.create({
        data: {
          username: finalUsername,
          nama_lengkap: namaOrtu,
          email: calonSiswa.email_ortu || null,
          no_whatsapp: calonSiswa.no_whatsapp_ortu,
          password_hash: hashedPassword,
          password_terbuka_sementara: plainPassword,
          status_aktif: true,
          siswa_id: newSiswa.id,
        },
      });

      // 4. Update status Calon Siswa menjadi DITERIMA
      const updatedCalon = await prisma.calonSiswa.update({
        where: { id },
        data: {
          status: StatusPendaftaran.DITERIMA,
          diverifikasi_pada: new Date(),
          catatan_admin: catatanAdmin || "Selamat, calon siswa telah resmi diterima sebagai siswa aktif SMA Al Falah Banjaran.",
        },
      });

      // Template pesan WhatsApp
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const waMessage = `*PEMBERITAHUAN PENERIMAAN SISWA BARU SMA AL FALAH BANJARAN*\n\nAssalamu'alaikum Wr. Wb.\nYth. Bapak/Ibu *${namaOrtu}*,\n\nSelamat! Putra/putri Anda atas nama:\nNama: *${calonSiswa.nama_lengkap}*\nNISN: *${calonSiswa.nisn}*\n\nTelah resmi *DITERIMA* sebagai Siswa Baru di SMA Al Falah Banjaran.\n\nInformasi Akademik Siswa:\n- No. Induk Siswa (NIS): *${newSiswa.nis}*\n- Kelas: *${newSiswa.kelas}*\n- Tahun Ajaran: *${newSiswa.tahun_ajaran}*\n\nBerikut rincian *Akun Portal Orang Tua* Anda:\n- Username: *${akunOrtu.username}*\n- Password: *${plainPassword}*\n- Link Login: ${appUrl}/ortu/login\n\nSilakan masuk ke Portal Orang Tua untuk melihat rincian biodata, status administrasi, dan mengunduh Surat Keterangan Diterima.\n\nWassalamu'alaikum Wr. Wb.\n_Panitia PPDB SMA Al Falah Banjaran_`;

      return NextResponse.json({
        success: true,
        message: "Calon siswa berhasil diverifikasi menjadi siswa dan akun orang tua telah dibuat!",
        siswa: newSiswa,
        akunOrtu: {
          id: akunOrtu.id,
          username: akunOrtu.username,
          namaLengkap: akunOrtu.nama_lengkap,
          noWhatsapp: akunOrtu.no_whatsapp,
          plainPassword,
        },
        waMessage,
        calonSiswa: updatedCalon,
      });
    }

    return NextResponse.json(
      { error: "Tindakan tidak valid. Gunakan 'TERIMA' atau 'TOLAK'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Verifikasi error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses verifikasi." },
      { status: 500 }
    );
  }
}
