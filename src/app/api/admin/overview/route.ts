import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    activitiesCount,
    galleryCount,
    testimonialsCount,
    faqsCount,
    programsCount,
    ppdbSetting,
    recentActivities,
  ] = await Promise.all([
    prisma.kegiatan.count(),
    prisma.galeri.count(),
    prisma.testimoni.count(),
    prisma.faq.count(),
    prisma.program.count(),
    prisma.pengaturanPpdb.findFirst(),
    prisma.kegiatan.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return NextResponse.json({
    counts: {
      activities: activitiesCount,
      gallery: galleryCount,
      testimonials: testimonialsCount,
      faqs: faqsCount,
      programs: programsCount,
    },
    ppdb: ppdbSetting
      ? {
          ...ppdbSetting,
          academicYear: ppdbSetting.tahun_ajaran,
          isOpen: ppdbSetting.status_buka,
        }
      : null,
    recentActivities: recentActivities.map((act) => ({
      ...act,
      title: act.judul,
      category: act.kategori,
      eventDate: act.tanggal_kegiatan,
    })),
  });
}
