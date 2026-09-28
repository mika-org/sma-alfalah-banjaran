import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const programs = await prisma.program.findMany({
    orderBy: { urutan: "asc" },
  });
  const mapped = programs.map((p) => ({
    ...p,
    title: p.judul,
    summary: p.ringkasan,
    content: p.konten,
    image: p.gambar,
    icon: p.ikon,
    sortOrder: p.urutan,
  }));
  return NextResponse.json({ programs: mapped });
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
      .replace(/(^-|-$)+/g, "");

  const program = await prisma.program.create({
    data: {
      judul: rawTitle,
      slug,
      ringkasan: body.ringkasan || body.summary || "",
      konten: body.konten || body.content || "",
      gambar: body.gambar || body.image || "/images/about-school.jpg",
      ikon: body.ikon || body.icon || "book",
      urutan: body.urutan ?? body.sortOrder ?? 0,
      status: body.status || "PUBLISHED",
    },
  });

  return NextResponse.json({ program });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, ...data } = body;

  const updateData: Record<string, any> = {};
  if (data.judul !== undefined || data.title !== undefined) updateData.judul = data.judul ?? data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.ringkasan !== undefined || data.summary !== undefined) updateData.ringkasan = data.ringkasan ?? data.summary;
  if (data.konten !== undefined || data.content !== undefined) updateData.konten = data.konten ?? data.content;
  if (data.gambar !== undefined || data.image !== undefined) updateData.gambar = data.gambar ?? data.image;
  if (data.ikon !== undefined || data.icon !== undefined) updateData.ikon = data.ikon ?? data.icon;
  if (data.urutan !== undefined || data.sortOrder !== undefined) updateData.urutan = data.urutan ?? data.sortOrder;
  if (data.status !== undefined) updateData.status = data.status;

  const program = await prisma.program.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ program });
}

export async function DELETE(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.program.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
