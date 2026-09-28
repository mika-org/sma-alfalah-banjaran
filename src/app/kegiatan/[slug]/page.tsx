import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import {
  Calendar,
  Tag,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { initialSiteSettings, initialActivities } from "@/data/mock-site";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let activity: any = null;

  try {
    const dbItem = await prisma.kegiatan.findUnique({
      where: { slug },
    });
    if (dbItem) {
      activity = {
        title: dbItem.judul,
        excerpt: dbItem.ringkasan,
        coverImage: dbItem.gambar_sampul,
      };
    }
  } catch (_e) {
    activity = initialActivities.find((a) => a.slug === slug);
  }

  if (!activity) {
    activity = initialActivities.find((a) => a.slug === slug);
  }

  if (!activity) return { title: "Kegiatan Tidak Ditemukan" };

  return {
    title: `${activity.title} | SMA Al Falah Banjaran`,
    description: activity.excerpt,
    openGraph: {
      title: activity.title,
      description: activity.excerpt,
      images: [activity.coverImage],
    },
  };
}

export default async function KegiatanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let activity: any = null;
  let otherActivities: any[] = [];
  let settings = initialSiteSettings;

  try {
    const [dbAct, dbOthers, dbSettings] = await Promise.all([
      prisma.kegiatan.findUnique({
        where: { slug },
      }),
      prisma.kegiatan.findMany({
        where: { slug: { not: slug }, status: "PUBLISHED" },
        take: 3,
        orderBy: { tanggal_kegiatan: "desc" },
      }),
      prisma.pengaturanSitus.findFirst(),
    ]);

    if (dbAct) {
      activity = {
        id: dbAct.id,
        slug: dbAct.slug,
        title: dbAct.judul,
        excerpt: dbAct.ringkasan,
        content: dbAct.konten,
        coverImage: dbAct.gambar_sampul,
        category: dbAct.kategori,
        eventDate: dbAct.tanggal_kegiatan.toISOString(),
      };
    }
    if (dbOthers && dbOthers.length > 0) {
      otherActivities = dbOthers.map((o) => ({
        id: o.id,
        slug: o.slug,
        title: o.judul,
        excerpt: o.ringkasan,
        coverImage: o.gambar_sampul,
        eventDate: o.tanggal_kegiatan.toISOString(),
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
    console.warn("Using fallback activity detail", e);
  }

  if (!activity) {
    activity = initialActivities.find((a) => a.slug === slug);
  }

  if (!activity) {
    notFound();
  }

  if (otherActivities.length === 0) {
    otherActivities = initialActivities.filter((a) => a.slug !== slug).slice(0, 3);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1 bg-slate-50/50 py-10">
        <div className="section-container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-[#0B2238]">
              Beranda
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/kegiatan" className="hover:text-[#0B2238]">
              Kegiatan
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-[#0D4A38] font-semibold truncate max-w-xs">
              {activity.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Article Content */}
            <article className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-emerald-50 text-[#0D4A38] text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {activity.category}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(activity.eventDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2238] tracking-tight leading-snug mb-6">
                {activity.title}
              </h1>

              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 bg-slate-100 shadow-xs">
                <Image
                  src={activity.coverImage}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 750px"
                  priority
                />
              </div>

              {/* Lead Paragraph */}
              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#0D4A38] text-slate-700 text-sm italic mb-6">
                {activity.excerpt}
              </div>

              {/* Body Text */}
              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
                <p>{activity.content}</p>
                <p>
                  Kegiatan ini merupakan bagian integral dari pembinaan karakter dan peningkatan wawasan siswa di SMA Al Falah Banjaran. Diharapkan dengan terlaksananya kegiatan positif ini, seluruh santri dapat terus termotivasi untuk mengembangkan potensi diri dan berakhlak mulia.
                </p>
                <p>
                  Pihak sekolah senantiasa mendukung penuh setiap kreativitas dan inisiatif positif yang digagas oleh siswa dan para pembina.
                </p>
              </div>

              {/* Back Button */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/kegiatan"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0B2238] hover:text-[#0D4A38] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Semua Kegiatan</span>
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* PPDB Banner Card */}
              <div className="bg-[#0B2238] rounded-2xl p-6 text-white shadow-md">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 block mb-1">
                  Pendaftaran Santri Baru
                </span>
                <h3 className="text-lg font-bold mb-2">
                  PPDB SMA Al Falah Banjaran Dibuka
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Daftarkan putra-putri Anda untuk Tahun Ajaran 2026/2027. Kuota terbatas!
                </p>
                <Link
                  href="/ppdb"
                  className="inline-block w-full py-2.5 px-4 rounded-lg bg-emerald-600 text-white text-xs font-bold text-center hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  Informasi & Daftar PPDB
                </Link>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                <h3 className="font-bold text-sm text-[#0B2238] mb-4 pb-2 border-b border-slate-100">
                  Kegiatan Lainnya
                </h3>
                <div className="space-y-4">
                  {otherActivities.map((item) => (
                    <Link
                      key={item.id}
                      href={`/kegiatan/${item.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <div className="relative w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#0D4A38] transition-colors leading-tight mb-1">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.eventDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
