"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryPhoto } from "@/data/mock-site";

interface GalleryCarouselProps {
  photos: GalleryPhoto[];
}

export default function GalleryCarousel({ photos }: GalleryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="section-container">
        {/* Navy Rounded Container */}
        <div className="bg-[#0B2238] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dokumentasi Sekolah Kami
            </h2>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm">
              Momen dan kegiatan nyata santri dan siswa-siswi SMA Al Falah Banjaran
            </p>
          </div>

          {/* Carousel Wrapper with Floating Navigation Buttons */}
          <div className="relative">
            {/* Prev Button */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#0B2238] flex items-center justify-center shadow-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scrollable Photos Row */}
            <div
              ref={scrollRef}
              role="region"
              aria-label="Galeri Foto Dokumentasi"
              className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 focus:outline-none"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") scroll("left");
                if (e.key === "ArrowRight") scroll("right");
              }}
            >
              {photos.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[200px] sm:w-[220px] lg:w-[235px] group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-800 border-2 border-white/20 shadow-md transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/60">
                    <Image
                      src={item.imageUrl}
                      alt={item.altText || item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 200px, 240px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-xs font-medium leading-snug">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#0B2238] flex items-center justify-center shadow-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Foto Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
