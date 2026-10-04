import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Masukkan Nomor Pendaftaran atau NISN." },
        { status: 400 }
      );
    }

    const candidate = await prisma.calonSiswa.findFirst({
      where: {
        OR: [
          { nomor_pendaftaran: { equals: query, mode: "insensitive" } },
          { nisn: { equals: query } },
        ],
      },
      include: {
        siswa: {
          include: {
            akun_orang_tua: true,
          },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json(
        {
          error:
            "Data pendaftaran tidak ditemukan. Pastikan Nomor Pendaftaran atau NISN yang Anda masukkan sudah sesuai.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        nomorPendaftaran: candidate.nomor_pendaftaran,
        namaLengkap: candidate.nama_lengkap,
        nisn: candidate.nisn,
        asalSekolah: candidate.asal_sekolah,
        jalurPendaftaran: candidate.jalur_pendaftaran,
        tahunAjaran: candidate.tahun_ajaran,
        status: candidate.status,
        diverifikasiPada: candidate.diverifikasi_pada,
        catatanAdmin: candidate.catatan_admin,
        createdAt: candidate.created_at,
        siswa: candidate.siswa
          ? {
              nis: candidate.siswa.nis,
              kelas: candidate.siswa.kelas,
              status: candidate.siswa.status,
              akunOrtu: candidate.siswa.akun_orang_tua
                ? {
                    username: candidate.siswa.akun_orang_tua.username,
                    namaOrtu: candidate.siswa.akun_orang_tua.nama_lengkap,
                    loginUrl: "/ortu/login",
                  }
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Cek status PPDB error:", error);
    return NextResponse.json(
      { error: "Gagal memeriksa status pendaftaran." },
      { status: 500 }
    );
  }
}
