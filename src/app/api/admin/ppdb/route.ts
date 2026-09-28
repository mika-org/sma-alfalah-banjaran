import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let ppdb = await prisma.pengaturanPpdb.findFirst();
  if (!ppdb) {
    ppdb = await prisma.pengaturanPpdb.create({
      data: {
        tahun_ajaran: "2026/2027",
        status_buka: true,
        tagline: "Penerimaan Peserta Didik Baru (PPDB)",
        deskripsi: "Pendaftaran siswa baru SMA Al Falah Banjaran dibuka.",
        persyaratan: "[]",
        jadwal: "[]",
        kontak: "[]",
        url_pendaftaran: "https://wa.me/6281234567890",
      },
    });
  }

  const mapped = {
    ...ppdb,
    academicYear: ppdb.tahun_ajaran,
    isOpen: ppdb.status_buka,
    tagline: ppdb.tagline,
    description: ppdb.deskripsi,
    registrationUrl: ppdb.url_pendaftaran,
    requirements: ppdb.persyaratan,
    schedule: ppdb.jadwal,
    contacts: ppdb.kontak,
  };

  return NextResponse.json({ ppdb: mapped });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const existing = await prisma.pengaturanPpdb.findFirst();

  // Map any camelCase input to snake_case if present
  const data: Record<string, any> = {};
  if (body.tahun_ajaran !== undefined || body.academicYear !== undefined) data.tahun_ajaran = body.tahun_ajaran ?? body.academicYear;
  if (body.status_buka !== undefined || body.isOpen !== undefined) data.status_buka = body.status_buka ?? body.isOpen;
  if (body.tagline !== undefined) data.tagline = body.tagline;
  if (body.deskripsi !== undefined || body.description !== undefined) data.deskripsi = body.deskripsi ?? body.description;
  if (body.persyaratan !== undefined || body.requirements !== undefined) data.persyaratan = body.persyaratan ?? body.requirements;
  if (body.jadwal !== undefined || body.schedule !== undefined) data.jadwal = body.jadwal ?? body.schedule;
  if (body.kontak !== undefined || body.contacts !== undefined) data.kontak = body.kontak ?? body.contacts;
  if (body.url_pendaftaran !== undefined || body.registrationUrl !== undefined) data.url_pendaftaran = body.url_pendaftaran ?? body.registrationUrl;

  if (!existing) {
    const created = await prisma.pengaturanPpdb.create({ data: data as any });
    return NextResponse.json({ ppdb: created });
  }

  const updated = await prisma.pengaturanPpdb.update({
    where: { id: existing.id },
    data,
  });

  return NextResponse.json({ ppdb: updated });
}
