"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, LogIn, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function OrtuLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/ortu/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal masuk ke Portal Orang Tua");

      router.push("/ortu");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B2238] to-[#0D4A38] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Sekolah</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 mx-auto bg-white p-1 shadow-md">
              <Image
                src="/images/logo.png"
                alt="Logo SMA Al Falah"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-xl font-extrabold text-[#0B2238] tracking-tight">
              Portal Orang Tua / Wali
            </h1>
            <p className="text-xs text-slate-500">
              SMA Al Falah Banjaran • Kab. Bandung
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username Akun Orang Tua
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: ortu_1234567890"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Username diberikan oleh panitia PPDB setelah calon siswa diterima.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0D4A38] hover:bg-[#12634B] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Memverifikasi..." : "Masuk ke Portal Orang Tua"}</span>
            </button>
          </form>

          {/* Help Footer */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              Belum memiliki akun atau lupa password?
            </p>
            <div className="flex justify-center gap-4 text-xs font-bold text-[#0D4A38]">
              <Link href="/ppdb" className="hover:underline">
                Cek Status PPDB
              </Link>
              <span>•</span>
              <Link href="/kontak" className="hover:underline">
                Hubungi Tata Usaha
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
