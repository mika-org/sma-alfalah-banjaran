"use client";

import React, { useEffect, useState } from "react";
import { Save, CheckCircle2, Plus, Trash2 } from "lucide-react";

export default function ProfilAdminPage() {
  const [formData, setFormData] = useState({
    visi: "",
    misi: [""],
    principalName: "",
    principalRole: "",
    greeting: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/profil")
      .then((res) => res.json())
      .then((data) => {
        if (data.page && data.page.content) {
          try {
            const parsed = JSON.parse(data.page.content);
            setFormData(parsed);
          } catch (e) {
            console.error(e);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleMisiChange = (index: number, val: string) => {
    const updated = [...formData.misi];
    updated[index] = val;
    setFormData({ ...formData, misi: updated });
  };

  const addMisi = () => {
    setFormData({ ...formData, misi: [...formData.misi, ""] });
  };

  const removeMisi = (index: number) => {
    const updated = formData.misi.filter((_, i) => i !== index);
    setFormData({ ...formData, misi: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data.");

      setMessage("Konten profil sekolah berhasil diperbarui!");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Terjadi kesalahan.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Memuat konten profil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
          Pengaturan Profil Sekolah
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit Visi, Misi, dan Sambutan Kepala Sekolah yang tampil pada halaman profil.
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sambutan Kepala Sekolah */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0B2238] border-b border-slate-100 pb-3">
            Sambutan Kepala Sekolah
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) =>
                  setFormData({ ...formData, principalName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan / Gelar
              </label>
              <input
                type="text"
                value={formData.principalRole}
                onChange={(e) =>
                  setFormData({ ...formData, principalRole: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teks Sambutan
            </label>
            <textarea
              rows={4}
              value={formData.greeting}
              onChange={(e) =>
                setFormData({ ...formData, greeting: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#0D4A38] border-b border-slate-100 pb-3">
            Visi & Misi Sekolah
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Visi Sekolah
            </label>
            <textarea
              rows={3}
              value={formData.visi}
              onChange={(e) =>
                setFormData({ ...formData, visi: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700">
                Poin-poin Misi Sekolah
              </label>
              <button
                type="button"
                onClick={addMisi}
                className="inline-flex items-center gap-1 text-[11px] text-[#0D4A38] font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Poin Misi</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.misi.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-5">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => handleMisiChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                  />
                  {formData.misi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMisi(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] active:scale-98 transition-all disabled:opacity-50 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Profil Sekolah"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
