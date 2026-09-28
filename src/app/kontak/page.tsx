"use client";

import React, { useState } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHero from "@/components/public/PageHero";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { initialSiteSettings } from "@/data/mock-site";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        subject: "",
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={initialSiteSettings} />
      <main className="flex-1">
        <PageHero
          badge="Hubungi Kami"
          title="Kontak & Lokasi Sekolah"
          description="Punya pertanyaan mengenai program sekolah, PPDB, atau kerjasama? Silakan hubungi kami atau kunjungi kampus SMA Al Falah Banjaran."
          breadcrumb="Kontak"
        />

        <section className="py-14 bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Form Kirim Pesan */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2238] mb-2">
                  Kirim Pesan atau Pertanyaan
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Isi formulir di bawah ini, tim staf kami akan segera merespons Anda.
                </p>

                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="font-bold text-sm text-[#0D4A38]">
                      Pesan Anda Berhasil Terkirim!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Terima kasih telah menghubungi SMA Al Falah Banjaran. Tim kami akan segera menghubungi Anda.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Masukkan nama Anda"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0D4A38] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          No. WhatsApp / HP *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.whatsapp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              whatsapp: e.target.value,
                            })
                          }
                          placeholder="Contoh: 081234567890"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0D4A38] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Alamat Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="nama@email.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0D4A38] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Perihal *
                        </label>
                        <select
                          required
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0D4A38] outline-none bg-white"
                        >
                          <option value="">Pilih Perihal</option>
                          <option value="Informasi PPDB">Informasi PPDB</option>
                          <option value="Program Kurikulum & Tahfidz">
                            Program Kurikulum & Tahfidz
                          </option>
                          <option value="Biaya Pendidikan">Biaya Pendidikan</option>
                          <option value="Kerjasama / Kunjungan">
                            Kerjasama / Kunjungan
                          </option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pesan Anda *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Tuliskan pertanyaan atau pesan Anda secara lengkap di sini..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0D4A38] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] active:scale-98 transition-all shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pesan Sekarang</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Info Kontak & Jam Kerja */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/90 space-y-4">
                  <h3 className="font-bold text-base text-[#0B2238] border-b border-slate-200 pb-3">
                    Informasi Kontak
                  </h3>

                  <div className="space-y-3.5 text-xs text-slate-700">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0D4A38] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          Alamat Kampus:
                        </span>
                        <span>{initialSiteSettings.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0D4A38] flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          Telepon Kantor:
                        </span>
                        <span>{initialSiteSettings.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0D4A38] flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          WhatsApp Resmi:
                        </span>
                        <span>+{initialSiteSettings.whatsapp}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0D4A38] flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          Email Resmi:
                        </span>
                        <span>{initialSiteSettings.email}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0D4A38] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          Jam Layanan:
                        </span>
                        <span>Senin - Sabtu: 07.30 - 15.00 WIB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps Card */}
                <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-white">
                  <div className="relative aspect-[16/10] w-full">
                    <iframe
                      title="Lokasi Kampus SMA Al Falah Banjaran"
                      src={initialSiteSettings.mapsEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 bg-white flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      Yayasan Al Falah Banjaran
                    </span>
                    <a
                      href={initialSiteSettings.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0D4A38] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Buka di Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={initialSiteSettings} />
    </div>
  );
}
