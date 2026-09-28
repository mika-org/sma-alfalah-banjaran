import { PrismaClient, PeranPengguna, StatusKonten } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  // 1. Pengguna Awal (Admin)
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.pengguna.upsert({
    where: { nama_pengguna: "admin" },
    update: {},
    create: {
      nama_pengguna: "admin",
      email: "admin@smaalfalahbanjaran.sch.id",
      nama: "Administrator SMA Al Falah",
      password_hash: passwordHash,
      peran: PeranPengguna.SUPER_ADMIN,
    },
  });

  // 2. Pengaturan Situs
  const existingSettings = await prisma.pengaturanSitus.findFirst();
  if (!existingSettings) {
    await prisma.pengaturanSitus.create({
      data: {
        nama: "SMA Al Falah Banjaran",
        tagline: "Mewujudkan Generasi Berilmu, Berakhlak, dan Siap Menghadapi Masa Depan",
        deskripsi:
          "SMA Al Falah Banjaran adalah sekolah islami unggul, berkarakter dan dekat dengan pembinaan siswa untuk membantu membentuk pribadi terbaik.",
        logo: "/images/logo.png",
        favicon: "/images/logo.png",
        alamat:
          "Jl. Raya Banjaran No. 182, Sindangpanon, Kec. Banjaran, Kabupaten Bandung, Jawa Barat 40377",
        telepon: "(022) 5940123",
        whatsapp: "6281234567890",
        email: "info@smaalfalahbanjaran.sch.id",
        instagram: "@smaalfalahbanjaran",
        youtube: "SMA Al Falah Banjaran",
        tiktok: "@smaalfalahbanjaran",
        url_peta: "https://maps.google.com/?q=SMA+Al+Falah+Banjaran",
        url_embed_peta:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.988297746097!2d107.57863!3d-7.04231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68ebdbb7eb47e5%3A0x6b7724213beff66b!2sYayasan+Al+Falah+Banjaran!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
      },
    });
  }

  // 3. Konten Beranda
  const existingBeranda = await prisma.beranda.findFirst();
  if (!existingBeranda) {
    await prisma.beranda.create({
      data: {
        judul_utama_1: "Mewujudkan Generasi",
        judul_sorotan: "Berilmu, Berakhlak,",
        judul_utama_2: "dan Siap Menghadapi Masa Depan",
        subjudul:
          "SMA Al Falah Banjaran adalah sekolah islami unggul, berkarakter dan dekat dengan pembinaan siswa untuk membantu pribadi terbaik.",
        teks_cta: "Daftar Sekarang",
        tautan_cta: "/ppdb",
        gambar_hero: "/images/hero-students-hd.jpg",
        peringkat_akreditasi: "B",
        lembaga_akreditasi: "BAN-S/M",
        status_ppdb: "PPDB dibuka",
        tahun_ajaran_ppdb: "2026/2027",
        label_tentang: "Tentang Sekolah",
        judul_tentang_1: "Membina Potensi Siswa Menjadi",
        judul_tentang_sorotan: "Generasi Mandiri & Berakhlak",
        deskripsi_tentang:
          "SMA Al Falah Banjaran berkomitmen mendidik generasi penerus bangsa yang tidak hanya unggul dalam ilmu pengetahuan dan teknologi, tetapi juga teguh berpegang pada nilai-nilai keimanan, ketakwaan, serta kepedulian sosial yang nyata.",
        teks_cta_tentang: "Cari Tahu Lebih Lanjut",
        tautan_cta_tentang: "/profil",
        gambar_tentang: "/images/about-school.jpg",
      },
    });
  }

  // 4. Keunggulan (Mengapa Memilih Kami)
  const countKeunggulan = await prisma.keunggulan.count();
  if (countKeunggulan === 0) {
    await prisma.keunggulan.createMany({
      data: [
        {
          judul: "Prestasi Akademik",
          deskripsi:
            "Bimbingan terstruktur dan intensif melahirkan siswa berprestasi di tingkat daerah maupun provinsi.",
          ikon: "trophy",
          urutan: 1,
          status_terbit: true,
        },
        {
          judul: "Pembinaan Akhlak",
          deskripsi:
            "Membiasakan adab islami, sholat berjamaah, dan pendampingan karakter santun serta berakhlak mulia.",
          ikon: "heart",
          urutan: 2,
          status_terbit: true,
        },
        {
          judul: "Lingkungan Asri",
          deskripsi:
            "Kawasan sekolah hijau, aman, nyaman, dan sangat mendukung iklim pembelajaran yang tenang & fokus.",
          ikon: "building",
          urutan: 3,
          status_terbit: true,
        },
        {
          judul: "Kurikulum Terpadu",
          deskripsi:
            "Perpaduan Kurikulum Nasional Merdeka dengan muatan kepesantrenan dan literasi digital modern.",
          ikon: "book",
          urutan: 4,
          status_terbit: true,
        },
      ],
    });
  }

  // 5. Statistik
  const countStat = await prisma.statistik.count();
  if (countStat === 0) {
    await prisma.statistik.createMany({
      data: [
        {
          label: "Rasio guru dan murid",
          nilai: "25:1",
          ikon: "graduation",
          urutan: 1,
          status_terbit: true,
        },
        {
          label: "Ekskul dan kegiatan",
          nilai: "30+",
          ikon: "activity",
          urutan: 2,
          status_terbit: true,
        },
        {
          label: "Kelas dan Laboratorium",
          nilai: "20+",
          ikon: "classroom",
          urutan: 3,
          status_terbit: true,
        },
      ],
    });
  }

  // 6. Galeri Foto
  const countGaleri = await prisma.galeri.count();
  if (countGaleri === 0) {
    await prisma.galeri.createMany({
      data: [
        {
          judul: "Selasar Kelas & Lingkungan Belajar",
          teks_alt: "Selasar dan koridor ruang kelas SMA Al Falah Banjaran",
          url_gambar: "/images/gallery-1.jpg",
          urutan: 1,
          status_terbit: true,
        },
        {
          judul: "Gedung Utama Terakreditasi",
          teks_alt: "Fasad gedung pembelajaran utama SMA Al Falah Banjaran",
          url_gambar: "/images/gallery-2.jpg",
          urutan: 2,
          status_terbit: true,
        },
        {
          judul: "Kegiatan Peduli Lingkungan & Penghijauan",
          teks_alt:
            "Siswi SMA Al Falah Banjaran bersama guru dalam kegiatan peduli lingkungan",
          url_gambar: "/images/gallery-3.jpg",
          urutan: 3,
          status_terbit: true,
        },
        {
          judul: "Apresiasi & Prestasi Siswa",
          teks_alt:
            "Penyerahan plakat dan apresiasi prestasi siswa SMA Al Falah Banjaran",
          url_gambar: "/images/gallery-4.jpg",
          urutan: 4,
          status_terbit: true,
        },
      ],
    });
  }

  // 7. Testimoni
  const countTestimoni = await prisma.testimoni.count();
  if (countTestimoni === 0) {
    await prisma.testimoni.createMany({
      data: [
        {
          nama: "Bunda Mila",
          hubungan: "Orang Tua Siswa Kelas XII",
          kutipan:
            "Alhamdulillah putra kami berkembang sangat baik sejak bersekolah di SMA Al Falah Banjaran. Guru-gurunya tulus, sabar, dan sangat komunikatif membimbing siswa.",
          url_foto: "/images/avatar-1.jpg",
          urutan: 1,
          status_terbit: true,
        },
        {
          nama: "Ayah Rizki",
          hubungan: "Orang Tua Siswa Kelas XI",
          kutipan:
            "Keseimbangan ilmu umum dan pendalaman agama sangat kami rasakan. Anak menjadi rajin ibadah mandiri, disiplin belajar, dan memiliki lingkungan pergaulan yang sehat.",
          url_foto: "/images/avatar-2.jpg",
          urutan: 2,
          status_terbit: true,
        },
        {
          nama: "Papah Adit",
          hubungan: "Orang Tua Alumni 2025",
          kutipan:
            "SMA Al Falah Banjaran adalah pilihan terbaik di Banjaran. Pembekalan akademik dan program ekstrakurikulernya membuat anak saya percaya diri melanjutkan ke perguruan tinggi.",
          url_foto: "/images/avatar-3.jpg",
          urutan: 3,
          status_terbit: true,
        },
      ],
    });
  }

  // 8. FAQ
  const countFaq = await prisma.faq.count();
  if (countFaq === 0) {
    await prisma.faq.createMany({
      data: [
        {
          pertanyaan: "Berapa usia anak yang dapat mendaftar?",
          jawaban:
            "Calon peserta didik yang mendaftar di SMA Al Falah Banjaran maksimal berusia 21 tahun pada awal tahun ajaran baru dan telah lulus dari jenjang SMP/MTs sederajat.",
          urutan: 1,
          status_terbit: true,
        },
        {
          pertanyaan: "Bagaimana proses pendaftarannya?",
          jawaban:
            "Pendaftaran dapat dilakukan secara online melalui halaman PPDB di website ini atau datang langsung ke ruang sekretariat PPDB SMA Al Falah Banjaran pada jam kerja (08.00 - 14.00 WIB).",
          urutan: 2,
          status_terbit: true,
        },
        {
          pertanyaan: "Apa saja syarat pendaftarannya?",
          jawaban:
            "Persyaratan umum meliputi: Fotokopi Ijazah/Surat Keterangan Lulus, Akta Kelahiran, Kartu Keluarga, Pas Foto terbaru 3x4 (3 lembar), serta fotokopi Rapor SMP/MTs semester 1-5.",
          urutan: 3,
          status_terbit: true,
        },
        {
          pertanyaan: "Berapa biaya pendidikan di SMA Al Falah?",
          jawaban:
            "Biaya pendidikan di SMA Al Falah Banjaran sangat terjangkau dengan skema pembiayaan transparan. Tersedia juga program keringanan dan beasiswa prestasi bagi siswa berprestasi serta tahfidz Al-Qur'an.",
          urutan: 4,
          status_terbit: true,
        },
        {
          pertanyaan: "Kapan Tahun ajaran dimulai?",
          jawaban:
            "Tahun ajaran baru biasanya dimulai pada pertengahan bulan Juli, diawali dengan kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) yang edukatif dan ramah anak.",
          urutan: 5,
          status_terbit: true,
        },
      ],
    });
  }

  // 9. Program
  const countProgram = await prisma.program.count();
  if (countProgram === 0) {
    await prisma.program.createMany({
      data: [
        {
          slug: "tahfidz-dan-studi-islam",
          judul: "Program Tahfidz & Studi Islam Intensif",
          ringkasan:
            "Bimbingan tahsin dan tahfidz Al-Qur'an dengan target hafalan bertahap, kajian kitab adab, dan pembiasaan ibadah harian.",
          konten:
            "Program ini didesain untuk mencetak generasi yang qur'ani, hafal Al-Qur'an minimal juz 30 hingga beberapa juz pilihan, didampingi oleh asatidz pembina tahfidz berpengalaman. Program mencakup setoran harian (ziyadah), muroja'ah berkala, dan wisuda tahfidz.",
          gambar: "/images/activity-tahfidz.jpg",
          ikon: "book",
          urutan: 1,
          status: StatusKonten.PUBLISHED,
        },
        {
          slug: "sains-dan-teknologi-modern",
          judul: "Penguatan Sains & Literasi Digital",
          ringkasan:
            "Praktikum sains terpadu, pemanfaatan laboratorium komputer, dan pembelajaran berbasis teknologi untuk menghadapi era modern.",
          konten:
            "Fokus pada penguasaan metode ilmiah, praktikum di laboratorium IPA, pemrograman dasar, literasi data, serta pemecahan masalah kritis melalui riset mini siswa.",
          gambar: "/images/activity-lab.jpg",
          ikon: "atom",
          urutan: 2,
          status: StatusKonten.PUBLISHED,
        },
        {
          slug: "bahasa-dan-public-speaking",
          judul: "Pengembangan Bahasa & Kepemimpinan",
          ringkasan:
            "Pelatihan bahasa Arab dan Inggris praktis, pidato (muhadhoroh), serta kepemimpinan OSIS dan kepramukaan.",
          konten:
            "Membentuk santri dan siswa yang percaya diri berbicara di depan umum, mampu berkomunikasi dalam bahasa asing secara aktif, dan memiliki jiwa kepemimpinan amanah.",
          gambar: "/images/gallery-4.jpg",
          ikon: "mic",
          urutan: 3,
          status: StatusKonten.PUBLISHED,
        },
        {
          slug: "ekstrakurikuler-minat-bakat",
          judul: "Ekstrakurikuler & Penyaluran Bakat",
          ringkasan:
            "Pramuka, Paskibra, PMR, Futsal, Basket, Seni Marawis/Hadroh, Kaligrafi, hingga Pecinta Alam.",
          konten:
            "Menyediakan lebih dari 15 cabang kegiatan ekstrakurikuler guna menyalurkan minat, bakat, kesehatan fisik, dan sportivitas setiap peserta didik.",
          gambar: "/images/gallery-3.jpg",
          ikon: "trophy",
          urutan: 4,
          status: StatusKonten.PUBLISHED,
        },
      ],
    });
  }

  // 10. Kegiatan
  const countKegiatan = await prisma.kegiatan.count();
  if (countKegiatan === 0) {
    await prisma.kegiatan.createMany({
      data: [
        {
          slug: "peringatan-maulid-dan-lomba-kaligrafi",
          judul:
            "Peringatan Maulid Nabi Muhammad SAW & Lomba Kaligrafi Antar Kelas",
          ringkasan:
            "Siswa SMA Al Falah Banjaran antusias memperingati maulid nabi dengan tausiyah keagamaan dan pentas kreasi kaligrafi islam.",
          konten:
            "Peringatan Maulid Nabi di SMA Al Falah Banjaran berlangsung khidmat dan meriah. Acara diisi oleh pembacaan shalawat bersama, tausiyah keagamaan oleh guru pembimbing, serta kompetisi kaligrafi dan tilawah Al-Qur'an antar kelas.",
          gambar_sampul: "/images/activity-tahfidz.jpg",
          kategori: "Keagamaan",
          tanggal_kegiatan: new Date("2026-09-15"),
          diterbitkan_pada: new Date("2026-09-15"),
          status: StatusKonten.PUBLISHED,
        },
        {
          slug: "praktikum-laboratorium-sains-terpadu",
          judul:
            "Praktikum Sains Terpadu: Uji Senyawa Kimia & Biologi Lingkungan",
          ringkasan:
            "Siswa kelas XI IPA melaksanakan praktikum mandiri di laboratorium kimia dan biologi untuk memverifikasi materi asam-basa.",
          konten:
            "Praktikum rutin dilaksanakan untuk menunjang pemahaman konseptual siswa. Dengan bimbingan guru dan fasilitas laboratorium lengkap, para siswa melakukan pengujian pH air tanah sekitar Banjaran dan identifikasi mikroorganisme.",
          gambar_sampul: "/images/activity-lab.jpg",
          kategori: "Akademik",
          tanggal_kegiatan: new Date("2026-09-08"),
          diterbitkan_pada: new Date("2026-09-08"),
          status: StatusKonten.PUBLISHED,
        },
        {
          slug: "gerakan-penghijauan-kampus-hijau",
          judul:
            "Aksi Nyata Gerakan Sekolah Hijau: Penanaman 100 Bibit Pohon",
          ringkasan:
            "OSIS SMA Al Falah Banjaran bersama komunitas pecinta alam menginisiasi penanaman bibit pohon buah di area sekolah.",
          konten:
            "Sebagai bentuk kepedulian terhadap kelestarian lingkungan dan kenyamanan iklim sekolah, seluruh civitas akademika bergotong royong menanam aneka pohon peneduh di pekarangan sekolah.",
          gambar_sampul: "/images/gallery-3.jpg",
          kategori: "Sosial & Lingkungan",
          tanggal_kegiatan: new Date("2026-08-25"),
          diterbitkan_pada: new Date("2026-08-25"),
          status: StatusKonten.PUBLISHED,
        },
        {
          slug: "penyerahan-penghargaan-juara-lomba-daerah",
          judul:
            "Siswa SMA Al Falah Banjaran Raih Juara 2 Pidato Bahasa Arab Kabupaten",
          ringkasan:
            "Apresiasi membanggakan ditorehkan oleh siswa dalam kompetisi bahasa Arab tingkat Kabupaten Bandung.",
          konten:
            "Kepala SMA Al Falah Banjaran secara resmi menyerahkan piagam dan piala penghargaan kepada ananda peraih prestasi dalam upacara bendera hari Senin.",
          gambar_sampul: "/images/gallery-4.jpg",
          kategori: "Prestasi",
          tanggal_kegiatan: new Date("2026-08-18"),
          diterbitkan_pada: new Date("2026-08-18"),
          status: StatusKonten.PUBLISHED,
        },
      ],
    });
  }

  // 11. Pengaturan PPDB
  const existingPpdb = await prisma.pengaturanPpdb.findFirst();
  if (!existingPpdb) {
    await prisma.pengaturanPpdb.create({
      data: {
        tahun_ajaran: "2026/2027",
        status_buka: true,
        tagline: "Penerimaan Peserta Didik Baru (PPDB) SMA Al Falah Banjaran",
        deskripsi:
          "Selamat datang di pendaftaran siswa baru SMA Al Falah Banjaran. Mari bertumbuh bersama mewujudkan generasi islami yang cerdas, berkarakter, dan siap memimpin masa depan.",
        url_pendaftaran:
          "https://wa.me/6281234567890?text=Halo%20Admin%20PPDB%20SMA%20Al%20Falah%20Banjaran,%20saya%20ingin%20mendaftar",
        jadwal: JSON.stringify([
          {
            phase: "Gelombang 1 (Jalur Prestasi & Afirmasi)",
            dates: "1 Januari - 31 Maret 2026",
            desc: "Diskon infaq gedung 30% dan bebas tes tulis bagi peraih peringkat 1-3 serta tahfidz minimal 2 Juz.",
          },
          {
            phase: "Gelombang 2 (Jalur Reguler)",
            dates: "1 April - 30 Juni 2026",
            desc: "Pendaftaran reguler dengan tes pemetaan minat bakat dan wawancara orang tua.",
          },
          {
            phase: "Masa Pengenalan Lingkungan Sekolah (MPLS)",
            dates: "13 - 17 Juli 2026",
            desc: "Pengenalan budaya sekolah islami, sarana prasarana, guru pembimbing, dan teman belajar baru.",
          },
        ]),
        persyaratan: JSON.stringify([
          "Mengisi formulir pendaftaran PPDB (online/offline)",
          "Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir 2 lembar",
          "Fotokopi Kartu Keluarga (KK) dan KTP Orang Tua / Wali 2 lembar",
          "Fotokopi Akta Kelahiran siswa 2 lembar",
          "Fotokopi Rapor SMP/MTs semester 1 s.d. 5",
          "Pas foto berseragam ukuran 3x4 berwarna (4 lembar)",
        ]),
        kontak: JSON.stringify([
          { name: "Ust. Ahmad S.Pd (Ketua PPDB)", wa: "6281234567890" },
          { name: "Ibu Rahma M.Pd (Sekretariat)", wa: "6281987654321" },
        ]),
      },
    });
  }

  // 12. Halaman Profil
  const existingProfil = await prisma.halaman.findUnique({ where: { slug: "profil" } });
  if (!existingProfil) {
    await prisma.halaman.create({
      data: {
        slug: "profil",
        judul: "Profil & Visi Misi",
        konten: JSON.stringify({
          visi: "Terwujudnya Peserta Didik yang Beriman dan Bertaqwa, Berakhlak Mulia, Unggul dalam Prestasi Akademik dan Non-Akademik, serta Berwawasan Lingkungan dan Global.",
          misi: [
            "Menyelenggarakan pembelajaran kurikulum nasional yang diperkaya nilai kepesantrenan dan pembiasaan ibadah.",
            "Membina hafalan dan pemahaman Al-Qur'an melalui program Tahfidz reguler dan intensif.",
            "Mengembangkan potensi minat, bakat, kepemimpinan, dan kewirausahaan siswa melalui ekstrakurikuler aktif.",
            "Menciptakan lingkungan sekolah yang hijau, bersih, religius, aman, dan berdaya saing.",
          ],
          principalName: "Drs. H. Mulyana, M.M.Pd",
          principalRole: "Kepala Sekolah SMA Al Falah Banjaran",
          greeting:
            "Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSegala puji bagi Allah SWT yang senantiasa melimpahkan taufiq dan hidayah-Nya. SMA Al Falah Banjaran hadir di tengah masyarakat sebagai wadah pendidikan menengah atas yang berikhtiar memadukan kecerdasan intelektual, kematangan emosional, dan keluhuran spiritual.",
        }),
      },
    });
  }

}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
