import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.trim();
    const kelas = searchParams.get("kelas")?.trim();
    const status = searchParams.get("status")?.trim();

    const where: any = {};

    if (kelas && kelas !== "ALL") {
      where.kelas = kelas;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { nama_lengkap: { contains: search, mode: "insensitive" } },
        { nis: { contains: search } },
        { nisn: { contains: search } },
        { akun_orang_tua: { username: { contains: search, mode: "insensitive" } } },
        { akun_orang_tua: { nama_lengkap: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [siswaList, totalCount] = await Promise.all([
      prisma.siswa.findMany({
        where,
        include: {
          akun_orang_tua: true,
          calon_siswa: {
            select: {
              nomor_pendaftaran: true,
              jalur_pendaftaran: true,
              bukti_pembayaran: true,
              nominal_transfer: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.siswa.count(),
    ]);

    return NextResponse.json({
      siswa: siswaList,
      total: totalCount,
    });
  } catch (error) {
    console.error("Fetch siswa error:", error);
    return NextResponse.json({ error: "Gagal memuat data siswa" }, { status: 500 });
  }
}
