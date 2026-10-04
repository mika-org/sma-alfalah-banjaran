"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  KeyRound,
  Trash2,
  Edit,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  Send,
  GraduationCap,
  School,
  ExternalLink,
  Printer,
} from "lucide-react";

interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  asal_sekolah?: string | null;
  kelas: string;
  tahun_ajaran: string;
  status: string;
  created_at: string;
  akun_orang_tua?: {
    id: string;
    username: string;
    nama_lengkap: string;
    no_whatsapp: string;
    email?: string | null;
    password_terbuka_sementara?: string | null;
    status_aktif: boolean;
    terakhir_masuk?: string | null;
  } | null;
  calon_siswa?: {
    nomor_pendaftaran: string;
    jalur_pendaftaran: string;
    bukti_pembayaran?: string | null;
    nominal_transfer?: number | null;
  } | null;
}

export default function SiswaAdminPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState("ALL");

  // Reset Password State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetSuccessPassword, setResetSuccessPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit Siswa State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    namaLengkap: "",
    kelas: "",
    status: "AKTIF",
    namaOrtu: "",
    noWhatsappOrtu: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchSiswa = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set("q", search);
    if (kelasFilter !== "ALL") query.set("kelas", kelasFilter);

    fetch(`/api/admin/siswa?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.siswa) setSiswaList(data.siswa);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSiswa();
  }, [kelasFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSiswa();
  };

  const openResetPasswordModal = (s: Siswa) => {
    setSelectedSiswa(s);
    setResetSuccessPassword(null);
    setResetModalOpen(true);
  };

  const handleExecuteResetPassword = async () => {
    if (!selectedSiswa) return;
    setResetting(true);

    try {
      const res = await fetch(`/api/admin/siswa/${selectedSiswa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetPasswordOrtu: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal reset password.");

      setResetSuccessPassword(data.newPassword);
      fetchSiswa();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setResetting(false);
    }
  };

  const openEditModal = (s: Siswa) => {
    setSelectedSiswa(s);
    setEditForm({
      namaLengkap: s.nama_lengkap,
      kelas: s.kelas,
      status: s.status,
      namaOrtu: s.akun_orang_tua?.nama_lengkap || "",
      noWhatsappOrtu: s.akun_orang_tua?.no_whatsapp || "",
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;
    setSavingEdit(true);

    try {
      const res = await fetch(`/api/admin/siswa/${selectedSiswa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan perubahan.");

      setEditModalOpen(false);
      fetchSiswa();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteSiswa = async (id: string, nama: string) => {
    if (!confirm(`Hapus siswa ${nama} beserta Akun Orang Tua terkait secara permanen?`)) return;

    try {
      const res = await fetch(`/api/admin/siswa/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus siswa");
      fetchSiswa();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
            Data Siswa & Akun Orang Tua
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar siswa aktif terverifikasi dan akun portal orang tua unik masing-masing siswa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap</span>
          </button>

          <Link
            href="/admin/ppdb/pendaftar"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Verifikasi Calon Siswa Baru</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa, NIS, NISN, username orang tua..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758]"
          >
            Cari
          </button>
        </form>

        <select
          value={kelasFilter}
          onChange={(e) => setKelasFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 outline-none"
        >
          <option value="ALL">Semua Kelas</option>
          <option value="X">Kelas X</option>
          <option value="X-1">Kelas X-1</option>
          <option value="X-2">Kelas X-2</option>
          <option value="XI">Kelas XI</option>
          <option value="XII">Kelas XII</option>
        </select>
      </div>

      {/* Siswa Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Memuat data siswa & akun orang tua...
          </div>
        ) : siswaList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">
              Belum ada data siswa aktif. Silakan lakukan verifikasi pada menu Calon Siswa PPDB.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Identitas Siswa</th>
                  <th className="py-3 px-4">Kelas & Tahun</th>
                  <th className="py-3 px-4">Akun Orang Tua (Unique)</th>
                  <th className="py-3 px-4">Kontak Ortu</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siswaList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Siswa */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {s.nama_lengkap}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-slate-500">
                        <span className="font-bold text-[#0D4A38]">NIS: {s.nis}</span>
                        <span>•</span>
                        <span>NISN: {s.nisn}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {s.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} • Asal: {s.asal_sekolah || "-"}
                      </div>
                    </td>

                    {/* Kelas */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-100">
                        {s.kelas}
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-1">
                        TA {s.tahun_ajaran}
                      </span>
                    </td>

                    {/* Akun Orang Tua */}
                    <td className="py-3.5 px-4">
                      {s.akun_orang_tua ? (
                        <div className="space-y-0.5">
                          <div className="font-black text-[#0B2238] font-mono text-xs">
                            {s.akun_orang_tua.username}
                          </div>
                          <div className="text-[11px] font-medium text-slate-700">
                            {s.akun_orang_tua.nama_lengkap}
                          </div>
                          {s.akun_orang_tua.password_terbuka_sementara && (
                            <span className="inline-block text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              Pass: {s.akun_orang_tua.password_terbuka_sementara}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum dibuat</span>
                      )}
                    </td>

                    {/* Kontak */}
                    <td className="py-3.5 px-4">
                      {s.akun_orang_tua?.no_whatsapp ? (
                        <a
                          href={`https://wa.me/${s.akun_orang_tua.no_whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{s.akun_orang_tua.no_whatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{s.status}</span>
                      </span>
                      {s.akun_orang_tua?.terakhir_masuk && (
                        <span className="block text-[10px] text-slate-400 mt-1">
                          Masuk: {new Date(s.akun_orang_tua.terakhir_masuk).toLocaleDateString("id-ID")}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {s.akun_orang_tua && (
                          <button
                            type="button"
                            onClick={() => openResetPasswordModal(s)}
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset Password Orang Tua"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Data Siswa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSiswa(s.id, s.nama_lengkap)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL RESET PASSWORD AKUN ORANG TUA */}
      {resetModalOpen && selectedSiswa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Reset Password Akun Orang Tua</span>
              </h3>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Batal
              </button>
            </div>

            {resetSuccessPassword ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <span className="text-xs font-bold text-emerald-900 block">
                    Password Baru Berhasil Dibuat!
                  </span>

                  <div className="bg-white p-3 rounded-lg border border-emerald-100 font-mono text-center">
                    <span className="text-slate-400 text-[11px] block">Password Baru:</span>
                    <span className="text-lg font-black text-[#0D4A38]">
                      {resetSuccessPassword}
                    </span>
                  </div>
                </div>

                {selectedSiswa.akun_orang_tua?.no_whatsapp && (
                  <a
                    href={`https://wa.me/${selectedSiswa.akun_orang_tua.no_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Assalamu'alaikum Wr. Wb. Yth. Orang Tua dari ${selectedSiswa.nama_lengkap},\n\nBerikut informasi pembaruan password Portal Orang Tua SMA Al Falah Anda:\n- Username: ${selectedSiswa.akun_orang_tua.username}\n- Password Baru: ${resetSuccessPassword}\n- Login di: ${window.location.origin}/ortu/login\n\nTerima kasih.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Password Baru ke WhatsApp Ortu</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `Username: ${selectedSiswa.akun_orang_tua?.username}\nPassword: ${resetSuccessPassword}`
                    )
                  }
                  className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Salin Password</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="w-full py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Password akun orang tua untuk siswa <b>{selectedSiswa.nama_lengkap}</b> (Username: <code>{selectedSiswa.akun_orang_tua?.username}</code>) akan di-reset dengan password acak baru.
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={handleExecuteResetPassword}
                    disabled={resetting}
                    className="px-5 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] disabled:opacity-50"
                  >
                    {resetting ? "Mereset..." : "Konfirmasi Reset Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL EDIT SISWA */}
      {editModalOpen && selectedSiswa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#0D4A38]" />
                <span>Edit Data Siswa & Orang Tua</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Batal
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.namaLengkap}
                  onChange={(e) =>
                    setEditForm({ ...editForm, namaLengkap: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.kelas}
                    onChange={(e) =>
                      setEditForm({ ...editForm, kelas: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Siswa *
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold"
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="LULUS">LULUS</option>
                    <option value="PINDAH">PINDAH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={editForm.namaOrtu}
                  onChange={(e) =>
                    setEditForm({ ...editForm, namaOrtu: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. WhatsApp Orang Tua
                </label>
                <input
                  type="text"
                  value={editForm.noWhatsappOrtu}
                  onChange={(e) =>
                    setEditForm({ ...editForm, noWhatsappOrtu: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] disabled:opacity-50"
                >
                  {savingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
