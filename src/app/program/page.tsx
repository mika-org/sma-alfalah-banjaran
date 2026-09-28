import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHero from "@/components/public/PageHero";
import { BookOpen, Atom, Mic, Trophy, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { initialSiteSettings, initialPrograms, ProgramItem } from "@/data/mock-site";

export const revalidate = 0;

export default async function ProgramPage() {
  let programs: ProgramItem[] = initialPrograms;
  let settings = initialSiteSettings;

  try {
    const [dbPrograms, dbSettings] = await Promise.all([
      prisma.program.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { urutan: "asc" },
      }),
      prisma.pengaturanSitus.findFirst(),
    ]);

    if (dbPrograms && dbPrograms.length > 0) {
      programs = dbPrograms.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.judul,
        summary: p.ringkasan,
        content: p.konten,
        image: p.gambar,
        icon: p.ikon,
        sortOrder: p.urutan,
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
    console.warn("Using default programs", e);
  }

  const getProgramIcon = (icon: string) => {
    switch (icon) {
      case "book":
        return <BookOpen className="w-5 h-5" />;
      case "atom":
        return <Atom className="w-5 h-5" />;
      case "mic":
        return <Mic className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">
        <PageHero
          badge="Kurikulum & Pembinaan"
          title="Program Unggulan Sekolah"
          description="Rangkaian program terpadu yang dirancang khusus untuk memadukan kedalaman spiritual, keunggulan sains, kemampuan komunikasi, dan kepemimpinan masa depan."
          breadcrumb="Program"
        />

        <section className="py-14 sm:py-16 bg-white">
          <div className="section-container space-y-12">
            {programs.map((prog, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={prog.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl p-6 sm:p-8 border border-slate-200/80 bg-slate-50/40 hover-lift transition-all ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`lg:col-span-5 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden shadow-md bg-slate-200">
                      <Image
                        src={prog.image}
                        alt={prog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 450px"
                      />
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-7 space-y-4 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-[#0D4A38] text-xs font-semibold border border-emerald-200/60">
                      {getProgramIcon(prog.icon)}
                      <span>Program #{prog.sortOrder || index + 1}</span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#0B2238] tracking-tight">
                      {prog.title}
                    </h2>

                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {prog.summary}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {prog.content}
                    </p>

                    <div className="pt-2">
                      <Link
                        href="/ppdb"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D4A38] hover:text-[#0B2238] transition-colors"
                      >
                        <span>Daftar Melalui Program Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="py-14 bg-slate-50 border-t border-slate-200">
          <div className="section-container text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase text-[#0D4A38] tracking-wider block mb-2">
              Sinergi Pendidikan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2238] mb-4">
              Kurikulum Nasional & Kepesantrenan Modern
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-8">
              SMA Al Falah Banjaran mengimplementasikan Kurikulum Merdeka yang fleksibel dan berfokus pada materi esensial, diselaraskan dengan kurikulum khas pesantren yang mencakup Aqidah, Akhlak, Fiqih Ibadah, dan Bahasa Arab.
            </p>
            <Link
              href="/ppdb"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B2238] text-white text-sm font-semibold hover:bg-[#123758] transition-all shadow-md"
            >
              <span>Daftar Sekarang untuk Tahun Ajaran 2026/2027</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
