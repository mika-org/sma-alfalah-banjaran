"use client";

import React, { useEffect, useState } from "react";
import { Save, CheckCircle2, Plus, Trash2 } from "lucide-react";

export default function PpdbAdminPage() {
  const [formData, setFormData] = useState({
    academicYear: "2026/2027",
    isOpen: true,
    tagline: "",
    description: "",
    registrationUrl: "",
    requirements: [""],
    schedule: [{ phase: "", dates: "", desc: "" }],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
            academicYear: p.academicYear,
            isOpen: p.isOpen,
            tagline: p.tagline,
            description: p.description,
            registrationUrl: p.registrationUrl,
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
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      academicYear: formData.academicYear,
      isOpen: formData.isOpen,
      tagline: formData.tagline,
      description: formData.description,
      registrationUrl: formData.registrationUrl,
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

      setMessage("Pengaturan PPDB berhasil disimpan!");
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
    return <div className="p-8 text-center text-slate-500 text-xs">Memuat data PPDB...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
          Pengaturan PPDB Online
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur status buka/tutup pendaftaran santri baru, tahun ajaran, tautan formulir, gelombang seleksi, dan syarat berkas.
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status & Basic Info */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Link Pendaftaran Online / WhatsApp *
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
    </div>
  );
}
