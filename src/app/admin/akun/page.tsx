"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  KeyRound,
  Trash2,
  Edit,
  Shield,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Lock,
  Mail,
  User,
  Save,
  ShieldCheck,
} from "lucide-react";

interface Pengguna {
  id: string;
  nama_pengguna: string;
  nama: string;
  email: string;
  peran: "SUPER_ADMIN" | "EDITOR";
  created_at: string;
}

export default function AkunAdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "myProfile">("users");

  // User Management State
  const [users, setUsers] = useState<Pengguna[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  // My Profile State
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    email: "",
    role: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Modal: Add User
  const [addUserModal, setAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    nama: "",
    nama_pengguna: "",
    email: "",
    peran: "EDITOR",
    password: "",
  });
  const [addingUser, setAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);

  // Modal: Edit User
  const [editUserModal, setEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Pengguna | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    nama: "",
    nama_pengguna: "",
    email: "",
    peran: "EDITOR",
  });
  const [editingUser, setEditingUser] = useState(false);
  const [editUserError, setEditUserError] = useState<string | null>(null);

  // Modal: Reset Password
  const [resetModal, setResetModal] = useState(false);
  const [resetUser, setResetUser] = useState<Pengguna | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [resettingUser, setResettingUser] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);
  const [copiedReset, setCopiedReset] = useState(false);

  // Global notice
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoadingUsers(true);
    fetch("/api/admin/pengguna")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
        if (data.currentUserId) setCurrentUserId(data.currentUserId);
        setLoadingUsers(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingUsers(false);
      });
  };

  const fetchMyProfile = () => {
    fetch("/api/admin/akun")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile({
            username: data.user.username,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
    fetchMyProfile();
  }, []);

  // Handle Add User Submit
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(true);
    setAddUserError(null);

    try {
      const res = await fetch("/api/admin/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addUserForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan pengguna.");

      setGlobalMessage(`Pengguna '${addUserForm.nama_pengguna}' berhasil ditambahkan!`);
      setTimeout(() => setGlobalMessage(null), 4000);
      setAddUserModal(false);
      setAddUserForm({
        nama: "",
        nama_pengguna: "",
        email: "",
        peran: "EDITOR",
        password: "",
      });
      fetchUsers();
    } catch (err: any) {
      setAddUserError(err.message || "Terjadi kesalahan.");
    } finally {
      setAddingUser(false);
    }
  };

  // Open Edit User
  const openEditModal = (u: Pengguna) => {
    setSelectedUser(u);
    setEditUserForm({
      nama: u.nama,
      nama_pengguna: u.nama_pengguna,
      email: u.email,
      peran: u.peran,
    });
    setEditUserError(null);
    setEditUserModal(true);
  };

  // Handle Edit User Submit
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditingUser(true);
    setEditUserError(null);

    try {
      const res = await fetch(`/api/admin/pengguna/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUserForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui pengguna.");

      setGlobalMessage("Data akun pengguna berhasil diperbarui!");
      setTimeout(() => setGlobalMessage(null), 4000);
      setEditUserModal(false);
      fetchUsers();
      if (selectedUser.id === currentUserId) fetchMyProfile();
    } catch (err: any) {
      setEditUserError(err.message || "Terjadi kesalahan.");
    } finally {
      setEditingUser(false);
    }
  };

  // Open Reset Password Modal
  const openResetPasswordModal = (u: Pengguna) => {
    setResetUser(u);
    const randomPin = Math.floor(100000 + Math.random() * 900000);
    setResetPasswordVal(`Falah@${randomPin}`);
    setResetError(null);
    setResetSuccessNotice(null);
    setCopiedReset(false);
    setResetModal(true);
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser) return;
    setResettingUser(true);
    setResetError(null);

    try {
      const res = await fetch(`/api/admin/pengguna/${resetUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: resetPasswordVal }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mereset password.");

      setResetSuccessNotice("Password akun berhasil direset!");
    } catch (err: any) {
      setResetError(err.message || "Terjadi kesalahan.");
    } finally {
      setResettingUser(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (u: Pengguna) => {
    if (u.id === currentUserId) {
      alert("Anda tidak dapat menghapus akun Anda sendiri saat sedang login.");
      return;
    }

    if (!confirm(`Hapus akun admin '${u.nama}' (${u.nama_pengguna}) secara permanen?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/pengguna/${u.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus pengguna.");

      setGlobalMessage("Akun pengguna berhasil dihapus.");
      setTimeout(() => setGlobalMessage(null), 4000);
      fetchUsers();
    } catch (err: any) {
      setGlobalError(err.message || "Terjadi kesalahan.");
      setTimeout(() => setGlobalError(null), 4000);
    }
  };

  // Handle Personal Profile Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch("/api/admin/akun", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil.");

      setProfileMessage("Profil Anda berhasil diperbarui!");
      setTimeout(() => setProfileMessage(null), 4000);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Personal Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/admin/akun", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui password.");

      setPasswordMessage("Password Anda berhasil diperbarui!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMessage(null), 4000);
    } catch (err: any) {
      setPasswordError(err.message || "Terjadi kesalahan");
    } finally {
      setSavingPassword(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReset(true);
    setTimeout(() => setCopiedReset(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2238]">
            Manajemen Pengguna & Akun Admin
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola hak akses admin/staf, tambah akun baru, ubah data akun, dan reset password.
          </p>
        </div>

        {activeTab === "users" && (
          <button
            type="button"
            onClick={() => setAddUserModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm transition-all shrink-0 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna Baru</span>
          </button>
        )}
      </div>

      {globalMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{globalMessage}</span>
        </div>
      )}

      {globalError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-3.5 px-4 text-center font-bold text-xs sm:text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "users"
              ? "border-[#0D4A38] text-[#0D4A38] bg-emerald-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Pengguna / Admin ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("myProfile")}
          className={`flex-1 py-3.5 px-4 text-center font-bold text-xs sm:text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "myProfile"
              ? "border-[#0D4A38] text-[#0D4A38] bg-emerald-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Saya & Ganti Password Sendiri</span>
        </button>
      </div>

      {/* TAB 1: MANAJEMEN PENGGUNA (USERS LIST) */}
      {activeTab === "users" && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200/80 shadow-xs overflow-hidden">
          {loadingUsers ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Memuat data pengguna...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                Belum ada pengguna lain yang terdaftar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3.5 px-5">Nama Lengkap & Username</th>
                    <th className="py-3.5 px-5">Email</th>
                    <th className="py-3.5 px-5">Peran / Hak Akses</th>
                    <th className="py-3.5 px-5">Terdaftar Sejak</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isSelf = u.id === currentUserId;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Name & Username */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {u.nama}
                            </span>
                            {isSelf && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            @{u.nama_pengguna}
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-5">
                          <span className="font-medium text-slate-700">
                            {u.email}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              u.peran === "SUPER_ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            <span>{u.peran === "SUPER_ADMIN" ? "Super Admin" : "Editor Konten"}</span>
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-slate-500">
                          {new Date(u.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reset Password */}
                            <button
                              type="button"
                              onClick={() => openResetPasswordModal(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 text-[11px] font-bold transition-colors"
                              title="Reset Password Akun"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Reset Password</span>
                            </button>

                            {/* Edit User Data */}
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-[11px] font-bold transition-colors"
                              title="Ubah Data Akun"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-500" />
                              <span>Ubah Data</span>
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              disabled={isSelf}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isSelf
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              }`}
                              title={isSelf ? "Tidak dapat menghapus akun sendiri" : "Hapus Akun"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFIL SAYA & GANTI PASSWORD SENDIRI */}
      {activeTab === "myProfile" && (
        <div className="space-y-6">
          {/* Ubah Profil Sendiri */}
          <div className="bg-white rounded-b-2xl p-6 sm:p-8 border border-t-0 border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#0B2238] border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0D4A38]" />
              <span>Informasi Profil Akun Anda</span>
            </h2>

            {profileMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Akun *
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile.username}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Peran Saat Ini
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile.role === "SUPER_ADMIN" ? "Super Admin" : "Editor Konten"}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-500 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] shadow-sm disabled:opacity-50 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Ganti Password Sendiri */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#0B2238] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0D4A38]" />
              <span>Ganti Password Sendiri</span>
            </h2>

            {passwordMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{passwordMessage}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Saat Ini *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password Anda saat ini"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
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
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Konfirmasi Password Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang password baru"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-[#123758] shadow-sm disabled:opacity-50 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>{savingPassword ? "Memperbarui..." : "Perbarui Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PENGGUNA BARU */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#0D4A38]" />
                <span>Tambah Pengguna / Admin Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setAddUserModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Batal
              </button>
            </div>

            {addUserError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{addUserError}</span>
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ust. Ahmad Fauzi"
                  value={addUserForm.nama}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ahmad_fauzi"
                  value={addUserForm.nama_pengguna}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, nama_pengguna: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ahmad@smaalfalahbanjaran.sch.id"
                  value={addUserForm.email}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peran / Hak Akses *
                </label>
                <select
                  value={addUserForm.peran}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, peran: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold text-slate-800"
                >
                  <option value="EDITOR">Editor Konten (Berita, Galeri, Profil)</option>
                  <option value="SUPER_ADMIN">Super Admin (Akses Penuh CMS & User)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Awal *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={addUserForm.password}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddUserModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="px-5 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] disabled:opacity-50"
                >
                  {addingUser ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UBAH DATA PENGGUNA */}
      {editUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#0D4A38]" />
                <span>Ubah Data Akun Pengguna</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditUserModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Batal
              </button>
            </div>

            {editUserError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editUserError}</span>
              </div>
            )}

            <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={editUserForm.nama}
                  onChange={(e) =>
                    setEditUserForm({ ...editUserForm, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={editUserForm.nama_pengguna}
                  onChange={(e) =>
                    setEditUserForm({ ...editUserForm, nama_pengguna: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={editUserForm.email}
                  onChange={(e) =>
                    setEditUserForm({ ...editUserForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peran / Hak Akses *
                </label>
                <select
                  value={editUserForm.peran}
                  onChange={(e) =>
                    setEditUserForm({ ...editUserForm, peran: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D4A38] outline-none font-bold text-slate-800"
                >
                  <option value="EDITOR">Editor Konten</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUserModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editingUser}
                  className="px-5 py-2 rounded-lg bg-[#0D4A38] text-white text-xs font-bold hover:bg-[#12634B] disabled:opacity-50"
                >
                  {editingUser ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD PENGGUNA */}
      {resetModal && resetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Reset Password Pengguna</span>
              </h3>
              <button
                type="button"
                onClick={() => setResetModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Tutup
              </button>
            </div>

            {resetSuccessNotice ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <span className="text-xs font-bold text-emerald-900 block">
                    Password Berhasil Direset!
                  </span>

                  <div className="bg-white p-3 rounded-lg border border-emerald-100 font-mono text-center">
                    <span className="text-slate-400 text-[11px] block">Password Baru:</span>
                    <span className="text-base font-black text-[#0D4A38]">
                      {resetPasswordVal}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `Username: ${resetUser.nama_pengguna}\nPassword: ${resetPasswordVal}`
                    )
                  }
                  className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  {copiedReset ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Salin Username & Password</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setResetModal(false)}
                  className="w-full py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <p className="text-xs text-slate-600">
                  Password untuk akun <b>{resetUser.nama}</b> (@{resetUser.nama_pengguna}) akan diganti dengan password baru di bawah ini:
                </p>

                {resetError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password Baru *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={resetPasswordVal}
                      onChange={(e) => setResetPasswordVal(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-[#0D4A38] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const randomPin = Math.floor(100000 + Math.random() * 900000);
                        setResetPasswordVal(`Falah@${randomPin}`);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700"
                    >
                      Acak
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Minimal 6 karakter. Anda dapat mengacak password otomatis.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setResetModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={resettingUser}
                    className="px-5 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50"
                  >
                    {resettingUser ? "Mereset..." : "Konfirmasi Reset"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
