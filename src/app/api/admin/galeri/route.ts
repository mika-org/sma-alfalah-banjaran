import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gallery = await prisma.galeri.findMany({
    orderBy: { urutan: "asc" },
  });
  const mapped = gallery.map((g) => ({
    ...g,
    title: g.judul,
    imageUrl: g.url_gambar,
    altText: g.teks_alt,
    sortOrder: g.urutan,
    isPublished: g.status_terbit,
  }));
  return NextResponse.json({ gallery: mapped });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const rawTitle = body.judul || body.title || "";
  const photo = await prisma.galeri.create({
    data: {
      judul: rawTitle,
      url_gambar: body.url_gambar || body.imageUrl || "",
      teks_alt: body.teks_alt || body.altText || rawTitle,
      urutan: body.urutan ?? body.sortOrder ?? 0,
      status_terbit: body.status_terbit ?? body.isPublished ?? true,
    },
  });

  return NextResponse.json({ photo });
}

export async function DELETE(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.galeri.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
