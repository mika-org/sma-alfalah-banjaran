"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  GraduationCap,
  Calendar,
  School,
  CheckCircle2,
  Printer,
  KeyRound,
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function OrtuDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Change Password Modal
  const [changePwModal, setChangePwModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  // Official Letter Modal
  const [showLetterModal, setShowLetterModal] = useState(false);

  useEffect(() => {
    fetch("/api/auth/ortu/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/ortu/login");
          return null;
        }
        return res.json();
      })
      .then((res) => {
        if (res) setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        router.push("/ortu/login");
      });
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/ortu/logout", { method: "POST" });
      router.push("/ortu/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPw(true);
    setPwMessage(null);
    setPwError(null);

    try {
      const res = await fetch("/api/ortu/ganti-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passwordLama: oldPassword,
          passwordBaru: newPassword,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Gagal mengubah password");

      setPwMessage("Password berhasil diperbarui!");
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        setChangePwModal(false);
        setPwMessage(null);
      }, 2000);
    } catch (err: any) {
      setPwError(err.message || "Terjadi kesalahan");
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-xs text-slate-500 font-semibold">
        Memuat data Portal Orang Tua...
      </div>
    );
  }

  const { akun, siswa } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-500 bg-emerald-50">
              <Image
                src="/images/logo.png"
                alt="Logo SMA Al Falah"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#0B2238] block leading-tight">
                Portal Orang Tua
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                SMA Al Falah Banjaran
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setChangePwModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ganti Password</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{loggingOut ? "Keluar..." : "Keluar"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-[#0B2238] to-[#0D4A38] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 inline-block mb-1">
              Akun Resmi Orang Tua / Wali
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Selamat Datang, Bapak/Ibu {akun?.namaLengkap}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Anda terhubung dengan ananda <b>{siswa?.namaLengkap}</b>. Pantau status akademik, administrasi PPDB, dan berkas surat penerimaan resmi di sini.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={() => setShowLetterModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0B2238] text-xs font-bold hover:bg-emerald-50 transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-[#0D4A38]" />
              <span>Cetak Surat Keterangan Diterima</span>
            </button>

            <span className="text-xs text-emerald-200 font-mono bg-white/10 px-3 py-1.5 rounded-lg">
              Username: {akun?.username}
            </span>
          </div>
        </div>

        {/* Student Identity Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0D4A38] border border-emerald-100 flex items-center justify-center font-bold text-lg">
                  {siswa?.namaLengkap?.charAt(0) || "S"}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#0B2238]">
                    {siswa?.namaLengkap}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    {siswa?.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"} • Asal: {siswa?.asalSekolah || "SMP"}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{siswa?.status || "AKTIF"}</span>
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Nomor Induk Siswa (NIS)</span>
                <span className="text-base font-black text-[#0D4A38] font-mono mt-0.5 block">
                  {siswa?.nis}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">NISN</span>
                <span className="text-base font-bold text-slate-800 font-mono mt-0.5 block">
                  {siswa?.nisn}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Kelas Siswa</span>
                <span className="text-base font-bold text-slate-800 mt-0.5 block">
                  {siswa?.kelas}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Tahun Ajaran</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {siswa?.tahunAjaran}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 block font-medium">Tempat, Tanggal Lahir</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {siswa?.tempatLahir},{" "}
                  {new Date(siswa?.tanggalLahir).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-400 block">Alamat Tinggal:</span>
                <span className="font-medium text-slate-700 leading-relaxed">
                  {siswa?.alamat}
                </span>
              </div>
            </div>
          </div>

          {/* PPDB & Administrasi Status */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Status Administrasi PPDB</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Registrasi:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {siswa?.calonSiswa?.nomorPendaftaran || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Jalur Penerimaan:</span>
                  <span className="font-bold text-slate-800">
                    {siswa?.calonSiswa?.jalurPendaftaran || "Reguler"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Pendaftaran:</span>
                  <span className="font-bold text-emerald-700">
                    Lunas & Terverifikasi
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Diterima:</span>
                  <span className="font-semibold text-slate-700">
                    {siswa?.calonSiswa?.diverifikasiPada
                      ? new Date(siswa.calonSiswa.diverifikasiPada).toLocaleDateString("id-ID")
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLetterModal(true)}
                  className="w-full py-2.5 rounded-xl bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Unduh Surat Keterangan</span>
                </button>
              </div>
            </div>

            {/* Sekretariat Sekolah Box */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 space-y-2 text-xs">
              <span className="font-bold text-[#0D4A38] block">
                Bantuan & Informasi Siswa
              </span>
              <p className="text-slate-600 leading-relaxed">
                Apabila ada perubahan nomor kontak atau kendala administrasi, silakan menghubungi Tata Usaha SMA Al Falah Banjaran.
              </p>
              <Link
                href="/kontak"
                className="text-[#0D4A38] font-bold inline-flex items-center gap-1 hover:underline pt-1"
              >
                <span>Halaman Kontak Sekolah</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL GANTI PASSWORD */}
      {changePwModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0D4A38]" />
                <span>Ganti Password Akun</span>
              </h3>
              <button
                type="button"
                onClick={() => setChangePwModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Batal
              </button>
            </div>

            {pwMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pwMessage}</span>
              </div>
            )}

            {pwError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{pwError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Lama *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password saat ini"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setChangePwModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingPw}
                  className="px-5 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] disabled:opacity-50"
                >
                  {savingPw ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SURAT KETERANGAN PENERIMAAN (KOP SURAT RESMI) */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl my-8 space-y-6 animate-in zoom-in-95 duration-150 print:p-0 print:shadow-none">
            {/* Action Bar (hidden in print) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <span className="text-xs font-bold text-slate-500">
                Dokumen Resmi Penerimaan Siswa Baru
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Official Letter Paper Layout */}
            <div className="border border-slate-300 p-8 rounded-xl bg-white shadow-xs font-serif text-slate-900 space-y-6">
              {/* Kop Surat */}
              <div className="flex items-center justify-between border-b-2 border-black pb-4 gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="Logo Yayasan Al Falah"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center flex-1">
                  <h3 className="text-xs font-bold tracking-widest uppercase">
                    YAYASAN PENDIDIKAN ISLAM AL FALAH
                  </h3>
                  <h2 className="text-lg font-black tracking-wide uppercase text-slate-900 font-sans">
                    SMA AL FALAH BANJARAN
                  </h2>
                  <p className="text-[11px] font-sans text-slate-600 mt-0.5">
                    Jl. Raya Banjaran No. 182, Sindangpanon, Kec. Banjaran, Kab. Bandung, Jawa Barat 40377
                  </p>
                  <p className="text-[10px] font-sans text-slate-500">
                    Telp: (022) 5940123 • Email: info@smaalfalahbanjaran.sch.id • NPSN Terakreditasi B
                  </p>
                </div>
              </div>

              {/* Letter Title */}
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold underline uppercase tracking-wider">
                  SURAT KETERANGAN DITERIMA
                </h4>
                <p className="text-xs font-sans text-slate-500 font-mono">
                  Nomor: {siswa?.calonSiswa?.nomorPendaftaran || "PPDB/2026/001"}/SMA-AF/PPDB/{new Date().getFullYear()}
                </p>
              </div>

              {/* Statement */}
              <div className="text-xs font-sans space-y-3 leading-relaxed">
                <p>
                  Berdasarkan hasil verifikasi berkas administrasi dan bukti pembayaran formulir Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran <b>{siswa?.tahunAjaran}</b>, Panitia PPDB SMA Al Falah Banjaran menerangkan bahwa:
                </p>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-600">Nama Lengkap</span>
                    <span className="col-span-2 font-bold">: {siswa?.namaLengkap}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-600">Nomor Induk Siswa (NIS)</span>
                    <span className="col-span-2 font-bold font-mono text-[#0D4A38]">: {siswa?.nis}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-600">NISN</span>
                    <span className="col-span-2 font-bold font-mono">: {siswa?.nisn}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-600">Asal Sekolah</span>
                    <span className="col-span-2 font-medium">: {siswa?.asalSekolah}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-600">Kelas Penempatan</span>
                    <span className="col-span-2 font-bold">: {siswa?.kelas}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-600">Jalur Penerimaan</span>
                    <span className="col-span-2 font-medium">: {siswa?.calonSiswa?.jalurPendaftaran || "Reguler"}</span>
                  </div>
                </div>

                <p className="text-justify">
                  Dinyatakan <b>RESMI DITERIMA</b> sebagai Peserta Didik Baru pada SMA Al Falah Banjaran Tahun Ajaran {siswa?.tahunAjaran}. Surat keterangan ini diterbitkan sebagai bukti sah penerimaan dan dapat dipergunakan untuk keperluan administrasi sekolah.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-6 flex justify-between items-end text-xs font-sans">
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    ID Verifikasi E-Doc:
                  </span>
                  <div className="w-20 h-20 border border-slate-200 rounded p-1 mx-auto flex items-center justify-center bg-slate-50 text-[9px] text-slate-500 font-mono">
                    [QR VALIDASI]
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-slate-600">
                    Banjaran, {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-bold text-slate-800">
                    Panitia PPDB SMA Al Falah Banjaran
                  </p>
                  <div className="h-14"></div>
                  <p className="font-bold underline text-slate-900">
                    Drs. H. Mulyana, M.M.Pd
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kepala Sekolah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
