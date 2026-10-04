import { NextResponse } from "next/server";
import { getOrtuSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getOrtuSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const akun = await prisma.akunOrangTua.findUnique({
      where: { id: session.ortuId },
      include: {
        siswa: {
          include: {
            calon_siswa: true,
          },
        },
      },
    });

    if (!akun || !akun.status_aktif) {
      return NextResponse.json({ error: "Akun tidak ditemukan atau tidak aktif." }, { status: 403 });
    }

    return NextResponse.json({
      akun: {
        id: akun.id,
        username: akun.username,
        namaLengkap: akun.nama_lengkap,
        email: akun.email,
        noWhatsapp: akun.no_whatsapp,
        terakhirMasuk: akun.terakhir_masuk,
      },
      siswa: {
        id: akun.siswa.id,
        nis: akun.siswa.nis,
        nisn: akun.siswa.nisn,
        namaLengkap: akun.siswa.nama_lengkap,
        jenisKelamin: akun.siswa.jenis_kelamin,
        tempatLahir: akun.siswa.tempat_lahir,
        tanggalLahir: akun.siswa.tanggal_lahir,
        alamat: akun.siswa.alamat,
        asalSekolah: akun.siswa.asal_sekolah,
        kelas: akun.siswa.kelas,
        tahunAjaran: akun.siswa.tahun_ajaran,
        status: akun.siswa.status,
        calonSiswa: akun.siswa.calon_siswa
          ? {
              nomorPendaftaran: akun.siswa.calon_siswa.nomor_pendaftaran,
              jalurPendaftaran: akun.siswa.calon_siswa.jalur_pendaftaran,
              tanggalPendaftaran: akun.siswa.calon_siswa.created_at,
              diverifikasiPada: akun.siswa.calon_siswa.diverifikasi_pada,
              nominalTransfer: akun.siswa.calon_siswa.nominal_transfer,
              buktiPembayaran: akun.siswa.calon_siswa.bukti_pembayaran,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get ortu me error:", error);
    return NextResponse.json({ error: "Gagal memuat profil orang tua" }, { status: 500 });
  }
}
