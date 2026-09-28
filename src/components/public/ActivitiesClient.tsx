"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, Search, ArrowRight } from "lucide-react";
import { ActivityItem } from "@/data/mock-site";

interface ActivitiesClientProps {
  initialActivities: ActivityItem[];
}

export default function ActivitiesClient({
  initialActivities,
}: ActivitiesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Semua",
    "Keagamaan",
    "Akademik",
    "Sosial & Lingkungan",
    "Prestasi",
    "Umum",
  ];

  const filtered = initialActivities.filter((item) => {
    const matchCat =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="py-12 bg-white">
      <div className="section-container">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#0B2238] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0D4A38]"
            />
          </div>
        </div>

        {/* Activities Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">
              Tidak ada kegiatan yang sesuai dengan kriteria pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((act) => (
              <article
                key={act.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between transition-all"
              >
                <div>
                  <Link
                    href={`/kegiatan/${act.slug}`}
                    className="block relative aspect-[16/10] w-full bg-slate-100 overflow-hidden group"
                  >
                    <Image
                      src={act.coverImage}
                      alt={act.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B2238]/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      <span>{act.category}</span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <time dateTime={act.eventDate}>
                        {new Date(act.eventDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <h3 className="font-bold text-base text-[#0B2238] leading-snug line-clamp-2 hover:text-[#0D4A38] transition-colors mb-2">
                      <Link href={`/kegiatan/${act.slug}`}>{act.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {act.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                  <Link
                    href={`/kegiatan/${act.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0D4A38] hover:text-[#0B2238] transition-colors pt-3"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
