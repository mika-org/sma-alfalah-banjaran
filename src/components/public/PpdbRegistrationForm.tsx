"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Phone,
  FileCheck,
  CreditCard,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  Search,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  School,
  QrCode,
  ShieldCheck,
  Printer,
  ExternalLink,
} from "lucide-react";

interface Rekening {
  id: string;
  namaBank: string;
  nomorRekening: string;
  atasNama: string;
  catatan?: string | null;
}

interface PpdbInfo {
  academicYear: string;
  isOpen: boolean;
  biayaPendaftaran: number;
  instruksiPembayaran: string;
  qrisImage: string;
  rekeningList: Rekening[];
}

export default function PpdbRegistrationForm() {
  const [activeTab, setActiveTab] = useState<"daftar" | "cek">("daftar");
  const [info, setInfo] = useState<PpdbInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jalurPendaftaran: "Reguler",
    namaLengkap: "",
    nisn: "",
    nik: "",
    jenisKelamin: "L",
    tempatLahir: "",
    tanggalLahir: "",
    agama: "Islam",
    alamat: "",
    asalSekolah: "",
    noHpSiswa: "",
    namaAyah: "",
    namaIbu: "",
    pekerjaanOrtu: "",
    noWhatsappOrtu: "",
    emailOrtu: "",
    buktiPembayaran: "",
    namaPengirim: "",
    nominalTransfer: "150000",
    bankTujuan: "",
    catatan: "",
  });

  const [uploadingBukti, setUploadingBukti] = useState(false);
  const [uploadBuktiError, setUploadBuktiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredData, setRegisteredData] = useState<any>(null);

  // Copy rekening feedback
  const [copiedRekening, setCopiedRekening] = useState<string | null>(null);

  // QRIS modal
  const [showQrisModal, setShowQrisModal] = useState(false);

  // Cek Status State
  const [searchQuery, setSearchQuery] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ppdb/info")
      .then((res) => res.json())
      .then((data) => {
        setInfo(data);
        if (data.biayaPendaftaran) {
          setFormData((prev) => ({
            ...prev,
            nominalTransfer: String(data.biayaPendaftaran),
            bankTujuan: data.rekeningList?.[0]?.namaBank || "",
          }));
        }
        setLoadingInfo(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingInfo(false);
      });
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRekening(id);
    setTimeout(() => setCopiedRekening(null), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBukti(true);
    setUploadBuktiError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/ppdb/upload-bukti", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah gambar");

      setFormData((prev) => ({ ...prev, buktiPembayaran: data.url }));
    } catch (err: any) {
      setUploadBuktiError(err.message || "Gagal upload file");
    } finally {
      setUploadingBukti(false);
    }
  };

  const validateStep1 = () => {
    if (
      !formData.namaLengkap.trim() ||
      !formData.nisn.trim() ||
      !formData.tempatLahir.trim() ||
      !formData.tanggalLahir ||
      !formData.asalSekolah.trim() ||
      !formData.alamat.trim()
    ) {
      setSubmitError("Mohon lengkapi semua data calon siswa yang bertanda bintang (*).");
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const validateStep2 = () => {
    if (
      !formData.namaAyah.trim() ||
      !formData.namaIbu.trim() ||
      !formData.noWhatsappOrtu.trim()
    ) {
      setSubmitError("Mohon lengkapi data orang tua dan No. WhatsApp aktif.");
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!formData.buktiPembayaran) {
      setSubmitError("Bukti transfer pembayaran pendaftaran wajib diunggah.");
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/ppdb/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pendaftaran gagal");

      setRegisteredData({
        ...data.data,
        ...formData,
      });
      setStep(5); // Success step
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan saat mengirim pendaftaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setCheckingStatus(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const res = await fetch(
        `/api/ppdb/cek-status?q=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Data pendaftaran tidak ditemukan");

      setStatusResult(data.data);
    } catch (err: any) {
      setStatusError(err.message || "Gagal memeriksa status.");
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="w-full">
      {/* Top Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => setActiveTab("daftar")}
          className={`flex-1 py-4 px-4 text-center font-bold text-xs sm:text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "daftar"
              ? "border-[#0D4A38] text-[#0D4A38] bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Formulir Pendaftaran Online</span>
        </button>

        <button
          onClick={() => setActiveTab("cek")}
          className={`flex-1 py-4 px-4 text-center font-bold text-xs sm:text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "cek"
              ? "border-[#0D4A38] text-[#0D4A38] bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Cek Status Pendaftaran</span>
        </button>
      </div>

      <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200/80 p-5 sm:p-8 shadow-sm">
        {/* ================= TAB 1: FORM PENDAFTARAN ================= */}
        {activeTab === "daftar" && (
          <div>
            {info && !info.isOpen ? (
              <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200">
                <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-amber-900 mb-1">
                  Pendaftaran PPDB Sedang Ditutup
                </h3>
                <p className="text-xs text-amber-700 max-w-md mx-auto">
                  Pendaftaran penerimaan peserta didik baru tahun ajaran {info.academicYear} saat ini belum dibuka atau telah berakhir. Silakan hubungi sekretariat PPDB kami untuk informasi gelombang berikutnya.
                </p>
              </div>
            ) : step === 5 && registeredData ? (
              /* Success Confirmation Card */
              <div className="max-w-2xl mx-auto py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0D4A38] flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-block mb-2">
                    Pendaftaran Berhasil Dikirim
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0B2238]">
                    Alhamdulillah, Formulir Telah Diterima!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Simpan Nomor Pendaftaran ini untuk memantau status verifikasi berkas dan penerimaan ananda.
                  </p>
                </div>

                {/* Registration Slip */}
                <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-300 text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Nomor Pendaftaran Resmi
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-[#0D4A38] font-mono">
                        {registeredData.nomorPendaftaran}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                      Menunggu Verifikasi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Nama Lengkap:</span>
                      <span className="font-bold text-slate-800">
                        {registeredData.namaLengkap}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">NISN Siswa:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {registeredData.nisn}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Asal Sekolah:</span>
                      <span className="font-bold text-slate-800">
                        {registeredData.asalSekolah}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">WhatsApp Orang Tua:</span>
                      <span className="font-bold text-slate-800">
                        {registeredData.noWhatsappOrtu}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Proses Selanjutnya:
                    </p>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      Panitia PPDB SMA Al Falah Banjaran akan memeriksa berkas dan bukti pembayaran dalam 1x24 jam. Setelah diverifikasi, Anda akan mendapatkan notifikasi WhatsApp beserta rincian <b>Akun Portal Orang Tua</b> unik untuk ananda.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Bukti Pendaftaran</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("cek");
                      setSearchQuery(registeredData.nomorPendaftaran);
                      setStep(1);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all"
                  >
                    <Search className="w-4 h-4" />
                    <span>Pantau Status Pendaftaran</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Steps Registration Form */
              <div>
                {/* Step Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between max-w-xl mx-auto">
                    {[
                      { num: 1, label: "Calon Siswa" },
                      { num: 2, label: "Orang Tua / Wali" },
                      { num: 3, label: "Pembayaran & Bukti" },
                      { num: 4, label: "Konfirmasi" },
                    ].map((s) => (
                      <div key={s.num} className="flex flex-col items-center relative flex-1">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                            step === s.num
                              ? "bg-[#0D4A38] text-white ring-4 ring-emerald-100"
                              : step > s.num
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                        </div>
                        <span
                          className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                            step === s.num ? "text-[#0D4A38]" : "text-slate-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {submitError && (
                  <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* STEP 1: DATA CALON SISWA */}
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-base text-[#0B2238]">
                            Data Diri Calon Siswa
                          </h3>
                          <p className="text-xs text-slate-500">
                            Masukkan data calon siswa sesuai dengan Ijazah / Rapor SMP
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#0D4A38] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          Langkah 1 dari 4
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Lengkap Siswa *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Muhammad Fadhil Ramadhan"
                            value={formData.namaLengkap}
                            onChange={(e) =>
                              setFormData({ ...formData, namaLengkap: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>


                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            NISN (Nomor Induk Siswa Nasional) *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="10 digit NISN"
                            value={formData.nisn}
                            onChange={(e) =>
                              setFormData({ ...formData, nisn: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            NIK Siswa (Sesuai Kartu Keluarga)
                          </label>
                          <input
                            type="text"
                            maxLength={16}
                            placeholder="16 digit NIK (opsional)"
                            value={formData.nik}
                            onChange={(e) =>
                              setFormData({ ...formData, nik: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Jenis Kelamin *
                          </label>
                          <div className="flex gap-4 pt-1">
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                name="jenisKelamin"
                                value="L"
                                checked={formData.jenisKelamin === "L"}
                                onChange={() =>
                                  setFormData({ ...formData, jenisKelamin: "L" })
                                }
                                className="text-[#0D4A38] focus:ring-[#0D4A38]"
                              />
                              <span>Laki-laki</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                name="jenisKelamin"
                                value="P"
                                checked={formData.jenisKelamin === "P"}
                                onChange={() =>
                                  setFormData({ ...formData, jenisKelamin: "P" })
                                }
                                className="text-[#0D4A38] focus:ring-[#0D4A38]"
                              />
                              <span>Perempuan</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Asal Sekolah (SMP / MTs) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: SMP Negeri 1 Banjaran"
                            value={formData.asalSekolah}
                            onChange={(e) =>
                              setFormData({ ...formData, asalSekolah: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tempat Lahir *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Bandung"
                            value={formData.tempatLahir}
                            onChange={(e) =>
                              setFormData({ ...formData, tempatLahir: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tanggal Lahir *
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.tanggalLahir}
                            onChange={(e) =>
                              setFormData({ ...formData, tanggalLahir: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alamat Lengkap Tempat Tinggal *
                          </label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Jl. / Kampung, RT/RW, Desa/Kelurahan, Kecamatan, Kab/Kota"
                            value={formData.alamat}
                            onChange={(e) =>
                              setFormData({ ...formData, alamat: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            No. WhatsApp / HP Siswa (Opsional)
                          </label>
                          <input
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            value={formData.noHpSiswa}
                            onChange={(e) =>
                              setFormData({ ...formData, noHpSiswa: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all"
                        >
                          <span>Lanjut ke Data Orang Tua</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DATA ORANG TUA / WALI */}
                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-base text-[#0B2238]">
                            Data Orang Tua / Wali Siswa
                          </h3>
                          <p className="text-xs text-slate-500">
                            Kontak ini akan digunakan untuk pembuatan Akun Portal Orang Tua
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#0D4A38] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          Langkah 2 dari 4
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Ayah Kandung *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap Ayah"
                            value={formData.namaAyah}
                            onChange={(e) =>
                              setFormData({ ...formData, namaAyah: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Ibu Kandung *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap Ibu"
                            value={formData.namaIbu}
                            onChange={(e) =>
                              setFormData({ ...formData, namaIbu: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nomor WhatsApp Orang Tua *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="Contoh: 081234567890"
                            value={formData.noWhatsappOrtu}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                noWhatsappOrtu: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Akun Orang Tua & informasi hasil seleksi akan dikirimkan ke nomor ini.
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email Orang Tua (Opsional)
                          </label>
                          <input
                            type="email"
                            placeholder="orangtua@email.com"
                            value={formData.emailOrtu}
                            onChange={(e) =>
                              setFormData({ ...formData, emailOrtu: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Pekerjaan Orang Tua / Wali
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Wiraswasta / PNS / Karyawan Swasta"
                            value={formData.pekerjaanOrtu}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pekerjaanOrtu: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Kembali</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all"
                        >
                          <span>Lanjut ke Pembayaran</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: INFORMASI REKENING, QRIS & UPLOAD BUKTI */}
                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-base text-[#0B2238]">
                            Pembayaran & Bukti Transfer PPDB
                          </h3>
                          <p className="text-xs text-slate-500">
                            Lakukan transfer biaya formulir ke rekening resmi sekolah atau scan QRIS
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#0D4A38] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          Langkah 3 dari 4
                        </span>
                      </div>

                      {/* Payment Notice Banner */}
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-emerald-900 block">
                            Biaya Pendaftaran PPDB:
                          </span>
                          <span className="text-xl font-extrabold text-[#0D4A38]">
                            Rp {(info?.biayaPendaftaran || 150000).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 sm:text-right max-w-xs">
                          {info?.instruksiPembayaran ||
                            "Transfer sesuai nominal dan simpan bukti transfer untuk diunggah di bawah ini."}
                        </p>
                      </div>

                      {/* Bank Accounts & QRIS Cards */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Rekening Bank List */}
                        <div className="lg:col-span-8 space-y-3">
                          <label className="block text-xs font-bold text-slate-700">
                            Pilihan Rekening Resmi Sekolah:
                          </label>

                          <div className="space-y-2.5">
                            {info?.rekeningList && info.rekeningList.length > 0 ? (
                              info.rekeningList.map((rek) => (
                                <div
                                  key={rek.id}
                                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="w-4 h-4 text-[#0D4A38]" />
                                      <span className="font-bold text-xs text-slate-800">
                                        {rek.namaBank}
                                      </span>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 font-mono tracking-wider mt-0.5">
                                      {rek.nomorRekening}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      a.n. <span className="font-semibold text-slate-700">{rek.atasNama}</span>
                                      {rek.catatan && ` • ${rek.catatan}`}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(rek.nomorRekening, rek.id)
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
                                      copiedRekening === rek.id
                                        ? "bg-emerald-600 text-white border-emerald-600"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                  >
                                    {copiedRekening === rek.id ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Disalin!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Salin No. Rek</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                                Rekening sekolah akan dihubungi oleh panitia.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* QRIS Card */}
                        <div className="lg:col-span-4">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Pembayaran Cepat via QRIS:
                          </label>
                          <div className="p-4 rounded-2xl border border-slate-200 bg-white text-center shadow-xs">
                            <div
                              onClick={() => setShowQrisModal(true)}
                              className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden border border-slate-200 cursor-pointer group bg-slate-50"
                            >
                              <Image
                                src={info?.qrisImage || "/images/qris-alfalah.jpg"}
                                alt="QRIS SMA Al Falah"
                                fill
                                className="object-contain p-2 group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                                Klik untuk Perbesar
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 block mt-2">
                              Scan QRIS Semua Bank & E-Wallet
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              BCA, Mandiri, BRI, BSI, Gopay, OVO, ShopeePay, Dana
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Upload Form Inputs */}
                      <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                        <h4 className="text-xs font-bold text-[#0B2238] uppercase tracking-wider">
                          Konfirmasi Pengiriman & Unggah Bukti
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Bank / E-Wallet Tujuan Transfer
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Bank BSI / Mandiri / QRIS"
                              value={formData.bankTujuan}
                              onChange={(e) =>
                                setFormData({ ...formData, bankTujuan: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nama Pemilik Rekening Pengirim
                            </label>
                            <input
                              type="text"
                              placeholder="Nama yang tertera pada bukti transfer"
                              value={formData.namaPengirim}
                              onChange={(e) =>
                                setFormData({ ...formData, namaPengirim: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none bg-white"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Upload Foto / File Bukti Transfer *
                            </label>

                            <div className="mt-1 flex flex-col sm:flex-row items-center gap-4">
                              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-emerald-600 bg-emerald-50/60 hover:bg-emerald-50 text-xs font-bold text-[#0D4A38] transition-colors">
                                <Upload className="w-4 h-4" />
                                <span>{uploadingBukti ? "Mengunggah..." : "Pilih File Bukti Transfer (JPG/PNG)"}</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,application/pdf"
                                  onChange={handleFileUpload}
                                  disabled={uploadingBukti}
                                  className="hidden"
                                />
                              </label>

                              {formData.buktiPembayaran && (
                                <div className="flex items-center gap-2 p-1.5 px-3 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-medium border border-emerald-200">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="truncate max-w-xs">
                                    File berhasil diunggah!
                                  </span>
                                  <a
                                    href={formData.buktiPembayaran}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline text-[11px] font-bold text-[#0D4A38] ml-1"
                                  >
                                    Lihat Bukti
                                  </a>
                                </div>
                              )}
                            </div>

                            {uploadBuktiError && (
                              <span className="text-[11px] text-rose-600 mt-1 block">
                                {uploadBuktiError}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Kembali</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!formData.buktiPembayaran || uploadingBukti}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all disabled:opacity-50"
                        >
                          <span>Lanjut ke Konfirmasi</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: KONFIRMASI AKHIR & KIRIM */}
                  {step === 4 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-base text-[#0B2238]">
                            Konfirmasi Formulir Pendaftaran
                          </h3>
                          <p className="text-xs text-slate-500">
                            Periksa kembali kebenaran data sebelum mengirimkan pendaftaran
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#0D4A38] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          Langkah 4 dari 4
                        </span>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                          <div className="sm:col-span-2">
                            <span className="text-slate-400 block font-medium">Nama Calon Siswa:</span>
                            <span className="font-bold text-slate-800 text-sm">{formData.namaLengkap}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">NISN:</span>
                            <span className="font-bold text-slate-800 font-mono">{formData.nisn}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Asal Sekolah:</span>
                            <span className="font-bold text-slate-800">{formData.asalSekolah}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Tempat, Tanggal Lahir:</span>
                            <span className="font-bold text-slate-800">
                              {formData.tempatLahir}, {formData.tanggalLahir}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Jenis Kelamin:</span>
                            <span className="font-bold text-slate-800">
                              {formData.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                          <div>
                            <span className="text-slate-400 block font-medium">Nama Ayah / Ibu:</span>
                            <span className="font-bold text-slate-800">
                              {formData.namaAyah} / {formData.namaIbu}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">No. WhatsApp Orang Tua:</span>
                            <span className="font-bold text-slate-800">{formData.noWhatsappOrtu}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-slate-400 block font-medium">Bukti Pembayaran:</span>
                            <span className="font-bold text-emerald-700">Sudah Terunggah</span>
                          </div>
                          {formData.buktiPembayaran && (
                            <a
                              href={formData.buktiPembayaran}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-[#0D4A38] underline"
                            >
                              Lihat File
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          Dengan menekan tombol <b>Kirim Pendaftaran</b>, saya menyatakan bahwa data yang saya masukkan adalah benar dan dapat dipertanggungjawabkan.
                        </span>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Kembali</span>
                        </button>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] active:scale-98 transition-all disabled:opacity-50 shadow-md"
                        >
                          <span>{submitting ? "Memproses Data..." : "Kirim Formulir Pendaftaran"}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: CEK STATUS PENDAFTARAN ================= */}
        {activeTab === "cek" && (
          <div className="max-w-2xl mx-auto py-4 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#0B2238]">
                Cek Status Verifikasi PPDB
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan Nomor Pendaftaran (contoh: <code>PPDB-2026-0001</code>) atau 10 digit NISN calon siswa
              </p>
            </div>

            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Masukkan Nomor Pendaftaran atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
              <button
                type="submit"
                disabled={checkingStatus}
                className="px-6 py-3 rounded-xl bg-[#0D4A38] text-white text-xs sm:text-sm font-bold hover:bg-[#12634B] transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>{checkingStatus ? "Mencari..." : "Cari Data"}</span>
              </button>
            </form>

            {statusError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{statusError}</span>
              </div>
            )}

            {statusResult && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-200">
                {/* Status Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      No. Pendaftaran: {statusResult.nomorPendaftaran}
                    </span>
                    <h4 className="text-lg font-bold text-[#0B2238]">
                      {statusResult.namaLengkap}
                    </h4>
                  </div>

                  <div>
                    {statusResult.status === "MENUNGGU_VERIFIKASI" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Menunggu Verifikasi</span>
                      </span>
                    )}

                    {statusResult.status === "DITERIMA" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resmi Diterima sebagai Siswa</span>
                      </span>
                    )}

                    {statusResult.status === "DITOLAK" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Pendaftaran Ditolak</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">NISN Siswa:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {statusResult.nisn}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Asal Sekolah:</span>
                    <span className="font-bold text-slate-800">
                      {statusResult.asalSekolah}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Jalur Pendaftaran:</span>
                    <span className="font-bold text-slate-800">
                      {statusResult.jalurPendaftaran}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tahun Ajaran:</span>
                    <span className="font-bold text-slate-800">
                      {statusResult.tahunAjaran}
                    </span>
                  </div>
                </div>

                {/* Status Notice / Accepted Student Info */}
                {statusResult.status === "DITERIMA" && statusResult.siswa && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <School className="w-4 h-4 text-emerald-700" />
                      <span>Data Siswa Resmi SMA Al Falah:</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-emerald-100">
                      <div>
                        <span className="text-slate-400 block">NIS (No. Induk Siswa):</span>
                        <span className="font-black text-emerald-800 font-mono text-sm">
                          {statusResult.siswa.nis}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Kelas:</span>
                        <span className="font-black text-slate-800 text-sm">
                          {statusResult.siswa.kelas}
                        </span>
                      </div>
                    </div>

                    {statusResult.siswa.akunOrtu && (
                      <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs">
                          <span className="text-slate-600 block">Akun Portal Orang Tua:</span>
                          <span className="font-bold text-slate-800 font-mono">
                            Username: {statusResult.siswa.akunOrtu.username}
                          </span>
                        </div>

                        <Link
                          href="/ortu/login"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-xs transition-all"
                        >
                          <span>Masuk Portal Orang Tua</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {statusResult.catatanAdmin && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">
                      Catatan dari Panitia:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {statusResult.catatanAdmin}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* QRIS Modal Lightbox */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-[#0B2238]">
                QRIS Resmi SMA Al Falah
              </span>
              <button
                type="button"
                onClick={() => setShowQrisModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1"
              >
                Tutup
              </button>
            </div>

            <div className="relative w-64 h-64 mx-auto rounded-xl overflow-hidden border border-slate-200">
              <Image
                src={info?.qrisImage || "/images/qris-alfalah.jpg"}
                alt="QRIS SMA Al Falah"
                fill
                className="object-contain p-2"
              />
            </div>

            <p className="text-xs text-slate-500">
              Pindai QRIS menggunakan aplikasi Mobile Banking atau E-Wallet pilihan Anda.
            </p>

            <button
              type="button"
              onClick={() => setShowQrisModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758]"
            >
              Tutup QRIS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
