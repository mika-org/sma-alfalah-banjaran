"use client";

import { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  ExternalLink,
  MapPin,
} from "lucide-react";
import {
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon,
} from "@/components/ui/SocialIcons";
import { FaqItem, SiteSettings } from "@/data/mock-site";

interface FaqSectionProps {
  faqs: FaqItem[];
  settings: SiteSettings;
}

export default function FaqSection({ faqs, settings }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappClean =
    settings.whatsapp?.replace(/\D/g, "") || "6281234567890";
  const waUrl = `https://wa.me/${whatsappClean}?text=Halo%20Admin%20SMA%20Al%20Falah%20Banjaran,%20saya%20ingin%20bertanya%20informasi%20sekolah`;

  return (
    <section className="py-14 sm:py-20 bg-slate-50/50 border-t border-slate-100">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2238] tracking-tight">
            Pertanyaan yang Sering diajukan
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Informasi lengkap dan jawaban atas pertanyaan umum seputar SMA Al Falah Banjaran
          </p>
        </div>

        {/* 2-Column Balanced Grid: Left (FAQ) & Right (Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: FAQ Accordion */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl overflow-hidden bg-white shadow-xs transition-all duration-200 ${
                    isOpen
                      ? "border-[#0D4A38]/40 ring-1 ring-[#0D4A38]/10"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left py-4 px-4 sm:py-4.5 sm:px-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#0B2238] hover:text-[#0D4A38] transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? "bg-emerald-50 text-[#0D4A38] rotate-180"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4.5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: 3 Balanced Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Card 1: Masih ada pertanyaan? */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#0B2238] mb-1">
                  Masih ada pertanyaan?
                </h3>
                <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
                  Hubungi kami via Whatsapp, Kami siap membantu memberikan penjelasan lengkap untuk Anda!
                </p>
              </div>
              <div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B2238] text-white text-xs font-semibold hover:bg-[#123758] active:scale-98 transition-all shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Hubungi Kami</span>
                </a>
              </div>
            </div>

            {/* Card 2: Sosial Media Kami */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-[#0B2238] mb-3">
                Sosial Media Kami
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#0D4A38] transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-600" />
                  <span>{settings.instagram || "@smaalfalahbanjaran"}</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#0D4A38] transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4 text-red-600" />
                  <span>{settings.youtube || "SMA Al Falah Banjaran"}</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#0D4A38] transition-colors"
                >
                  <TiktokIcon className="w-4 h-4 text-slate-900" />
                  <span>{settings.tiktok || "@smaalfalahbanjaran"}</span>
                </a>
              </div>
            </div>

            {/* Card 3: Peta Lokasi SMA Al Falah Banjaran */}
            <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="relative h-36 sm:h-40 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <iframe
                  title="Lokasi SMA Al Falah Banjaran"
                  src={settings.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="mt-2.5 px-1 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate pr-2 flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-3 h-3 text-[#0D4A38] shrink-0" />
                  <span>Sindangpanon, Banjaran, Kab. Bandung</span>
                </span>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0D4A38] font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>Buka Peta</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
