import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const testimonials = await prisma.testimoni.findMany({
    orderBy: { urutan: "asc" },
  });
  const mapped = testimonials.map((t) => ({
    ...t,
    name: t.nama,
    relation: t.hubungan,
    quote: t.kutipan,
    photoUrl: t.url_foto,
    sortOrder: t.urutan,
    isPublished: t.status_terbit,
  }));
  return NextResponse.json({ testimonials: mapped });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const testimonial = await prisma.testimoni.create({
    data: {
      nama: body.nama || body.name || "",
      hubungan: body.hubungan || body.relation || "",
      kutipan: body.kutipan || body.quote || "",
      url_foto: body.url_foto || body.photoUrl || "/images/avatar-1.jpg",
      urutan: body.urutan ?? body.sortOrder ?? 0,
      status_terbit: body.status_terbit ?? body.isPublished ?? true,
    },
  });

  return NextResponse.json({ testimonial });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, ...data } = body;

  const updateData: Record<string, any> = {};
  if (data.nama !== undefined || data.name !== undefined) updateData.nama = data.nama ?? data.name;
  if (data.hubungan !== undefined || data.relation !== undefined) updateData.hubungan = data.hubungan ?? data.relation;
  if (data.kutipan !== undefined || data.quote !== undefined) updateData.kutipan = data.kutipan ?? data.quote;
  if (data.url_foto !== undefined || data.photoUrl !== undefined) updateData.url_foto = data.url_foto ?? data.photoUrl;
  if (data.urutan !== undefined || data.sortOrder !== undefined) updateData.urutan = data.urutan ?? data.sortOrder;
  if (data.status_terbit !== undefined || data.isPublished !== undefined) updateData.status_terbit = data.status_terbit ?? data.isPublished;

  const testimonial = await prisma.testimoni.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ testimonial });
}

export async function DELETE(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.testimoni.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
