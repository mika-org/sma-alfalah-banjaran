# Prompt Pengembangan Website Sekolah + CMS

## Tujuan
Bangun website **SMA Al Falah Banjaran** berdasarkan gambar referensi yang diberikan. Gunakan **Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, dan PostgreSQL**. Kerjakan **frontend terlebih dahulu**, lalu backend dan integrasi CMS. Gunakan konfigurasi database dari file `.env` yang **sudah tersedia** di project; jangan menimpa atau menampilkan nilai rahasianya. Jika variabel wajib belum tersedia, jelaskan variabel yang perlu ditambahkan.

## Tahap 1 — Frontend Website Publik (prioritas pertama)
Implementasikan halaman beranda responsif dengan komposisi yang mendekati referensi, bukan template dashboard generik. Identitas visual: navy gelap, hijau tua, latar putih, tipografi bersih, radius dan bayangan halus, ruang antarelemen proporsional. Jangan menggunakan efek gradient berlebihan, ikon acak, atau tampilan yang terasa seperti template AI. Pakai konten contoh yang mudah diganti melalui CMS; jangan gunakan Lorem Ipsum pada hasil akhir. Bila aset asli belum tersedia, buat placeholder yang jelas dan terpusat agar mudah diganti.

### Struktur halaman beranda
1. **Navbar:** logo dan nama sekolah, Beranda, Profil, Program, Kegiatan, PPDB, Kontak, tombol Daftar Sekarang. Navbar responsif dengan menu mobile.
2. **Hero:** judul besar “Mewujudkan Generasi Berilmu, Berakhlak, dan Siap Menghadapi Masa Depan”, deskripsi singkat, tombol Daftar Sekarang, foto siswa sebagai fokus visual. Dua kartu kecil di kanan: Akreditasi B dan PPDB tahun ajaran aktif. Tombol mengarah ke halaman atau tautan PPDB yang dapat diatur.
3. **Mengapa Memilih Kami:** judul, deskripsi, empat kartu keunggulan dengan ikon, judul, dan uraian.
4. **Tentang Sekolah:** judul, deskripsi, tombol Cari Tahu Lebih Lanjut, foto kegiatan, serta tiga kartu statistik (rasio guru/murid, ekstrakurikuler, kelas/laboratorium). Angka harus berasal dari CMS, bukan klaim otomatis.
5. **Dokumentasi Sekolah Kami:** blok navy, carousel galeri foto dengan tombol sebelumnya/berikutnya, teks alternatif gambar, dan dukungan swipe pada mobile.
6. **Cerita dari Orang Tua:** blok hijau tua, tiga kartu testimoni dengan foto, nama, dan kutipan. Tampilkan hanya testimoni yang diizinkan untuk dipublikasikan.
7. **FAQ:** accordion pertanyaan pendaftaran, proses, syarat, biaya, dan awal tahun ajaran; konten bisa diedit.
8. **Kontak dan sosial media:** kartu WhatsApp, tautan Instagram/YouTube/TikTok yang tersedia, peta lokasi melalui URL embed yang dikonfigurasi, dan alamat sekolah.
9. **Footer:** logo, deskripsi singkat, navigasi, kontak, sosial media, hak cipta otomatis.

Buat juga halaman dasar `/profil`, `/program`, `/kegiatan`, `/ppdb`, dan `/kontak`, memakai layout dan komponen yang konsisten. Halaman `/kegiatan` dapat menampilkan daftar kegiatan dan detail berdasarkan slug. Jangan mengarang informasi faktual sekolah yang belum diberikan.

### Standar frontend
- Mobile-first dan nyaman di desktop/tablet/mobile; navbar mobile dan carousel dapat digunakan dengan keyboard.
- Komponen reusable: `Navbar`, `Footer`, `Hero`, `FeatureCard`, `StatCard`, `GalleryCarousel`, `TestimonialCard`, `FAQAccordion`, `ContactCard`.
- Gunakan `next/image`, optimasi gambar, metadata SEO per halaman, Open Graph, semantic HTML, focus state, dan alt text.
- Siapkan skeleton/loading, empty state, dan fallback gambar; hindari layout shift.
- Pisahkan konten awal dalam satu berkas data sementara sehingga UI dapat selesai sebelum backend.
- Pastikan seluruh tombol dan navigasi berfungsi, tanpa tautan `#` yang tidak bermakna.

## Tahap 2 — Frontend CMS Sederhana
Buat panel admin di `/admin` dengan layout sidebar minimalis, responsif, dan mudah digunakan staf sekolah. Awalnya bangun seluruh antarmuka dengan data mock dan validasi form, kemudian sambungkan ke API setelah backend selesai.

### Menu CMS
- **Dashboard:** ringkasan jumlah kegiatan, foto galeri, testimoni, FAQ, dan status PPDB.
- **Identitas Sekolah:** nama, logo, favicon, deskripsi, alamat, telepon, email, WhatsApp, URL peta, dan tautan sosial media.
- **Beranda:** edit teks hero, gambar hero, CTA, akreditasi, empat keunggulan, bagian tentang, dan statistik.
- **Profil:** konten profil sekolah, visi, misi, dan foto.
- **Program:** CRUD program unggulan dengan judul, deskripsi, gambar, urutan, dan status tampil.
- **Kegiatan:** CRUD judul, slug, ringkasan, konten, gambar utama, tanggal kegiatan, status draft/publikasi.
- **Galeri:** unggah beberapa foto, judul, alt text, urutan, status tampil, dan hapus foto.
- **Testimoni:** nama, hubungan dengan sekolah, foto, kutipan, urutan, dan status publikasi.
- **FAQ:** pertanyaan, jawaban, urutan, status tampil.
- **PPDB:** status buka/tutup, tahun ajaran, deskripsi, persyaratan, jadwal, serta URL/formulir pendaftaran eksternal. Untuk versi pertama, tidak perlu sistem pendaftaran siswa penuh.
- **Akun Admin:** profil dan ubah password.

Gunakan pola form yang konsisten, preview gambar, dialog konfirmasi hapus, notifikasi berhasil/gagal, pencarian dan pagination sederhana untuk daftar panjang, serta preview sebelum publikasi bila memungkinkan.

## Tahap 3 — Backend, Database, dan Integrasi
Setelah UI publik dan CMS selesai, implementasikan backend menggunakan **Next.js Route Handlers** (`app/api/...`) dengan **Prisma + PostgreSQL**. Jangan membuat server Express terpisah.

### Autentikasi dan otorisasi
- Login admin menggunakan email dan password; password di-hash dengan Argon2id atau bcrypt.
- Gunakan session aman (misalnya Auth.js) dan cookie HttpOnly, Secure saat HTTPS, SameSite yang sesuai.
- Lindungi seluruh route `/admin` dan API mutasi pada server; jangan hanya menyembunyikan tombol di frontend.
- Role awal `SUPER_ADMIN` dan `EDITOR`; hanya super admin dapat mengelola akun. Batasi percobaan login dan validasi seluruh input di server dengan Zod.
- Jangan menaruh password, token, atau `DATABASE_URL` dalam kode frontend maupun respons API.

### Model Prisma minimal
Rancang `schema.prisma` dengan model berikut dan relasi yang diperlukan:
- `User`: id, name, email unik, passwordHash, role, createdAt, updatedAt.
- `SiteSetting`: identitas sekolah, kontak, alamat, peta, logo, favicon, sosial media.
- `HomePage`: headline, subheadline, heroImage, CTA, informasi akreditasi, teks tentang.
- `Feature`: icon, title, description, sortOrder, isPublished.
- `Statistic`: label, value, icon, sortOrder, isPublished.
- `Page`: slug unik, title, content, coverImage, SEO title/description, status.
- `Program`: slug unik, title, summary, content, image, sortOrder, status.
- `Activity`: slug unik, title, excerpt, content, coverImage, eventDate, publishedAt, status.
- `GalleryImage`: title, imageUrl, altText, sortOrder, isPublished.
- `Testimonial`: name, relation, quote, photoUrl, sortOrder, isPublished.
- `Faq`: question, answer, sortOrder, isPublished.
- `PpdbSetting`: academicYear, isOpen, description, requirements, schedule, registrationUrl.
- `Media`: fileName, mimeType, size, url, altText, uploadedBy, createdAt.

Gunakan enum untuk role dan status publikasi; tambahkan indeks untuk slug, status, urutan, dan tanggal yang sering difilter. Jika konten halaman membutuhkan format kaya, pilih satu format terstruktur yang aman dan konsisten.

### API dan media
- Endpoint publik hanya mengembalikan konten berstatus terbit.
- Endpoint admin menyediakan CRUD sesuai menu, dilindungi session dan role.
- Gunakan pagination, sorting, filter, dan error response yang konsisten.
- Upload gambar: validasi MIME, ekstensi, ukuran maksimum, nama file acak, dan metadata. Buat adapter penyimpanan agar bisa memakai lokal pada development dan object storage pada production; jangan mengandalkan direktori lokal ephemeral di deployment serverless.
- Sanitasi konten kaya untuk mencegah XSS; gunakan transaksi saat operasi multi-model.
- Revalidasi cache atau tag Next.js setelah admin menerbitkan perubahan sehingga halaman publik segera diperbarui.

### `.env` dan Prisma
- Baca `.env` existing; gunakan `DATABASE_URL` yang sudah ada. Jangan overwrite `.env`, jangan commit rahasia.
- Tambahkan variabel autentikasi dan penyimpanan hanya jika belum ada, dan dokumentasikan namanya di `.env.example` tanpa nilai asli.
- Buat Prisma client singleton yang aman untuk hot reload development.
- Siapkan migration dan seed **idempoten** berisi satu akun admin awal dari environment serta contoh konten sekolah yang jelas ditandai sebagai placeholder. Jangan menyimpan password admin default di repository.
- Jalankan `prisma generate`, migrasi development, dan seed setelah konfigurasi tervalidasi; jangan menjalankan `migrate reset` atau menghapus data yang sudah ada.

## Struktur folder yang disarankan
```text
src/
  app/
    (public)/
      page.tsx
      profil/page.tsx
      program/page.tsx
      kegiatan/page.tsx
      kegiatan/[slug]/page.tsx
      ppdb/page.tsx
      kontak/page.tsx
    admin/
      login/page.tsx
      (dashboard)/
        layout.tsx
        page.tsx
        identitas/page.tsx
        beranda/page.tsx
        profil/page.tsx
        program/page.tsx
        kegiatan/page.tsx
        galeri/page.tsx
        testimoni/page.tsx
        faq/page.tsx
        ppdb/page.tsx
        akun/page.tsx
    api/
      auth/[...nextauth]/route.ts
      public/...
      admin/...
  components/
    public/
    admin/
    ui/
  lib/
    prisma.ts
    auth.ts
    validations/
    storage/
  data/
    mock-site.ts
prisma/
  schema.prisma
  seed.ts
public/
  images/
```
Sesuaikan struktur dengan project yang sudah ada dan jangan membuat duplikasi jika komponen/konfigurasi tersedia.

## Urutan eksekusi wajib
1. Periksa struktur project, dependensi, dan keberadaan `.env` tanpa mengekspos isinya.
2. Bangun halaman publik berdasarkan gambar referensi sampai responsif dan visualnya mendekati acuan.
3. Bangun frontend CMS lengkap dengan data mock; periksa alur tambah, edit, hapus, urutkan, dan preview.
4. Implementasikan Prisma schema, migration, seed, autentikasi, API, dan upload.
5. Ganti data mock dengan query/API yang aman; sambungkan semua form CMS ke database.
6. Uji login, role, validasi, upload, CRUD, draft/publish, revalidasi, halaman mobile, dan build production.
7. Berikan ringkasan file yang dibuat/diubah, cara menjalankan, variabel environment yang diperlukan, dan fitur yang belum selesai.

## Kriteria selesai
Website publik mengikuti referensi secara visual, seluruh konten utama dapat diubah lewat CMS, perubahan terbit tampil pada halaman publik, data tersimpan di PostgreSQL melalui Prisma, admin terlindungi, dan project berhasil menjalankan lint, typecheck, serta build. Prioritaskan frontend sebelum mengerjakan backend; jangan mengklaim integrasi selesai ketika masih memakai mock data.
