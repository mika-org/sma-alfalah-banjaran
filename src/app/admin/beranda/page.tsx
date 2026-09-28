"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Save, CheckCircle2, Upload } from "lucide-react";

export default function BerandaAdminPage() {
  const [home, setHome] = useState({
    titlePart1: "",
    titleHighlight: "",
    titlePart2: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    heroImage: "",
    accreditationGrade: "",
    accreditationBody: "",
    ppdbStatus: "",
    ppdbAcademicYear: "",
    aboutBadge: "",
    aboutTitlePart1: "",
    aboutTitleHighlight: "",
    aboutDescription: "",
    aboutCtaText: "",
    aboutCtaLink: "",
    aboutImage: "",
  });

  const [features, setFeatures] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    fetch("/api/admin/beranda")
      .then((res) => res.json())
      .then((data) => {
        if (data.home) setHome(data.home);
        if (data.features) setFeatures(data.features);
        if (data.statistics) setStatistics(data.statistics);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setHome((prev) => ({ ...prev, heroImage: data.url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleFeatureChange = (index: number, field: string, val: any) => {
    const updated = [...features];
    updated[index][field] = val;
    setFeatures(updated);
  };

  const handleStatChange = (index: number, field: string, val: any) => {
    const updated = [...statistics];
    updated[index][field] = val;
    setStatistics(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/beranda", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home, features, statistics }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan perubahan.");

      setMessage("Konten beranda berhasil diperbarui!");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Terjadi kesalahan.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Memuat konten beranda...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
          Pengaturan Halaman Beranda
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit teks hero, akreditasi, 4 keunggulan sekolah, profil ringkas, dan 3 statistik capaian.
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Hero Settings */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0B2238] border-b border-slate-100 pb-3">
            1. Bagian Hero (Utama)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Baris 1
              </label>
              <input
                type="text"
                value={home.titlePart1}
                onChange={(e) => setHome({ ...home, titlePart1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1">
                Judul Sorotan (Warna Hijau)
              </label>
              <input
                type="text"
                value={home.titleHighlight}
                onChange={(e) => setHome({ ...home, titleHighlight: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-semibold text-[#0D4A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Baris 2
              </label>
              <input
                type="text"
                value={home.titlePart2}
                onChange={(e) => setHome({ ...home, titlePart2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deskripsi Subheadline
            </label>
            <textarea
              rows={2}
              value={home.subtitle}
              onChange={(e) => setHome({ ...home, subtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Tombol CTA
              </label>
              <input
                type="text"
                value={home.ctaText}
                onChange={(e) => setHome({ ...home, ctaText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tautan Tombol CTA
              </label>
              <input
                type="text"
                value={home.ctaLink}
                onChange={(e) => setHome({ ...home, ctaLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
          </div>

          {/* Floating Badges info */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peringkat Akreditasi
              </label>
              <input
                type="text"
                value={home.accreditationGrade}
                onChange={(e) => setHome({ ...home, accreditationGrade: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lembaga Akreditasi
              </label>
              <input
                type="text"
                value={home.accreditationBody}
                onChange={(e) => setHome({ ...home, accreditationBody: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status PPDB
              </label>
              <input
                type="text"
                value={home.ppdbStatus}
                onChange={(e) => setHome({ ...home, ppdbStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tahun Ajaran Aktif
              </label>
              <input
                type="text"
                value={home.ppdbAcademicYear}
                onChange={(e) => setHome({ ...home, ppdbAcademicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
          </div>

          {/* Hero Image */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-6">
            <div className="relative w-36 aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              <Image
                src={home.heroImage || "/images/hero-students-hd.jpg"}
                alt="Hero Preview"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">
                Foto Visual Hero
              </h4>
              <p className="text-[11px] text-slate-500 mb-2">
                Foto beresolusi tinggi dengan rasio 16:9 atau 16:10.
              </p>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingHero ? "Mengunggah..." : "Upload Foto Hero"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: 4 Keunggulan (Mengapa Memilih Kami) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0D4A38] border-b border-slate-100 pb-3">
            2. Empat Keunggulan (Mengapa Memilih Kami)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    Kartu Keunggulan #{idx + 1}
                  </span>
                  <select
                    value={item.icon}
                    onChange={(e) => handleFeatureChange(idx, "icon", e.target.value)}
                    className="text-xs px-2 py-1 rounded border border-slate-200 bg-white"
                  >
                    <option value="trophy">Icon Trophy (Prestasi)</option>
                    <option value="heart">Icon Heart (Akhlak)</option>
                    <option value="building">Icon Gedung (Lingkungan)</option>
                    <option value="book">Icon Buku (Kurikulum)</option>
                    <option value="star">Icon Bintang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Judul Keunggulan
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0D4A38] outline-none bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Uraian Deskripsi
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      handleFeatureChange(idx, "description", e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0D4A38] outline-none bg-white resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: 3 Statistik Capaian */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0B2238] border-b border-slate-100 pb-3">
            3. Tiga Statistik Capaian (Tentang Sekolah)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statistics.map((stat, idx) => (
              <div
                key={stat.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <span className="text-xs font-bold text-slate-600">
                  Statistik #{idx + 1}
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nilai Angka (Contoh: 25:1, 30+, 20+)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0D4A38] outline-none bg-white font-bold text-[#0B2238]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Keterangan Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0D4A38] outline-none bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] active:scale-98 transition-all disabled:opacity-50 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Seluruh Perubahan Beranda"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
