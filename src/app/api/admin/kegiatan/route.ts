import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const activities = await prisma.kegiatan.findMany({
    orderBy: { tanggal_kegiatan: "desc" },
  });
  const mapped = activities.map((a) => ({
    ...a,
    title: a.judul,
    excerpt: a.ringkasan,
    content: a.konten,
    coverImage: a.gambar_sampul,
    category: a.kategori,
    eventDate: a.tanggal_kegiatan,
  }));
  return NextResponse.json({ activities: mapped });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const rawTitle = body.judul || body.title || "";
  const slug =
    body.slug ||
    rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

  const rawDate = body.tanggal_kegiatan || body.eventDate;

  const activity = await prisma.kegiatan.create({
    data: {
      judul: rawTitle,
      slug,
      ringkasan: body.ringkasan || body.excerpt || "",
      konten: body.konten || body.content || "",
      gambar_sampul: body.gambar_sampul || body.coverImage || "/images/activity-tahfidz.jpg",
      kategori: body.kategori || body.category || "Umum",
      tanggal_kegiatan: rawDate ? new Date(rawDate) : new Date(),
      status: body.status || "PUBLISHED",
    },
  });

  return NextResponse.json({ activity });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, ...data } = body;

  const updateData: Record<string, any> = {};
  if (data.judul !== undefined || data.title !== undefined) updateData.judul = data.judul ?? data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.ringkasan !== undefined || data.excerpt !== undefined) updateData.ringkasan = data.ringkasan ?? data.excerpt;
  if (data.konten !== undefined || data.content !== undefined) updateData.konten = data.konten ?? data.content;
  if (data.gambar_sampul !== undefined || data.coverImage !== undefined) updateData.gambar_sampul = data.gambar_sampul ?? data.coverImage;
  if (data.kategori !== undefined || data.category !== undefined) updateData.kategori = data.kategori ?? data.category;
  if (data.status !== undefined) updateData.status = data.status;
  
  const rawDate = data.tanggal_kegiatan || data.eventDate;
  if (rawDate) {
    updateData.tanggal_kegiatan = new Date(rawDate);
  }

  const activity = await prisma.kegiatan.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ activity });
}

export async function DELETE(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.kegiatan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
