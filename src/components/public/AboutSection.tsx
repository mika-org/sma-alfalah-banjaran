import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Trophy, School, ArrowRight } from "lucide-react";
import { AboutData } from "@/data/mock-site";

interface AboutSectionProps {
  data: AboutData;
}

export default function AboutSection({ data }: AboutSectionProps) {
  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case "graduation":
        return <GraduationCap className="w-6 h-6 text-[#0B2238]" />;
      case "activity":
        return <Trophy className="w-6 h-6 text-[#0B2238]" />;
      case "classroom":
        return <School className="w-6 h-6 text-[#0B2238]" />;
      default:
        return <School className="w-6 h-6 text-[#0B2238]" />;
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-slate-50/60 border-y border-slate-100">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              {data.badge || "Tentang Sekolah"}
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2238] tracking-tight leading-tight">
              {data.titlePart1}{" "}
              <span className="text-[#0D4A38] block mt-1">
                {data.titleHighlight}
              </span>
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              {data.description}
            </p>

            <div className="pt-2">
              <Link
                href={data.ctaLink || "/profil"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D4A38] text-white text-sm font-medium hover:bg-[#12634B] active:scale-98 transition-all shadow-sm"
              >
                <span>{data.ctaText || "Cari Tahu Lebih Lanjut"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Middle Column: School Photo */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white">
              <Image
                src={data.image || "/images/about-school.jpg"}
                alt="Kegiatan Sekolah SMA Al Falah Banjaran"
                fill
                className="object-cover hover:scale-103 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
            </div>
          </div>

          {/* Right Column: 3 Stat Cards */}
          <div className="lg:col-span-3 flex flex-col gap-3.5">
            {data.stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4 hover-lift transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {getStatIcon(stat.icon)}
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#0B2238] leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
