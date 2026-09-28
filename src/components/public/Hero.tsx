import Image from "next/image";
import Link from "next/link";
import { Award, Calendar, ArrowRight } from "lucide-react";
import { HeroData } from "@/data/mock-site";

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading and CTA */}
          <div className="lg:col-span-6 space-y-6 z-10 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.2] text-[#0B2238]">
              {data.titlePart1}{" "}
              <span className="text-[#0D4A38] block mt-1">
                {data.titleHighlight}
              </span>{" "}
              <span className="block mt-1">{data.titlePart2}</span>
            </h1>

            <p className="text-slate-600 text-base lg:text-lg max-w-xl leading-relaxed">
              {data.subtitle}
            </p>

            <div className="pt-2">
              <Link
                href={data.ctaLink || "/ppdb"}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#0B2238] text-white font-medium text-base hover:bg-[#123758] active:scale-98 transition-all shadow-md hover:shadow-lg"
              >
                <span>{data.ctaText || "Daftar Sekarang"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Image & Floating Badges */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            {/* Main Visual Container */}
            <div className="relative mx-auto max-w-[540px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={data.heroImage || "/images/hero-students-hd.jpg"}
                  alt="Siswa-siswi SMA Al Falah Banjaran"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                  priority
                />
              </div>
            </div>

            {/* Floating Card 1: Akreditasi */}
            <div className="absolute -top-4 -right-2 sm:right-2 bg-white/95 backdrop-blur-sm rounded-xl p-3.5 sm:p-4 shadow-lg border border-slate-100 flex items-center gap-3.5 z-20 transition-transform hover:-translate-y-0.5">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#0D4A38] flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Akreditasi
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#0B2238] leading-tight">
                  {data.accreditationGrade}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {data.accreditationBody}
                </p>
              </div>
            </div>

            {/* Floating Card 2: PPDB Aktif */}
            <div className="absolute -bottom-5 sm:bottom-4 -left-2 sm:left-2 bg-white/95 backdrop-blur-sm rounded-xl p-3.5 sm:p-4 shadow-lg border border-slate-100 flex items-center gap-3.5 z-20 transition-transform hover:-translate-y-0.5">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#0D4A38] flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D4A38]">
                  {data.ppdbStatus}
                </p>
                <p className="text-[11px] text-slate-500">Tahun Ajaran</p>
                <p className="text-sm font-bold text-[#0B2238]">
                  {data.ppdbAcademicYear}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
