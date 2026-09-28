import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let page = await prisma.halaman.findUnique({
    where: { slug: "profil" },
  });

  if (!page) {
    page = await prisma.halaman.create({
      data: {
        slug: "profil",
        judul: "Profil & Visi Misi",
        konten: JSON.stringify({
          visi: "Terwujudnya Peserta Didik yang Beriman dan Bertaqwa, Berakhlak Mulia, Unggul dalam Prestasi Akademik dan Non-Akademik, serta Berwawasan Lingkungan dan Global.",
          misi: [
            "Menyelenggarakan pembelajaran kurikulum nasional yang diperkaya nilai kepesantrenan dan pembiasaan ibadah.",
            "Membina hafalan dan pemahaman Al-Qur'an melalui program Tahfidz reguler dan intensif.",
            "Mengembangkan potensi minat, bakat, kepemimpinan, dan kewirausahaan siswa melalui ekstrakurikuler aktif.",
            "Menciptakan lingkungan sekolah yang hijau, bersih, religius, aman, dan berdaya saing.",
          ],
          principalName: "Drs. H. Mulyana, M.M.Pd",
          principalRole: "Kepala Sekolah SMA Al Falah Banjaran",
          greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSegala puji bagi Allah SWT yang senantiasa melimpahkan taufiq dan hidayah-Nya. SMA Al Falah Banjaran hadir di tengah masyarakat sebagai wadah pendidikan menengah atas yang berikhtiar memadukan kecerdasan intelektual, kematangan emosional, dan keluhuran spiritual.",
        }),
      },
    });
  }

  return NextResponse.json({
    page: {
      ...page,
      content: page.konten,
    },
  });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const updated = await prisma.halaman.upsert({
    where: { slug: "profil" },
    update: {
      konten: JSON.stringify(body),
    },
    create: {
      slug: "profil",
      judul: "Profil & Visi Misi",
      konten: JSON.stringify(body),
    },
  });

  return NextResponse.json({ page: updated });
}
