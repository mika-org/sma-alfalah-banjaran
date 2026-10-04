"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  CreditCard,
  QrCode,
  Upload,
  Users,
  AlertCircle,
  Settings,
  Eye,
  Check,
} from "lucide-react";

interface Rekening {
  id: string;
  nama_bank: string;
  nomor_rekening: string;
  atas_nama: string;
  catatan?: string | null;
  status_aktif: boolean;
  urutan: number;
}

export default function PpdbAdminPage() {
  const [activeTab, setActiveTab] = useState<"umum" | "pembayaran">("umum");

  // General Settings
  const [formData, setFormData] = useState({
    academicYear: "2026/2027",
    isOpen: true,
    tagline: "",
    description: "",
    registrationUrl: "",
    biayaPendaftaran: 150000,
    instruksiPembayaran: "",
    qrisImage: "/images/qris-alfalah.jpg",
    requirements: [""],
    schedule: [{ phase: "", dates: "", desc: "" }],
  });

  // Bank Accounts State
  const [rekeningList, setRekeningList] = useState<Rekening[]>([]);
  const [loadingRekening, setLoadingRekening] = useState(false);
  const [showAddRekeningModal, setShowAddRekeningModal] = useState(false);
  const [newRekening, setNewRekening] = useState({
    namaBank: "",
    nomorRekening: "",
    atasNama: "",
    catatan: "",
    statusAktif: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQris, setUploadingQris] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load PPDB settings
  useEffect(() => {
    fetch("/api/admin/ppdb")
      .then((res) => res.json())
      .then((data) => {
        if (data.ppdb) {
          const p = data.ppdb;
          let reqs = [];
          let sched = [];
          try {
            reqs = typeof p.requirements === "string" ? JSON.parse(p.requirements) : p.requirements;
          } catch (_e) {
            reqs = [];
          }
          try {
            sched = typeof p.schedule === "string" ? JSON.parse(p.schedule) : p.schedule;
          } catch (_e) {
            sched = [];
          }

          setFormData({
            academicYear: p.academicYear || "2026/2027",
            isOpen: p.isOpen ?? true,
            tagline: p.tagline || "",
            description: p.description || "",
            registrationUrl: p.registrationUrl || "",
            biayaPendaftaran: p.biayaPendaftaran ?? 150000,
            instruksiPembayaran: p.instruksiPembayaran || "",
            qrisImage: p.qrisImage || "/images/qris-alfalah.jpg",
            requirements: reqs.length > 0 ? reqs : [""],
            schedule:
              sched.length > 0
                ? sched
                : [{ phase: "", dates: "", desc: "" }],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    loadRekening();
  }, []);

  const loadRekening = () => {
    setLoadingRekening(true);
    fetch("/api/admin/ppdb/rekening")
      .then((res) => res.json())
      .then((data) => {
        if (data.rekening) setRekeningList(data.rekening);
        setLoadingRekening(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingRekening(false);
      });
  };

  const handleReqChange = (idx: number, val: string) => {
    const updated = [...formData.requirements];
    updated[idx] = val;
    setFormData({ ...formData, requirements: updated });
  };

  const addReq = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const removeReq = (idx: number) => {
    const updated = formData.requirements.filter((_, i) => i !== idx);
    setFormData({ ...formData, requirements: updated });
  };

  const handleSchedChange = (idx: number, field: string, val: string) => {
    const updated = [...formData.schedule];
    (updated[idx] as any)[field] = val;
    setFormData({ ...formData, schedule: updated });
  };

  const addSched = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { phase: "", dates: "", desc: "" }],
    });
  };

  const removeSched = (idx: number) => {
    const updated = formData.schedule.filter((_, i) => i !== idx);
    setFormData({ ...formData, schedule: updated });
  };

  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQris(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah QRIS");

      setFormData((prev) => ({ ...prev, qrisImage: data.url }));
      setMessage("Gambar QRIS berhasil diunggah! Tekan tombol simpan untuk menerapkan.");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengunggah QRIS");
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setUploadingQris(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setErrorMessage(null);

    const payload = {
      academicYear: formData.academicYear,
      isOpen: formData.isOpen,
      tagline: formData.tagline,
      description: formData.description,
      registrationUrl: formData.registrationUrl,
      biayaPendaftaran: formData.biayaPendaftaran,
      instruksiPembayaran: formData.instruksiPembayaran,
      qrisImage: formData.qrisImage,
      requirements: JSON.stringify(formData.requirements.filter(Boolean)),
      schedule: JSON.stringify(formData.schedule),
    };

    try {
      const res = await fetch("/api/admin/ppdb", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan pengaturan PPDB.");

      setMessage("Pengaturan PPDB & Pembayaran berhasil disimpan!");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan.");
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddRekening = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/ppdb/rekening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRekening),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah rekening");

      setMessage("Nomor rekening berhasil ditambahkan!");
      setShowAddRekeningModal(false);
      setNewRekening({
        namaBank: "",
        nomorRekening: "",
        atasNama: "",
        catatan: "",
        statusAktif: true,
      });
      loadRekening();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan");
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleToggleRekeningStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/ppdb/rekening", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, statusAktif: !currentStatus }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status rekening");
      loadRekening();
    } catch (err: any) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleDeleteRekening = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus nomor rekening ini?")) return;
    try {
      const res = await fetch(`/api/admin/ppdb/rekening?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus rekening");
      setMessage("Nomor rekening berhasil dihapus.");
      loadRekening();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Memuat data PPDB...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header with Quick Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
            Pengaturan PPDB & Metode Pembayaran
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur status pendaftaran, jadwal, rekening bank penerima, dan gambar barcode QRIS resmi.
          </p>
        </div>

        <Link
          href="/admin/ppdb/pendaftar"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          <Users className="w-4 h-4" />
          <span>Kelola Calon Siswa Terdaftar</span>
        </Link>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => setActiveTab("umum")}
          className={`flex-1 py-3 px-4 text-center font-bold text-xs sm:text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "umum"
              ? "border-[#0D4A38] text-[#0D4A38] bg-emerald-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Informasi Umum & Gelombang</span>
        </button>

        <button
          onClick={() => setActiveTab("pembayaran")}
          className={`flex-1 py-3 px-4 text-center font-bold text-xs sm:text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "pembayaran"
              ? "border-[#0D4A38] text-[#0D4A38] bg-emerald-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Rekening Bank & QRIS ({rekeningList.length})</span>
        </button>
      </div>

      {/* TAB 1: INFORMASI UMUM & JADWAL */}
      {activeTab === "umum" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-b-2xl p-6 sm:p-8 border border-t-0 border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#0B2238] border-b border-slate-100 pb-3">
              Status & Tahun Ajaran
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              {/* Toggle Status Buka/Tutup */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Status Penerimaan Siswa Baru
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formData.isOpen ? "Saat ini sedang DIBUKA" : "Saat ini sedang DITUTUP"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isOpen: !formData.isOpen })}
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    formData.isOpen ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                      formData.isOpen ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun Ajaran PPDB *
                </label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) =>
                    setFormData({ ...formData, academicYear: e.target.value })
                  }
                  placeholder="2026/2027"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biaya Pendaftaran Formulir (Rp) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.biayaPendaftaran}
                  onChange={(e) =>
                    setFormData({ ...formData, biayaPendaftaran: Number(e.target.value) })
                  }
                  placeholder="150000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Kontak WhatsApp Panitia *
                </label>
                <input
                  type="text"
                  required
                  value={formData.registrationUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationUrl: e.target.value })
                  }
                  placeholder="https://wa.me/6281234567890"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Pengantar PPDB
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Persyaratan Berkas */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0D4A38]">
                Persyaratan Berkas Pendaftaran
              </h2>
              <button
                type="button"
                onClick={addReq}
                className="inline-flex items-center gap-1 text-[11px] text-[#0D4A38] font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Syarat</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-5">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleReqChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReq(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Jadwal Gelombang */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B2238]">
                Gelombang & Jadwal Pendaftaran
              </h2>
              <button
                type="button"
                onClick={addSched}
                className="inline-flex items-center gap-1 text-[11px] text-[#0B2238] font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Gelombang</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Gelombang #{idx + 1}
                    </span>
                    {formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSched(idx)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Nama Jalur / Gelombang
                      </label>
                      <input
                        type="text"
                        value={item.phase}
                        onChange={(e) =>
                          handleSchedChange(idx, "phase", e.target.value)
                        }
                        placeholder="Contoh: Gelombang 1 (Jalur Prestasi)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0D4A38] outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Rentang Tanggal
                      </label>
                      <input
                        type="text"
                        value={item.dates}
                        onChange={(e) =>
                          handleSchedChange(idx, "dates", e.target.value)
                        }
                        placeholder="Contoh: 1 Januari - 31 Maret 2026"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0D4A38] outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Keterangan Singkat
                    </label>
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) =>
                        handleSchedChange(idx, "desc", e.target.value)
                      }
                      placeholder="Contoh: Bebas tes tulis dan potongan infaq"
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
              <span>{saving ? "Menyimpan..." : "Simpan Pengaturan PPDB"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: REKENING BANK & QRIS */}
      {activeTab === "pembayaran" && (
        <div className="space-y-6">
          {/* Instruksi & Biaya Pembayaran Form */}
          <div className="bg-white rounded-b-2xl p-6 sm:p-8 border border-t-0 border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0B2238]">
                  Instruksi & Nominal Pembayaran PPDB
                </h2>
                <p className="text-xs text-slate-500">
                  Teks instruksi yang tampil pada formulir pendaftaran calon siswa
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Menyimpan..." : "Simpan Instruksi"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nominal Biaya Pendaftaran (Rp)
                </label>
                <input
                  type="number"
                  value={formData.biayaPendaftaran}
                  onChange={(e) =>
                    setFormData({ ...formData, biayaPendaftaran: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Petunjuk / Catatan Transfer
                </label>
                <input
                  type="text"
                  value={formData.instruksiPembayaran}
                  onChange={(e) =>
                    setFormData({ ...formData, instruksiPembayaran: e.target.value })
                  }
                  placeholder="Transfer sesuai nominal ke salah satu rekening atau scan QRIS..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>
            </div>
          </div>

          {/* QRIS Management Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0D4A38] flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-700" />
                <span>Gambar Barcode QRIS Resmi Sekolah</span>
              </h2>
              <p className="text-xs text-slate-500">
                Gambar QRIS akan ditampilkan kepada pendaftar saat memilih pembayaran digital
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs">
                <Image
                  src={formData.qrisImage || "/images/qris-alfalah.jpg"}
                  alt="QRIS Sekolah"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Upload Gambar QRIS Baru
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Gunakan format gambar JPG, PNG, atau WebP (disarankan orientasi persegi/kartu standar QRIS).
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingQris ? "Mengunggah..." : "Pilih File Gambar QRIS"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleQrisUpload}
                      disabled={uploadingQris}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-white transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Terapkan Gambar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Daftar Nomor Rekening Bank */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0B2238] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0D4A38]" />
                  <span>Daftar Nomor Rekening Bank</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Kelola nomor rekening bank untuk transfer biaya pendaftaran PPDB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddRekeningModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah No. Rekening</span>
              </button>
            </div>

            {loadingRekening ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Memuat rekening bank...
              </div>
            ) : rekeningList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                Belum ada nomor rekening yang ditambahkan. Silakan klik tombol <b>Tambah No. Rekening</b>.
              </div>
            ) : (
              <div className="space-y-3">
                {rekeningList.map((rek) => (
                  <div
                    key={rek.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs text-slate-900">
                          {rek.nama_bank}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rek.status_aktif
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {rek.status_aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-base font-extrabold text-slate-900 font-mono tracking-wider">
                        {rek.nomor_rekening}
                      </p>
                      <p className="text-xs text-slate-600">
                        Atas Nama: <span className="font-bold text-slate-800">{rek.atas_nama}</span>
                        {rek.catatan && ` • ${rek.catatan}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleToggleRekeningStatus(rek.id, rek.status_aktif)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          rek.status_aktif
                            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                        }`}
                      >
                        {rek.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRekening(rek.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus Rekening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH REKENING */}
      {showAddRekeningModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0D4A38]" />
                <span>Tambah Nomor Rekening Bank</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRekeningModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Batal
              </button>
            </div>

            <form onSubmit={handleAddRekening} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Bank *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Syariah Indonesia (BSI) / BCA"
                  value={newRekening.namaBank}
                  onChange={(e) =>
                    setNewRekening({ ...newRekening, namaBank: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Rekening *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 7123456789"
                  value={newRekening.nomorRekening}
                  onChange={(e) =>
                    setNewRekening({ ...newRekening, nomorRekening: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atas Nama Rekening *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMA AL FALAH BANJARAN"
                  value={newRekening.atasNama}
                  onChange={(e) =>
                    setNewRekening({ ...newRekening, atasNama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tambahan (Kode Bank / Cabang)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kode Bank: 451"
                  value={newRekening.catatan}
                  onChange={(e) =>
                    setNewRekening({ ...newRekening, catatan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="statusAktif"
                  checked={newRekening.statusAktif}
                  onChange={(e) =>
                    setNewRekening({ ...newRekening, statusAktif: e.target.checked })
                  }
                  className="text-[#0D4A38] rounded"
                />
                <label htmlFor="statusAktif" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Aktifkan rekening ini pada formulir PPDB publik
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRekeningModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B]"
                >
                  Simpan Rekening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
