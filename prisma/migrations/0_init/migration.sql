-- CreateEnum
CREATE TYPE "PeranPengguna" AS ENUM ('SUPER_ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "StatusKonten" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "nama_pengguna" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "peran" "PeranPengguna" NOT NULL DEFAULT 'SUPER_ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengaturan_situs" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL DEFAULT 'SMA Al Falah Banjaran',
    "tagline" TEXT NOT NULL DEFAULT 'Mewujudkan Generasi Berilmu, Berakhlak, dan Siap Menghadapi Masa Depan',
    "deskripsi" TEXT NOT NULL,
    "logo" TEXT DEFAULT '/images/logo.png',
    "favicon" TEXT DEFAULT '/images/logo.png',
    "alamat" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "instagram" TEXT DEFAULT '@smaalfalahbanjaran',
    "youtube" TEXT DEFAULT 'SMA Al Falah Banjaran',
    "tiktok" TEXT DEFAULT '@smaalfalahbanjaran',
    "url_peta" TEXT,
    "url_embed_peta" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaturan_situs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beranda" (
    "id" TEXT NOT NULL,
    "judul_utama_1" TEXT NOT NULL DEFAULT 'Mewujudkan Generasi',
    "judul_sorotan" TEXT NOT NULL DEFAULT 'Berilmu, Berakhlak,',
    "judul_utama_2" TEXT NOT NULL DEFAULT 'dan Siap Menghadapi Masa Depan',
    "subjudul" TEXT NOT NULL,
    "teks_cta" TEXT NOT NULL DEFAULT 'Daftar Sekarang',
    "tautan_cta" TEXT NOT NULL DEFAULT '/ppdb',
    "gambar_hero" TEXT NOT NULL DEFAULT '/images/hero-students-hd.jpg',
    "peringkat_akreditasi" TEXT NOT NULL DEFAULT 'B',
    "lembaga_akreditasi" TEXT NOT NULL DEFAULT 'BAN-S/M',
    "status_ppdb" TEXT NOT NULL DEFAULT 'PPDB dibuka',
    "tahun_ajaran_ppdb" TEXT NOT NULL DEFAULT '2026/2027',
    "label_tentang" TEXT NOT NULL DEFAULT 'Tentang Sekolah',
    "judul_tentang_1" TEXT NOT NULL DEFAULT 'Membina Potensi Siswa Menjadi',
    "judul_tentang_sorotan" TEXT NOT NULL DEFAULT 'Generasi Mandiri & Berakhlak',
    "deskripsi_tentang" TEXT NOT NULL,
    "teks_cta_tentang" TEXT NOT NULL DEFAULT 'Cari Tahu Lebih Lanjut',
    "tautan_cta_tentang" TEXT NOT NULL DEFAULT '/profil',
    "gambar_tentang" TEXT NOT NULL DEFAULT '/images/about-school.jpg',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beranda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keunggulan" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "ikon" TEXT NOT NULL DEFAULT 'trophy',
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "status_terbit" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keunggulan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistik" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "ikon" TEXT NOT NULL DEFAULT 'graduation',
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "status_terbit" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "halaman" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "gambar_sampul" TEXT,
    "judul_seo" TEXT,
    "deskripsi_seo" TEXT,
    "status" "StatusKonten" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "halaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "ringkasan" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "gambar" TEXT NOT NULL DEFAULT '/images/about-school.jpg',
    "ikon" TEXT NOT NULL DEFAULT 'book',
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusKonten" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kegiatan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "ringkasan" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "gambar_sampul" TEXT NOT NULL DEFAULT '/images/activity-tahfidz.jpg',
    "kategori" TEXT NOT NULL DEFAULT 'Umum',
    "tanggal_kegiatan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diterbitkan_pada" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusKonten" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeri" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "url_gambar" TEXT NOT NULL,
    "teks_alt" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "status_terbit" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galeri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimoni" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "hubungan" TEXT NOT NULL,
    "kutipan" TEXT NOT NULL,
    "url_foto" TEXT NOT NULL DEFAULT '/images/avatar-1.jpg',
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "status_terbit" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimoni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" TEXT NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "jawaban" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "status_terbit" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengaturan_ppdb" (
    "id" TEXT NOT NULL,
    "tahun_ajaran" TEXT NOT NULL DEFAULT '2026/2027',
    "status_buka" BOOLEAN NOT NULL DEFAULT true,
    "tagline" TEXT NOT NULL DEFAULT 'Penerimaan Peserta Didik Baru (PPDB)',
    "deskripsi" TEXT NOT NULL,
    "persyaratan" TEXT NOT NULL,
    "jadwal" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "url_pendaftaran" TEXT NOT NULL DEFAULT 'https://wa.me/6281234567890',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaturan_ppdb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "nama_file" TEXT NOT NULL,
    "tipe_mime" TEXT NOT NULL,
    "ukuran" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "teks_alt" TEXT,
    "diunggah_oleh" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_nama_pengguna_key" ON "pengguna"("nama_pengguna");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE INDEX "keunggulan_urutan_status_terbit_idx" ON "keunggulan"("urutan", "status_terbit");

-- CreateIndex
CREATE INDEX "statistik_urutan_status_terbit_idx" ON "statistik"("urutan", "status_terbit");

-- CreateIndex
CREATE UNIQUE INDEX "halaman_slug_key" ON "halaman"("slug");

-- CreateIndex
CREATE INDEX "halaman_slug_status_idx" ON "halaman"("slug", "status");

-- CreateIndex
CREATE UNIQUE INDEX "program_slug_key" ON "program"("slug");

-- CreateIndex
CREATE INDEX "program_slug_status_urutan_idx" ON "program"("slug", "status", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "kegiatan_slug_key" ON "kegiatan"("slug");

-- CreateIndex
CREATE INDEX "kegiatan_slug_status_tanggal_kegiatan_idx" ON "kegiatan"("slug", "status", "tanggal_kegiatan");

-- CreateIndex
CREATE INDEX "galeri_urutan_status_terbit_idx" ON "galeri"("urutan", "status_terbit");

-- CreateIndex
CREATE INDEX "testimoni_urutan_status_terbit_idx" ON "testimoni"("urutan", "status_terbit");

-- CreateIndex
CREATE INDEX "faq_urutan_status_terbit_idx" ON "faq"("urutan", "status_terbit");

-- CreateIndex
CREATE INDEX "media_created_at_idx" ON "media"("created_at");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_diunggah_oleh_fkey" FOREIGN KEY ("diunggah_oleh") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

