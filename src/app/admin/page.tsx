"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  GraduationCap,
  Plus,
  ArrowRight,
  Eye,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    counts?: {
      activities: number;
      gallery: number;
      testimonials: number;
      faqs: number;
      programs: number;
    };
    ppdb?: {
      isOpen: boolean;
      academicYear: string;
    };
    recentActivities?: Array<{
      id: string;
      title: string;
      category: string;
      eventDate: string;
      status: string;
      slug: string;
    }>;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const counts = data.counts || {
    activities: 4,
    gallery: 4,
    testimonials: 3,
    faqs: 5,
    programs: 4,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#0B2238] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 inline-block mb-2">
            Status: Sistem Aktif & Terhubung ke Database
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Panel CMS SMA Al Falah
          </h1>
          <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-xl">
            Kelola seluruh konten website publik, berita kegiatan, galeri foto, profil sekolah, dan pengaturan PPDB secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/kegiatan"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D4A38] hover:bg-[#12634B] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kegiatan</span>
          </Link>
          <Link
            href="/admin/galeri"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Foto</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Kegiatan */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              Kegiatan & Berita
            </p>
            <p className="text-2xl font-extrabold text-[#0B2238]">
              {loading ? "..." : counts.activities}
            </p>
            <Link
              href="/admin/kegiatan"
              className="text-[11px] text-[#0D4A38] font-bold hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>Kelola Berita</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2238] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Galeri Foto */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              Foto Dokumentasi
            </p>
            <p className="text-2xl font-extrabold text-[#0B2238]">
              {loading ? "..." : counts.gallery}
            </p>
            <Link
              href="/admin/galeri"
              className="text-[11px] text-[#0D4A38] font-bold hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>Kelola Galeri</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0D4A38] flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Testimoni */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              Cerita Orang Tua
            </p>
            <p className="text-2xl font-extrabold text-[#0B2238]">
              {loading ? "..." : counts.testimonials}
            </p>
            <Link
              href="/admin/testimoni"
              className="text-[11px] text-[#0D4A38] font-bold hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>Kelola Testimoni</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Status PPDB */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              Status PPDB
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-emerald-800">
                {data.ppdb?.academicYear || "2026/2027"} (Buka)
              </span>
            </div>
            <Link
              href="/admin/ppdb"
              className="text-[11px] text-[#0D4A38] font-bold hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>Atur PPDB</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0D4A38] flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-[#0B2238] mb-4">
          Aksi Cepat Pengaturan Konten
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/beranda"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#0D4A38] hover:bg-emerald-50/20 transition-all text-left group"
          >
            <span className="block text-xs font-bold text-[#0B2238] group-hover:text-[#0D4A38] mb-1">
              Edit Halaman Beranda
            </span>
            <span className="text-[11px] text-slate-500">
              Hero, 4 Keunggulan, Statistik
            </span>
          </Link>

          <Link
            href="/admin/identitas"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#0D4A38] hover:bg-emerald-50/20 transition-all text-left group"
          >
            <span className="block text-xs font-bold text-[#0B2238] group-hover:text-[#0D4A38] mb-1">
              Identitas Sekolah
            </span>
            <span className="text-[11px] text-slate-500">
              Logo, Kontak WA, Peta
            </span>
          </Link>

          <Link
            href="/admin/program"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#0D4A38] hover:bg-emerald-50/20 transition-all text-left group"
          >
            <span className="block text-xs font-bold text-[#0B2238] group-hover:text-[#0D4A38] mb-1">
              Program Unggulan
            </span>
            <span className="text-[11px] text-slate-500">
              Tahfidz, Sains, Bahasa
            </span>
          </Link>

          <Link
            href="/admin/faq"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#0D4A38] hover:bg-emerald-50/20 transition-all text-left group"
          >
            <span className="block text-xs font-bold text-[#0B2238] group-hover:text-[#0D4A38] mb-1">
              Tanya Jawab (FAQ)
            </span>
            <span className="text-[11px] text-slate-500">
              Pertanyaan umum & syarat
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activities List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#0B2238]">
            Kegiatan Terbaru yang Diterbitkan
          </h2>
          <Link
            href="/admin/kegiatan"
            className="text-xs font-bold text-[#0D4A38] hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {(data.recentActivities || []).map((act) => (
            <div
              key={act.id}
              className="py-3 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-xs font-bold text-[#0B2238] hover:text-[#0D4A38]">
                  {act.title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>{act.category}</span>
                  <span>•</span>
                  <span>
                    {new Date(act.eventDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {act.status}
                </span>
                <Link
                  href={`/kegiatan/${act.slug}`}
                  target="_blank"
                  className="p-1 text-slate-400 hover:text-slate-700"
                  title="Lihat di web publik"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
