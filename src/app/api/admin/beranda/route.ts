import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let home = await prisma.beranda.findFirst();
  if (!home) {
    home = await prisma.beranda.create({
      data: {
        judul_utama_1: "Mewujudkan Generasi",
        judul_sorotan: "Berilmu, Berakhlak,",
        judul_utama_2: "dan Siap Menghadapi Masa Depan",
        subjudul: "SMA Al Falah Banjaran adalah sekolah islami unggul...",
        deskripsi_tentang: "SMA Al Falah Banjaran berkomitmen mendidik...",
      },
    });
  }

  const features = await prisma.keunggulan.findMany({
    orderBy: { urutan: "asc" },
  });

  const statistics = await prisma.statistik.findMany({
    orderBy: { urutan: "asc" },
  });

  const mappedHome = {
    ...home,
    titlePart1: home.judul_utama_1,
    titleHighlight: home.judul_sorotan,
    titlePart2: home.judul_utama_2,
    subtitle: home.subjudul,
    ctaText: home.teks_cta,
    ctaLink: home.tautan_cta,
    heroImage: home.gambar_hero,
    accreditationGrade: home.peringkat_akreditasi,
    accreditationBody: home.lembaga_akreditasi,
    ppdbStatus: home.status_ppdb,
    ppdbAcademicYear: home.tahun_ajaran_ppdb,
    aboutBadge: home.label_tentang,
    aboutTitlePart1: home.judul_tentang_1,
    aboutTitleHighlight: home.judul_tentang_sorotan,
    aboutDescription: home.deskripsi_tentang,
    aboutCtaText: home.teks_cta_tentang,
    aboutCtaLink: home.tautan_cta_tentang,
    aboutImage: home.gambar_tentang,
  };

  const mappedFeatures = features.map((f) => ({
    ...f,
    title: f.judul,
    description: f.deskripsi,
    icon: f.ikon,
    sortOrder: f.urutan,
    isPublished: f.status_terbit,
  }));

  const mappedStatistics = statistics.map((s) => ({
    ...s,
    value: s.nilai,
    icon: s.ikon,
    sortOrder: s.urutan,
    isPublished: s.status_terbit,
  }));

  return NextResponse.json({
    home: mappedHome,
    features: mappedFeatures,
    statistics: mappedStatistics,
  });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { home, features, statistics } = body;

  let updatedHome = null;
  if (home) {
    const existing = await prisma.beranda.findFirst();
    if (existing) {
      const data: Record<string, any> = {};
      if (home.judul_utama_1 !== undefined || home.titlePart1 !== undefined) data.judul_utama_1 = home.judul_utama_1 ?? home.titlePart1;
      if (home.judul_sorotan !== undefined || home.titleHighlight !== undefined) data.judul_sorotan = home.judul_sorotan ?? home.titleHighlight;
      if (home.judul_utama_2 !== undefined || home.titlePart2 !== undefined) data.judul_utama_2 = home.judul_utama_2 ?? home.titlePart2;
      if (home.subjudul !== undefined || home.subtitle !== undefined) data.subjudul = home.subjudul ?? home.subtitle;
      if (home.teks_cta !== undefined || home.ctaText !== undefined) data.teks_cta = home.teks_cta ?? home.ctaText;
      if (home.tautan_cta !== undefined || home.ctaLink !== undefined) data.tautan_cta = home.tautan_cta ?? home.ctaLink;
      if (home.gambar_hero !== undefined || home.heroImage !== undefined) data.gambar_hero = home.gambar_hero ?? home.heroImage;
      if (home.peringkat_akreditasi !== undefined || home.accreditationGrade !== undefined) data.peringkat_akreditasi = home.peringkat_akreditasi ?? home.accreditationGrade;
      if (home.lembaga_akreditasi !== undefined || home.accreditationBody !== undefined) data.lembaga_akreditasi = home.lembaga_akreditasi ?? home.accreditationBody;
      if (home.status_ppdb !== undefined || home.ppdbStatus !== undefined) data.status_ppdb = home.status_ppdb ?? home.ppdbStatus;
      if (home.tahun_ajaran_ppdb !== undefined || home.ppdbAcademicYear !== undefined) data.tahun_ajaran_ppdb = home.tahun_ajaran_ppdb ?? home.ppdbAcademicYear;
      if (home.label_tentang !== undefined || home.aboutBadge !== undefined) data.label_tentang = home.label_tentang ?? home.aboutBadge;
      if (home.judul_tentang_1 !== undefined || home.aboutTitlePart1 !== undefined) data.judul_tentang_1 = home.judul_tentang_1 ?? home.aboutTitlePart1;
      if (home.judul_tentang_sorotan !== undefined || home.aboutTitleHighlight !== undefined) data.judul_tentang_sorotan = home.judul_tentang_sorotan ?? home.aboutTitleHighlight;
      if (home.deskripsi_tentang !== undefined || home.aboutDescription !== undefined) data.deskripsi_tentang = home.deskripsi_tentang ?? home.aboutDescription;
      if (home.teks_cta_tentang !== undefined || home.aboutCtaText !== undefined) data.teks_cta_tentang = home.teks_cta_tentang ?? home.aboutCtaText;
      if (home.tautan_cta_tentang !== undefined || home.aboutCtaLink !== undefined) data.tautan_cta_tentang = home.tautan_cta_tentang ?? home.aboutCtaLink;
      if (home.gambar_tentang !== undefined || home.aboutImage !== undefined) data.gambar_tentang = home.gambar_tentang ?? home.aboutImage;

      updatedHome = await prisma.beranda.update({
        where: { id: existing.id },
        data,
      });
    }
  }

  // Update features if provided
  if (Array.isArray(features)) {
    for (const f of features) {
      if (f.id) {
        await prisma.keunggulan.update({
          where: { id: f.id },
          data: {
            judul: f.judul ?? f.title,
            deskripsi: f.deskripsi ?? f.description,
            ikon: f.ikon ?? f.icon,
            urutan: f.urutan ?? f.sortOrder,
            status_terbit: f.status_terbit ?? f.isPublished,
          },
        });
      }
    }
  }

  // Update statistics if provided
  if (Array.isArray(statistics)) {
    for (const s of statistics) {
      if (s.id) {
        await prisma.statistik.update({
          where: { id: s.id },
          data: {
            nilai: s.nilai ?? s.value,
            label: s.label,
            ikon: s.ikon ?? s.icon,
            urutan: s.urutan ?? s.sortOrder,
            status_terbit: s.status_terbit ?? s.isPublished,
          },
        });
      }
    }
  }

  return NextResponse.json({ success: true, home: updatedHome });
}
