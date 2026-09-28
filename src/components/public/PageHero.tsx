import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  badge?: string;
  description: string;
  breadcrumb?: string;
}

export default function PageHero({
  title,
  badge,
  description,
  breadcrumb,
}: PageHeroProps) {
  return (
    <div className="bg-[#0B2238] text-white py-12 sm:py-16 relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0D4A38]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="section-container relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-emerald-400 font-medium">
            {breadcrumb || title}
          </span>
        </div>

        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            {badge}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-3">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
