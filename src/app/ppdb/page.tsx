import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHero from "@/components/public/PageHero";
import {
  Clock,
  FileText,
  MessageCircle,
  Phone,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { initialSiteSettings, initialPpdb, PpdbData } from "@/data/mock-site";

export const revalidate = 0;

export default async function PpdbPage() {
  let ppdb: PpdbData = initialPpdb;
  let settings = initialSiteSettings;

  try {
    // Ambil data pengaturan PPDB dan informasi situs dari database
    const [dbPpdb, dbSettings] = await Promise.all([
      prisma.pengaturanPpdb.findFirst(),
      prisma.pengaturanSitus.findFirst(),
    ]);

    if (dbPpdb) {
      let schedule = ppdb.schedule;
      let requirements = ppdb.requirements;
      let contacts = ppdb.contacts;

      try {
        if (dbPpdb.jadwal) schedule = JSON.parse(dbPpdb.jadwal);
      } catch (_e) {
        // Fallback to initial schedule if parsing fails
      }

      try {
        if (dbPpdb.persyaratan) requirements = JSON.parse(dbPpdb.persyaratan);
      } catch (_e) {
        // Fallback to initial requirements if parsing fails
      }

      try {
        if (dbPpdb.kontak) contacts = JSON.parse(dbPpdb.kontak);
      } catch (_e) {
        // Fallback to initial contacts if parsing fails
      }

      ppdb = {
        academicYear: dbPpdb.tahun_ajaran,
        isOpen: dbPpdb.status_buka,
        tagline: dbPpdb.tagline,
        description: dbPpdb.deskripsi,
        registrationUrl: dbPpdb.url_pendaftaran,
        schedule,
        requirements,
        contacts,
      };
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
    console.warn("Using fallback PPDB settings", e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">
        <PageHero
          badge={`PPDB ${ppdb.academicYear}`}
          title="Penerimaan Peserta Didik Baru"
          description="Mari bergabung bersama SMA Al Falah Banjaran. Tempat bertumbuhnya generasi berilmu, berkarakter mulia, dan siap memimpin masa depan."
          breadcrumb="PPDB"
        />

        {/* Status Banner */}
        <section className={`border-b py-6 ${ppdb.isOpen ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
          <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3.5 w-3.5 relative">
                {ppdb.isOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-600"></span>
                )}
              </span>
              <div>
                <p className="text-sm font-bold text-[#0D4A38]">
                  Pendaftaran Tahun Ajaran {ppdb.academicYear} {ppdb.isOpen ? "Sedang Dibuka" : "Telah Ditutup"}
                </p>
                <p className="text-xs text-slate-500">
                  {ppdb.description || "Dapatkan informasi pendaftaran resmi dan kemudahan proses administrasi."}
                </p>
              </div>
            </div>

            {ppdb.isOpen && (
              <a
                href={ppdb.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Daftar Sekarang via WhatsApp</span>
              </a>
            )}
          </div>
        </section>

        {/* Alur & Jadwal */}
        <section className="py-14 bg-white">
          <div className="section-container">
            {/* Jadwal Gelombang */}
            <div className="mb-14">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase text-[#0D4A38] tracking-wider block mb-1">
                  Jadwal Seleksi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2238]">
                  Gelombang Pendaftaran
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ppdb.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover-lift transition-all relative overflow-hidden"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0D4A38] font-bold text-xs flex items-center justify-center mb-4 border border-emerald-100">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-base text-[#0B2238] mb-1">
                      {item.phase}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.dates}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Persyaratan & Beasiswa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Syarat Berkas */}
              <div className="lg:col-span-7 bg-slate-50/60 rounded-2xl p-7 border border-slate-200/80">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B2238]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#0B2238]">
                      Persyaratan Berkas Pendaftaran
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dokumen yang perlu disiapkan oleh calon peserta didik
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {ppdb.requirements.map((req, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beasiswa & Kontak Panitia */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#0B2238] text-white rounded-2xl p-7 shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4 border border-emerald-400/30">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base mb-2">
                    Program Beasiswa Tahfidz & Prestasi
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    SMA Al Falah Banjaran memberikan beasiswa pembebasan biaya hingga 100% bagi siswa yang hafal Al-Qur'an minimal 3 Juz atau peraih juara olimpiade sains/olahraga tingkat kabupaten/provinsi.
                  </p>
                  <a
                    href={ppdb.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Konsultasikan jalur beasiswa</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                  <h4 className="font-bold text-sm text-[#0B2238] mb-3">
                    Sekretariat PPDB
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-600">
                    {ppdb.contacts.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <span className="font-medium text-slate-800">{c.name}</span>
                        <a
                          href={`https://wa.me/${c.wa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0D4A38] font-bold hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Hubungi</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
