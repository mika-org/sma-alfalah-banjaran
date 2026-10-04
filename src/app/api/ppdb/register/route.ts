import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      namaLengkap,
      nisn,
      nik,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      agama = "Islam",
      alamat,
      asalSekolah,
      noHpSiswa,
      namaAyah,
      namaIbu,
      pekerjaanOrtu,
      noWhatsappOrtu,
      emailOrtu,
      jalurPendaftaran = "Reguler",
      buktiPembayaran,
      namaPengirim,
      nominalTransfer,
      bankTujuan,
      catatan,
    } = body;

    // Validate required fields
    if (
      !namaLengkap ||
      !nisn ||
      !jenisKelamin ||
      !tempatLahir ||
      !tanggalLahir ||
      !alamat ||
      !asalSekolah ||
      !namaAyah ||
      !namaIbu ||
      !noWhatsappOrtu
    ) {
      return NextResponse.json(
        {
          error:
            "Harap lengkapi semua kolom data calon siswa dan kontak orang tua yang bertanda bintang (*).",
        },
        { status: 400 }
      );
    }

    if (!buktiPembayaran) {
      return NextResponse.json(
        {
          error:
            "Bukti pembayaran wajib diunggah untuk melanjutkan pendaftaran.",
        },
        { status: 400 }
      );
    }

    // Get current PPDB academic year
    const ppdbSettings = await prisma.pengaturanPpdb.findFirst();
    const tahunAjaran = ppdbSettings?.tahun_ajaran || "2026/2027";

    if (ppdbSettings && !ppdbSettings.status_buka) {
      return NextResponse.json(
        {
          error:
            "Mohon maaf, pendaftaran PPDB saat ini sedang ditutup oleh pihak sekolah.",
        },
        { status: 400 }
      );
    }

    // Check if NISN is already registered
    const existingCandidate = await prisma.calonSiswa.findFirst({
      where: {
        nisn: nisn.trim(),
        tahun_ajaran: tahunAjaran,
      },
    });

    if (existingCandidate) {
      return NextResponse.json(
        {
          error: `NISN ${nisn} sudah pernah didaftarkan pada Tahun Ajaran ${tahunAjaran} dengan No. Pendaftaran: ${existingCandidate.nomor_pendaftaran}.`,
        },
        { status: 400 }
      );
    }

    // Generate unique nomor_pendaftaran: PPDB-2026-XXXX
    const countTotal = await prisma.calonSiswa.count({
      where: { tahun_ajaran: tahunAjaran },
    });
    const yearCode = tahunAjaran.split("/")[0] || new Date().getFullYear().toString();
    const seqNum = String(countTotal + 1).padStart(4, "0");
    const nomorPendaftaran = `PPDB-${yearCode}-${seqNum}`;

    // Create record
    const candidate = await prisma.calonSiswa.create({
      data: {
        nomor_pendaftaran: nomorPendaftaran,
        tahun_ajaran: tahunAjaran,
        jalur_pendaftaran: jalurPendaftaran,
        nama_lengkap: namaLengkap.trim(),
        nisn: nisn.trim(),
        nik: nik?.trim() || null,
        jenis_kelamin: jenisKelamin,
        tempat_lahir: tempatLahir.trim(),
        tanggal_lahir: new Date(tanggalLahir),
        agama: agama.trim(),
        alamat: alamat.trim(),
        asal_sekolah: asalSekolah.trim(),
        no_hp_siswa: noHpSiswa?.trim() || null,
        nama_ayah: namaAyah.trim(),
        nama_ibu: namaIbu.trim(),
        pekerjaan_ortu: pekerjaanOrtu?.trim() || null,
        no_whatsapp_ortu: noWhatsappOrtu.trim(),
        email_ortu: emailOrtu?.trim() || null,
        bukti_pembayaran: buktiPembayaran,
        nama_pengirim: namaPengirim?.trim() || null,
        nominal_transfer: nominalTransfer ? parseInt(nominalTransfer, 10) : null,
        bank_tujuan: bankTujuan || null,
        tanggal_transfer: new Date(),
        catatan: catatan?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pendaftaran PPDB berhasil dikirim.",
      data: {
        id: candidate.id,
        nomorPendaftaran: candidate.nomor_pendaftaran,
        namaLengkap: candidate.nama_lengkap,
        tahunAjaran: candidate.tahun_ajaran,
        jalurPendaftaran: candidate.jalur_pendaftaran,
        status: candidate.status,
      },
    });
  } catch (error) {
    console.error("PPDB registration error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pendaftaran. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
