"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Eye,
  Send,
  Copy,
  Check,
  Phone,
  ArrowRight,
  School,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface CalonSiswa {
  id: string;
  nomor_pendaftaran: string;
  tahun_ajaran: string;
  jalur_pendaftaran: string;
  nama_lengkap: string;
  nisn: string;
  nik?: string | null;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  asal_sekolah: string;
  alamat: string;
  no_hp_siswa?: string | null;
  nama_ayah: string;
  nama_ibu: string;
  pekerjaan_ortu?: string | null;
  no_whatsapp_ortu: string;
  email_ortu?: string | null;
  bukti_pembayaran?: string | null;
  nama_pengirim?: string | null;
  nominal_transfer?: number | null;
  bank_tujuan?: string | null;
  tanggal_transfer?: string | null;
  status: "MENUNGGU_VERIFIKASI" | "DITERIMA" | "DITOLAK";
  catatan_admin?: string | null;
  created_at: string;
  siswa?: {
    id: string;
    nis: string;
    kelas: string;
    status: string;
    akun_orang_tua?: {
      id: string;
      username: string;
      nama_lengkap: string;
      no_whatsapp: string;
      password_terbuka_sementara?: string | null;
    } | null;
  } | null;
}

export default function PendaftarPpdbPage() {
  const [calonList, setCalonList] = useState<CalonSiswa[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    menunggu: 0,
    diterima: 0,
    ditolak: 0,
  });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Selected candidate for detail / verification
  const [selectedCandidate, setSelectedCandidate] = useState<CalonSiswa | null>(null);
  const [previewBukti, setPreviewBukti] = useState<string | null>(null);

  // Verification modal state
  const [verifModalOpen, setVerifModalOpen] = useState(false);
  const [verifNis, setVerifNis] = useState("");
  const [verifKelas, setVerifKelas] = useState("X-1");
  const [verifCatatan, setVerifCatatan] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Success Verification Result
  const [verifSuccessData, setVerifSuccessData] = useState<any>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectCatatan, setRejectCatatan] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const fetchCalon = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (statusFilter !== "ALL") query.set("status", statusFilter);
    if (search) query.set("q", search);

    fetch(`/api/admin/ppdb/calon-siswa?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.calonSiswa) setCalonList(data.calonSiswa);
        if (data.counts) setCounts(data.counts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCalon();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCalon();
  };

  const openVerifyModal = (c: CalonSiswa) => {
    setSelectedCandidate(c);
    // Suggest NIS
    const yearPrefix = c.tahun_ajaran.slice(2, 4) || "26";
    const randomSeq = String(Math.floor(1000 + Math.random() * 9000));
    setVerifNis(`${yearPrefix}${randomSeq}`);
    setVerifKelas("X-1");
    setVerifCatatan("Selamat, Anda dinyatakan DITERIMA sebagai siswa baru SMA Al Falah Banjaran.");
    setVerifModalOpen(true);
  };

  const handleConfirmVerification = async () => {
    if (!selectedCandidate) return;
    setVerifying(true);

    try {
      const res = await fetch(
        `/api/admin/ppdb/calon-siswa/${selectedCandidate.id}/verifikasi`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tindakan: "TERIMA",
            nisCustom: verifNis,
            kelas: verifKelas,
            catatanAdmin: verifCatatan,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memverifikasi calon siswa.");

      setVerifModalOpen(false);
      setVerifSuccessData(data);
      fetchCalon();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedCandidate) return;
    setRejecting(true);

    try {
      const res = await fetch(
        `/api/admin/ppdb/calon-siswa/${selectedCandidate.id}/verifikasi`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tindakan: "TOLAK",
            catatanAdmin: rejectCatatan || "Berkas tidak memenuhi persyaratan.",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menolak pendaftaran.");

      setRejectModalOpen(false);
      fetchCalon();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setRejecting(false);
    }
  };

  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
            Verifikasi Calon Siswa (PPDB Online)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tinjau berkas & bukti transfer, verifikasi calon siswa menjadi siswa aktif, dan generate akun orang tua unik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/siswa"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
          >
            <School className="w-4 h-4 text-[#0D4A38]" />
            <span>Lihat Data Siswa & Ortu</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "ALL", label: "Semua Pendaftar", count: counts.all, color: "text-slate-800" },
          { id: "MENUNGGU_VERIFIKASI", label: "Menunggu Verifikasi", count: counts.menunggu, color: "text-amber-600" },
          { id: "DITERIMA", label: "Sudah Diterima (Siswa)", count: counts.diterima, color: "text-emerald-600" },
          { id: "DITOLAK", label: "Ditolak", count: counts.ditolak, color: "text-rose-600" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === tab.id
                ? "bg-[#0B2238] text-white border-[#0B2238] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span
              className={`text-2xl font-black block ${
                statusFilter === tab.id ? "text-white" : tab.color
              }`}
            >
              {tab.count}
            </span>
            <span
              className={`text-xs font-medium block mt-0.5 ${
                statusFilter === tab.id ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama calon siswa, NISN, asal sekolah, atau nomor pendaftaran..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] transition-colors shrink-0"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Candidates List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Memuat daftar calon siswa...
          </div>
        ) : calonList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">
              Tidak ada data calon siswa untuk filter ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Calon Siswa & No. Reg</th>
                  <th className="py-3 px-4">Asal SMP & Jalur</th>
                  <th className="py-3 px-4">Data Orang Tua</th>
                  <th className="py-3 px-4">Bukti Pembayaran</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calonList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Calon Siswa */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {c.nama_lengkap}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                        <span className="text-[#0D4A38] font-bold">
                          {c.nomor_pendaftaran}
                        </span>
                        <span>•</span>
                        <span>NISN: {c.nisn}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {c.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} • {c.tempat_lahir}, {new Date(c.tanggal_lahir).toLocaleDateString("id-ID")}
                      </div>
                    </td>

                    {/* Asal Sekolah */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {c.asal_sekolah}
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        Jalur {c.jalur_pendaftaran}
                      </span>
                    </td>

                    {/* Orang Tua */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {c.nama_ayah || c.nama_ibu}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{c.no_whatsapp_ortu}</span>
                      </div>
                    </td>

                    {/* Bukti Pembayaran */}
                    <td className="py-3.5 px-4">
                      {c.bukti_pembayaran ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewBukti(c.bukti_pembayaran!)}
                            className="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 hover:ring-2 hover:ring-[#0D4A38] transition-all group shrink-0"
                          >
                            <Image
                              src={c.bukti_pembayaran}
                              alt="Bukti Transfer"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </button>

                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800 block">
                              Rp {(c.nominal_transfer || 150000).toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                              {c.nama_pengirim || c.bank_tujuan || "Bukti Transfer"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          Belum upload
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {c.status === "MENUNGGU_VERIFIKASI" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Menunggu</span>
                        </span>
                      )}
                      {c.status === "DITERIMA" && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Diterima (Siswa)</span>
                          </span>
                          {c.siswa && (
                            <span className="block text-[10px] font-mono text-slate-500 mt-1">
                              NIS: {c.siswa.nis} • {c.siswa.kelas}
                            </span>
                          )}
                        </div>
                      )}
                      {c.status === "DITOLAK" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[11px]">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Ditolak</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {c.status === "MENUNGGU_VERIFIKASI" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openVerifyModal(c)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0D4A38] text-white font-bold text-[11px] hover:bg-[#12634B] shadow-xs transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verifikasi & Buat Akun</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCandidate(c);
                              setRejectCatatan("");
                              setRejectModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px] transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : c.status === "DITERIMA" ? (
                        <div className="flex items-center justify-end gap-2">
                          {c.siswa?.akun_orang_tua && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              User: {c.siswa.akun_orang_tua.username}
                            </span>
                          )}
                          <Link
                            href="/admin/siswa"
                            className="inline-flex items-center gap-1 text-[11px] text-[#0D4A38] font-bold hover:underline"
                          >
                            <span>Lihat Siswa</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openVerifyModal(c)}
                          className="text-[11px] text-slate-500 hover:underline"
                        >
                          Tinjau Ulang
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL VERIFIKASI MENJADI SISWA */}
      {verifModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Verifikasi Calon Siswa Menjadi Siswa</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Siswa akan resmi terdaftar & otomatis dibuatkan <b>Akun Orang Tua Unik</b>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVerifModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Tutup
              </button>
            </div>

            {/* Candidate Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Calon Siswa:</span>
                <span className="font-bold text-slate-800">
                  {selectedCandidate.nama_lengkap}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NISN:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {selectedCandidate.nisn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Orang Tua / No. WA:</span>
                <span className="font-bold text-slate-800">
                  {selectedCandidate.nama_ayah || selectedCandidate.nama_ibu} (
                  {selectedCandidate.no_whatsapp_ortu})
                </span>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Induk Siswa (NIS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={verifNis}
                    onChange={(e) => setVerifNis(e.target.value)}
                    placeholder="Contoh: 260012"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Auto-generated / unik
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas Penempatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={verifKelas}
                    onChange={(e) => setVerifKelas(e.target.value)}
                    placeholder="Contoh: X-1 / X-A"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Verifikasi / Pesan untuk Orang Tua
                </label>
                <textarea
                  rows={2}
                  value={verifCatatan}
                  onChange={(e) => setVerifCatatan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none resize-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                <span className="font-bold block">
                  Sistem Otomatisasi Akun Orang Tua:
                </span>
                <p className="text-emerald-700">
                  Username unik <code>ortu_{selectedCandidate.nisn}</code> dan password acak aman akan otomatis digenerate. Anda akan mendapatkan template pesan WhatsApp resmi untuk dikirimkan langsung ke orang tua.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVerifModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmVerification}
                disabled={verifying}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{verifying ? "Memproses..." : "Konfirmasi & Jadikan Siswa"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HASIL VERIFIKASI & AKUN ORANG TUA SUKSES */}
      {verifSuccessData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0D4A38] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0B2238]">
                Siswa Berhasil Diterima!
              </h3>
              <p className="text-xs text-slate-500">
                Akun unik untuk orang tua siswa telah berhasil dibuat di sistem.
              </p>
            </div>

            {/* Generated Account Card */}
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-emerald-300 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block border-b border-slate-200 pb-2">
                Rincian Akun Portal Orang Tua (Unique)
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Nama Siswa:</span>
                  <span className="font-bold text-slate-800">
                    {verifSuccessData.siswa?.nama_lengkap}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">NIS & Kelas:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {verifSuccessData.siswa?.nis} ({verifSuccessData.siswa?.kelas})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Username Ortu (Unique):</span>
                  <span className="font-black text-[#0D4A38] font-mono text-sm">
                    {verifSuccessData.akunOrtu?.username}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Password Sementara:</span>
                  <span className="font-black text-rose-600 font-mono text-sm">
                    {verifSuccessData.akunOrtu?.plainPassword}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {verifSuccessData.waMessage && verifSuccessData.akunOrtu?.noWhatsapp && (
                <a
                  href={`https://wa.me/${verifSuccessData.akunOrtu.noWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    verifSuccessData.waMessage
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Akun ke WhatsApp Orang Tua</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => copyCredentials(verifSuccessData.waMessage)}
                className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Rincian Akun Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Salin Rincian Akun & Teks Pengumuman</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setVerifSuccessData(null)}
                className="w-full py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TOLAK PENDAFTARAN */}
      {rejectModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Tolak Pendaftaran PPDB</span>
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Batal
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menolak calon siswa <b>{selectedCandidate.nama_lengkap}</b>?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alasan Penolakan / Catatan untuk Orang Tua *
              </label>
              <textarea
                rows={3}
                required
                value={rejectCatatan}
                onChange={(e) => setRejectCatatan(e.target.value)}
                placeholder="Contoh: Bukti transfer tidak valid atau berkas persyaratan ijazah belum lengkap..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={rejecting}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50"
              >
                {rejecting ? "Menolak..." : "Tolak Pendaftaran"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW BUKTI TRANSFER */}
      {previewBukti && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-slate-800">
                Bukti Pembayaran Calon Siswa
              </span>
              <button
                type="button"
                onClick={() => setPreviewBukti(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Tutup (Esc)
              </button>
            </div>

            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={previewBukti}
                alt="Bukti Transfer Pendaftaran"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <a
                href={previewBukti}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#0D4A38] underline flex items-center gap-1"
              >
                <span>Buka Gambar Ukuran Asli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setPreviewBukti(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
