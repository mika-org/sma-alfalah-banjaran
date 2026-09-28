import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { SiteSettings } from "@/data/mock-site";

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071727] text-slate-300 border-t border-slate-800">
      {/* Main Footer Container */}
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Identity & Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-emerald-500/30 bg-emerald-950 flex-shrink-0">
                <Image
                  src={settings.logo || "/images/logo.png"}
                  alt={settings.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight block">
                  {settings.name}
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Membina Generasi Unggul Berakhlak
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              {settings.description ||
                "Lembaga pendidikan menengah atas berbasis islami di Banjaran, mencetak santri dan siswa berilmu tinggi, berakhlak mulia, dan siap berkontribusi bagi umat dan bangsa."}
            </p>

            <div className="pt-1">
              <Link
                href="/admin/login"
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Portal Staf / Admin CMS</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/profil"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Profil & Visi Misi
                </Link>
              </li>
              <li>
                <Link
                  href="/program"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Program Unggulan
                </Link>
              </li>
              <li>
                <Link
                  href="/kegiatan"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Kegiatan & Berita
                </Link>
              </li>
              <li>
                <Link
                  href="/ppdb"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Informasi PPDB
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Kontak & Lokasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kontak & Alamat */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Kontak Kami
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WA: +{settings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} {settings.name}. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1 text-[11px] text-slate-500">
            Terakreditasi B oleh BAN-S/M
          </p>
        </div>
      </div>
    </footer>
  );
}
