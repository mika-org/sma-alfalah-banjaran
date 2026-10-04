"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  School,
  Home,
  FileText,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  UserCheck,
  Users,
  CreditCard,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If login page, render children directly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pendaftar PPDB", href: "/admin/ppdb/pendaftar", icon: GraduationCap },
    { label: "Data Siswa & Ortu", href: "/admin/siswa", icon: Users },
    { label: "Pengaturan & Rekening PPDB", href: "/admin/ppdb", icon: CreditCard },
    { label: "Identitas Sekolah", href: "/admin/identitas", icon: School },
    { label: "Beranda & Hero", href: "/admin/beranda", icon: Home },
    { label: "Profil Sekolah", href: "/admin/profil", icon: FileText },
    { label: "Program Unggulan", href: "/admin/program", icon: BookOpen },
    { label: "Kegiatan & Berita", href: "/admin/kegiatan", icon: Calendar },
    { label: "Galeri Foto", href: "/admin/galeri", icon: ImageIcon },
    { label: "Testimoni", href: "/admin/testimoni", icon: MessageSquare },
    { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { label: "Akun Admin", href: "/admin/akun", icon: UserCheck },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#0B2238] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-emerald-400">
            <Image
              src="/images/logo.png"
              alt="Logo SMA Al Falah"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-sm tracking-tight">CMS Al Falah</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200"
          aria-label="Toggle Sidebar"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B2238] text-slate-300 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-emerald-400 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Logo SMA Al Falah Banjaran"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-tight leading-tight">
                SMA Al Falah
              </h1>
              <span className="text-[11px] text-emerald-400 font-medium">
                Panel CMS Sekolah
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : item.href === "/admin/ppdb"
                  ? pathname === "/admin/ppdb"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#0D4A38] text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? "text-emerald-300" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs transition-colors"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? "Keluar..." : "Keluar (Logout)"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Portal Staf Administrasi
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
            >
              <span>Kunjungi Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0D4A38] font-bold text-xs flex items-center justify-center">
                A
              </div>
              <span className="text-xs font-semibold text-slate-800">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
