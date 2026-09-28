"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, CheckCircle2, X, Upload } from "lucide-react";

export default function GaleriAdminPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    altText: "",
    imageUrl: "",
    sortOrder: 1,
  });

  const loadData = () => {
    fetch("/api/admin/galeri")
      .then((res) => res.json())
      .then((data) => {
        if (data.gallery) setGallery(data.gallery);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Harap unggah foto terlebih dahulu.");
      return;
    }

    try {
      const res = await fetch("/api/admin/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan foto.");

      setModalOpen(false);
      setMessage("Foto berhasil ditambahkan ke dokumentasi sekolah!");
      setTimeout(() => setMessage(null), 4000);
      setFormData({ title: "", altText: "", imageUrl: "", sortOrder: 1 });
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri sekolah?")) return;

    try {
      const res = await fetch(`/api/admin/galeri?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus foto.");
      setMessage("Foto berhasil dihapus.");
      setTimeout(() => setMessage(null), 4000);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
            Galeri Dokumentasi Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Foto yang diunggah di sini tampil pada carousel "Dokumentasi Sekolah Kami" di halaman utama.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              title: "",
              altText: "",
              imageUrl: "",
              sortOrder: gallery.length + 1,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B2238] hover:bg-[#123758] text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto Dokumentasi</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Memuat foto galeri...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col group"
            >
              <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={photo.imageUrl}
                  alt={photo.altText || photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white shadow-md transition-colors"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 bg-[#0B2238]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  Urutan #{photo.sortOrder}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-xs text-[#0B2238] truncate mb-0.5">
                  {photo.title}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {photo.altText || "Tanpa keterangan"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Upload */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0B2238]">
                Upload Foto Galeri
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih File Foto *
                </label>
                {formData.imageUrl ? (
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      {uploading ? "Mengunggah..." : "Klik untuk memilih foto"}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG, WebP hingga 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Foto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Gedung Pembelajaran Utama"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Alternatif (Alt Text)
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) =>
                    setFormData({ ...formData, altText: e.target.value })
                  }
                  placeholder="Deskripsi untuk aksesibilitas & SEO"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Urutan
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] disabled:opacity-50"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
