import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let settings = await prisma.pengaturanSitus.findFirst();
  if (!settings) {
    settings = await prisma.pengaturanSitus.create({
      data: {
        nama: "SMA Al Falah Banjaran",
        tagline: "Mewujudkan Generasi Berilmu, Berakhlak, dan Siap Menghadapi Masa Depan",
        deskripsi: "SMA Al Falah Banjaran adalah sekolah islami unggul, berkarakter dan dekat dengan pembinaan siswa untuk membantu pribadi terbaik.",
        alamat: "Jl. Raya Banjaran No. 182, Banjaran, Kab. Bandung",
        telepon: "(022) 5940123",
        whatsapp: "6281234567890",
        email: "info@smaalfalahbanjaran.sch.id",
      },
    });
  }

  const mapped = {
    ...settings,
    name: settings.nama,
    description: settings.deskripsi,
    address: settings.alamat,
    phone: settings.telepon,
    mapsUrl: settings.url_peta,
    mapsEmbedUrl: settings.url_embed_peta,
  };

  return NextResponse.json({ settings: mapped });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const existing = await prisma.pengaturanSitus.findFirst();

  const data: Record<string, any> = {};
  if (body.nama !== undefined || body.name !== undefined) data.nama = body.nama ?? body.name;
  if (body.tagline !== undefined) data.tagline = body.tagline;
  if (body.deskripsi !== undefined || body.description !== undefined) data.deskripsi = body.deskripsi ?? body.description;
  if (body.logo !== undefined) data.logo = body.logo;
  if (body.favicon !== undefined) data.favicon = body.favicon;
  if (body.alamat !== undefined || body.address !== undefined) data.alamat = body.alamat ?? body.address;
  if (body.telepon !== undefined || body.phone !== undefined) data.telepon = body.telepon ?? body.phone;
  if (body.whatsapp !== undefined) data.whatsapp = body.whatsapp;
  if (body.email !== undefined) data.email = body.email;
  if (body.instagram !== undefined) data.instagram = body.instagram;
  if (body.youtube !== undefined) data.youtube = body.youtube;
  if (body.tiktok !== undefined) data.tiktok = body.tiktok;
  if (body.url_peta !== undefined || body.mapsUrl !== undefined) data.url_peta = body.url_peta ?? body.mapsUrl;
  if (body.url_embed_peta !== undefined || body.mapsEmbedUrl !== undefined) data.url_embed_peta = body.url_embed_peta ?? body.mapsEmbedUrl;

  if (!existing) {
    const created = await prisma.pengaturanSitus.create({ data: data as any });
    return NextResponse.json({ settings: created });
  }

  const updated = await prisma.pengaturanSitus.update({
    where: { id: existing.id },
    data,
  });

  return NextResponse.json({ settings: updated });
}
