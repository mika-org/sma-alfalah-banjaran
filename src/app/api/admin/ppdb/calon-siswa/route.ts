import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusPendaftaran } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("q")?.trim();

    const where: any = {};

    if (statusParam && statusParam !== "ALL") {
      where.status = statusParam as StatusPendaftaran;
    }

    if (searchParam) {
      where.OR = [
        { nama_lengkap: { contains: searchParam, mode: "insensitive" } },
        { nomor_pendaftaran: { contains: searchParam, mode: "insensitive" } },
        { nisn: { contains: searchParam } },
        { asal_sekolah: { contains: searchParam, mode: "insensitive" } },
      ];
    }

    const [calonSiswa, totalAll, totalMenunggu, totalDiterima, totalDitolak] =
      await Promise.all([
        prisma.calonSiswa.findMany({
          where,
          include: {
            siswa: {
              include: {
                akun_orang_tua: true,
              },
            },
          },
          orderBy: { created_at: "desc" },
        }),
        prisma.calonSiswa.count(),
        prisma.calonSiswa.count({ where: { status: StatusPendaftaran.MENUNGGU_VERIFIKASI } }),
        prisma.calonSiswa.count({ where: { status: StatusPendaftaran.DITERIMA } }),
        prisma.calonSiswa.count({ where: { status: StatusPendaftaran.DITOLAK } }),
      ]);

    return NextResponse.json({
      calonSiswa,
      counts: {
        all: totalAll,
        menunggu: totalMenunggu,
        diterima: totalDiterima,
        ditolak: totalDitolak,
      },
    });
  } catch (error) {
    console.error("Fetch calon siswa error:", error);
    return NextResponse.json({ error: "Gagal memuat calon siswa" }, { status: 500 });
  }
}
