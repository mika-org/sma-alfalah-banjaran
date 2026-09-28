import Image from "next/image";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHero from "@/components/public/PageHero";
import { CheckCircle2, Target, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { initialSiteSettings } from "@/data/mock-site";

export const metadata = {
  title: "Profil Sekolah | SMA Al Falah Banjaran",
  description:
    "Profil, Visi, Misi, Sejarah, dan Nilai-nilai Keunggulan SMA Al Falah Banjaran, Kabupaten Bandung.",
};

export const revalidate = 0;

export default async function ProfilPage() {
  let settings = initialSiteSettings;
  const profileData = {
    visi: "Terwujudnya Peserta Didik yang Beriman dan Bertaqwa, Berakhlak Mulia, Unggul dalam Prestasi Akademik dan Non-Akademik, serta Berwawasan Lingkungan dan Global.",
    misi: [
      "Menyelenggarakan pembelajaran kurikulum nasional yang diperkaya nilai kepesantrenan dan pembiasaan ibadah.",
      "Membina hafalan dan pemahaman Al-Qur'an melalui program Tahfidz reguler dan intensif.",
      "Mengembangkan potensi minat, bakat, kepemimpinan, dan kewirausahaan siswa melalui ekstrakurikuler aktif.",
      "Menciptakan lingkungan sekolah yang hijau, bersih, religius, aman, dan berdaya saing.",
    ],
    principalName: "Drs. H. Mulyana, M.M.Pd",
    principalRole: "Kepala Sekolah SMA Al Falah Banjaran",
    greeting:
      "Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSegala puji bagi Allah SWT yang senantiasa melimpahkan taufiq dan hidayah-Nya. SMA Al Falah Banjaran hadir di tengah masyarakat sebagai wadah pendidikan menengah atas yang berikhtiar memadukan kecerdasan intelektual, kematangan emosional, dan keluhuran spiritual.\n\nDi era disrupsi informasi dan transformasi digital, tantangan generasi muda semakin dinamis. Oleh karenanya, kami tidak hanya fokus membekali siswa dengan capaian akademik semata, melainkan juga menanamkan adab islam, kecintaan pada Al-Qur'an, kedisiplinan, serta keterampilan praktis yang aplikatif.\n\nKami mengundang para orang tua dan calon santri untuk bergabung bersama keluarga besar SMA Al Falah Banjaran, bersama-sama mewujudkan generasi yang gemilang di dunia dan mulia di akhirat.",
  };

  try {
    const [dbPage, dbSettings] = await Promise.all([
      prisma.halaman.findUnique({
        where: { slug: "profil" },
      }),
      prisma.pengaturanSitus.findFirst(),
    ]);

    if (dbPage && dbPage.konten) {
      try {
        const parsed = JSON.parse(dbPage.konten);
        if (parsed.visi) profileData.visi = parsed.visi;
        if (parsed.misi) profileData.misi = parsed.misi;
        if (parsed.principalName) profileData.principalName = parsed.principalName;
        if (parsed.principalRole) profileData.principalRole = parsed.principalRole;
        if (parsed.greeting) profileData.greeting = parsed.greeting;
      } catch (_e) {
        // Fallback to default profil content
      }
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
    console.warn("Using fallback profile data", e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">
        <PageHero
          badge="Tentang Kami"
          title="Profil SMA Al Falah Banjaran"
          description="Mengenal lebih dekat sejarah, visi, misi, dan komitmen kami dalam mendidik generasi muda yang berakhlakul karimah dan berwawasan masa depan."
          breadcrumb="Profil Sekolah"
        />

        {/* Sambutan Kepala Sekolah */}
        <section className="py-14 bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/about-school.jpg"
                    alt="Kepala Sekolah dan Pembina SMA Al Falah Banjaran"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="font-bold text-lg">
                      {profileData.principalName}
                    </span>
                    <span className="text-xs text-emerald-300">
                      {profileData.principalRole}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-[#0D4A38] uppercase tracking-wider">
                  Sambutan Kepala Sekolah
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2238] tracking-tight">
                  Mendidik Hati, Menempa Akal, Menyiapkan Masa Depan
                </h2>
                <div className="space-y-3 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {profileData.greeting}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="py-14 bg-slate-50/70 border-y border-slate-100">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Visi */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover-lift transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0D4A38] flex items-center justify-center mb-5 border border-emerald-100">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B2238] mb-3">Visi Sekolah</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  "{profileData.visi}"
                </p>
              </div>

              {/* Misi */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover-lift transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2238] flex items-center justify-center mb-5 border border-blue-100">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B2238] mb-3">Misi Sekolah</h3>
                <ul className="space-y-2.5 text-slate-600 text-xs sm:text-sm">
                  {profileData.misi.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
