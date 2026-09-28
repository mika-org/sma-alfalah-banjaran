import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHero from "@/components/public/PageHero";
import ActivitiesClient from "@/components/public/ActivitiesClient";
import { prisma } from "@/lib/prisma";
import { initialSiteSettings, initialActivities, ActivityItem } from "@/data/mock-site";

export const metadata = {
  title: "Kegiatan & Berita Sekolah | SMA Al Falah Banjaran",
  description:
    "Ikuti perkembangan, momen berharga, prestasi santri, dan ragam aktivitas edukatif di lingkungan SMA Al Falah Banjaran.",
};

export const revalidate = 0;

export default async function KegiatanPage() {
  let activities: ActivityItem[] = initialActivities;
  let settings = initialSiteSettings;

  try {
    const [dbActivities, dbSettings] = await Promise.all([
      prisma.kegiatan.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { tanggal_kegiatan: "desc" },
      }),
      prisma.pengaturanSitus.findFirst(),
    ]);

    if (dbActivities && dbActivities.length > 0) {
      activities = dbActivities.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.judul,
        excerpt: a.ringkasan,
        content: a.konten,
        coverImage: a.gambar_sampul,
        category: a.kategori,
        eventDate: a.tanggal_kegiatan.toISOString(),
        status: a.status as any,
      }));
    }

    if (dbSettings) {
      settings = {
        ...initialSiteSettings,
        name: dbSettings.nama,
        address: dbSettings.alamat,
        phone: dbSettings.telepon,
        whatsapp: dbSettings.whatsapp,
        email: dbSettings.email,
      };
    }
  } catch (e) {
    console.warn("Using fallback activities", e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">
        <PageHero
          badge="Kabar & Aktivitas"
          title="Kegiatan & Berita Sekolah"
          description="Ikuti perkembangan, momen berharga, prestasi santri, dan ragam aktivitas edukatif di lingkungan SMA Al Falah Banjaran."
          breadcrumb="Kegiatan"
        />

        <ActivitiesClient initialActivities={activities} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
