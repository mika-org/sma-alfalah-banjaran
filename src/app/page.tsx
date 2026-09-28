import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import FeatureSection from "@/components/public/FeatureSection";
import AboutSection from "@/components/public/AboutSection";
import GalleryCarousel from "@/components/public/GalleryCarousel";
import TestimonialSection from "@/components/public/TestimonialSection";
import FaqSection from "@/components/public/FaqSection";
import Footer from "@/components/public/Footer";
import { prisma } from "@/lib/prisma";
import {
  initialSiteSettings,
  initialHeroData,
  initialFeatures,
  initialAboutData,
  initialGallery,
  initialTestimonials,
  initialFaqs,
} from "@/data/mock-site";

export const revalidate = 0; // Dynamic server rendering for live CMS updates

export default async function HomePage() {
  let settings = initialSiteSettings;
  let heroData = initialHeroData;
  let features = initialFeatures;
  let aboutData = initialAboutData;
  let gallery = initialGallery;
  let testimonials = initialTestimonials;
  let faqs = initialFaqs;

  try {
    const [
      dbSettings,
      dbHome,
      dbFeatures,
      dbStats,
      dbGallery,
      dbTestimonials,
      dbFaqs,
    ] = await Promise.all([
      prisma.pengaturanSitus.findFirst(),
      prisma.beranda.findFirst(),
      prisma.keunggulan.findMany({
        where: { status_terbit: true },
        orderBy: { urutan: "asc" },
      }),
      prisma.statistik.findMany({
        where: { status_terbit: true },
        orderBy: { urutan: "asc" },
      }),
      prisma.galeri.findMany({
        where: { status_terbit: true },
        orderBy: { urutan: "asc" },
      }),
      prisma.testimoni.findMany({
        where: { status_terbit: true },
        orderBy: { urutan: "asc" },
      }),
      prisma.faq.findMany({
        where: { status_terbit: true },
        orderBy: { urutan: "asc" },
      }),
    ]);

    if (dbSettings) {
      settings = {
        name: dbSettings.nama,
        tagline: dbSettings.tagline,
        description: dbSettings.deskripsi,
        logo: dbSettings.logo || initialSiteSettings.logo,
        address: dbSettings.alamat,
        phone: dbSettings.telepon,
        whatsapp: dbSettings.whatsapp,
        email: dbSettings.email,
        instagram: dbSettings.instagram || initialSiteSettings.instagram,
        youtube: dbSettings.youtube || initialSiteSettings.youtube,
        tiktok: dbSettings.tiktok || initialSiteSettings.tiktok,
        mapsUrl: dbSettings.url_peta || initialSiteSettings.mapsUrl,
        mapsEmbedUrl: dbSettings.url_embed_peta || initialSiteSettings.mapsEmbedUrl,
      };
    }

    if (dbHome) {
      heroData = {
        titlePart1: dbHome.judul_utama_1,
        titleHighlight: dbHome.judul_sorotan,
        titlePart2: dbHome.judul_utama_2,
        subtitle: dbHome.subjudul,
        ctaText: dbHome.teks_cta,
        ctaLink: dbHome.tautan_cta,
        heroImage: dbHome.gambar_hero || initialHeroData.heroImage,
        accreditationGrade: dbHome.peringkat_akreditasi,
        accreditationBody: dbHome.lembaga_akreditasi,
        ppdbStatus: dbHome.status_ppdb,
        ppdbAcademicYear: dbHome.tahun_ajaran_ppdb,
        ppdbActive: true,
      };

      aboutData = {
        badge: dbHome.label_tentang,
        titlePart1: dbHome.judul_tentang_1,
        titleHighlight: dbHome.judul_tentang_sorotan,
        description: dbHome.deskripsi_tentang,
        ctaText: dbHome.teks_cta_tentang,
        ctaLink: dbHome.tautan_cta_tentang,
        image: dbHome.gambar_tentang || initialAboutData.image,
        stats:
          dbStats.length > 0
            ? dbStats.map((s) => ({
                id: s.id,
                value: s.nilai,
                label: s.label,
                icon: s.ikon as any,
                sortOrder: s.urutan,
              }))
            : initialAboutData.stats,
      };
    }

    if (dbFeatures.length > 0) {
      features = dbFeatures.map((f) => ({
        id: f.id,
        title: f.judul,
        description: f.deskripsi,
        icon: f.ikon as any,
        sortOrder: f.urutan,
      }));
    }

    if (dbGallery.length > 0) {
      gallery = dbGallery.map((g) => ({
        id: g.id,
        title: g.judul,
        altText: g.teks_alt || g.judul,
        imageUrl: g.url_gambar,
        sortOrder: g.urutan,
      }));
    }

    if (dbTestimonials.length > 0) {
      testimonials = dbTestimonials.map((t) => ({
        id: t.id,
        name: t.nama,
        relation: t.hubungan,
        quote: t.kutipan,
        photoUrl: t.url_foto,
        sortOrder: t.urutan,
      }));
    }

    if (dbFaqs.length > 0) {
      faqs = dbFaqs.map((faq) => ({
        id: faq.id,
        question: faq.pertanyaan,
        answer: faq.jawaban,
        sortOrder: faq.urutan,
      }));
    }
  } catch (error) {
    console.warn("Using fallback initial site data:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">
        <Hero data={heroData} />
        <FeatureSection features={features} />
        <AboutSection data={aboutData} />
        <GalleryCarousel photos={gallery} />
        <TestimonialSection testimonials={testimonials} />
        <FaqSection faqs={faqs} settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
