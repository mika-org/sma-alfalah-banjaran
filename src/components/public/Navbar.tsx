"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { SiteSettings } from "@/data/mock-site";

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profil" },
    { label: "Program", href: "/program" },
    { label: "Kegiatan", href: "/kegiatan" },
    { label: "PPDB", href: "/ppdb" },
    { label: "Kontak", href: "/kontak" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-xs">
      <div className="section-container flex items-center justify-between h-20">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-emerald-600/20 shadow-xs flex-shrink-0 bg-emerald-50">
            <Image
              src={settings.logo || "/images/logo.png"}
              alt={settings.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="40px"
              priority
            />
          </div>
          <span className="font-bold text-base md:text-lg tracking-tight text-[#0B2238] group-hover:text-[#0D4A38] transition-colors">
            {settings.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#0D4A38] relative py-1 ${
                  isActive ? "text-[#0D4A38] font-semibold" : "text-slate-700"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D4A38] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/ortu/login"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
          >
            Portal Ortu
          </Link>
          <Link
            href="/ppdb"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] active:scale-98 transition-all shadow-sm"
          >
            PPDB Online
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:text-[#0B2238] hover:bg-slate-100 focus:outline-none"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-[#0D4A38] font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/ortu/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-lg border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Masuk Portal Orang Tua
            </Link>
            <Link
              href="/ppdb"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0B2238] text-white font-medium text-center hover:bg-[#123758] transition-colors shadow-sm"
            >
              <span>Daftar PPDB Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
