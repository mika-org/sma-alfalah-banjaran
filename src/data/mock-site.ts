export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
}

export interface HeroData {
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  heroImage: string;
  accreditationGrade: string;
  accreditationBody: string;
  ppdbStatus: string;
  ppdbAcademicYear: string;
  ppdbActive: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: "trophy" | "heart" | "building" | "book" | "star" | "award";
  sortOrder: number;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: "graduation" | "activity" | "classroom";
  sortOrder: number;
}

export interface AboutData {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  stats: StatItem[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  altText: string;
  imageUrl: string;
  sortOrder: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  relation: string;
  quote: string;
  photoUrl: string;
  sortOrder: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface ActivityItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  eventDate: string;
  status: "PUBLISHED" | "DRAFT";
}

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  icon: string;
  sortOrder: number;
}

export interface PpdbData {
  academicYear: string;
  isOpen: boolean;
  tagline: string;
  description: string;
  registrationUrl: string;
  schedule: Array<{
    phase: string;
    dates: string;
    desc: string;
  }>;
  requirements: string[];
  contacts: {
    name: string;
    wa: string;
  }[];
}

export const initialSiteSettings: SiteSettings = {
  name: "SMA Al Falah Banjaran",
  tagline: "Mewujudkan Generasi Berilmu, Berakhlak, dan Siap Menghadapi Masa Depan",
  description: "SMA Al Falah Banjaran adalah sekolah islami unggul, berkarakter dan dekat dengan pembinaan siswa untuk membantu membentuk pribadi terbaik.",
  logo: "/images/logo.png",
  address: "Jl. Raya Banjaran No. 182, Sindangpanon, Kec. Banjaran, Kabupaten Bandung, Jawa Barat 40377",
  phone: "(022) 5940123",
  whatsapp: "6281234567890",
  email: "info@smaalfalahbanjaran.sch.id",
  instagram: "@smaalfalahbanjaran",
  youtube: "SMA Al Falah Banjaran",
  tiktok: "@smaalfalahbanjaran",
  mapsUrl: "https://maps.google.com/?q=SMA+Al+Falah+Banjaran",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.988297746097!2d107.57863!3d-7.04231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68ebdbb7eb47e5%3A0x6b7724213beff66b!2sYayasan+Al+Falah+Banjaran!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
};

export const initialHeroData: HeroData = {
  titlePart1: "Mewujudkan Generasi",
  titleHighlight: "Berilmu, Berakhlak,",
  titlePart2: "dan Siap Menghadapi Masa Depan",
  subtitle: "SMA Al Falah Banjaran adalah sekolah islami unggul, berkarakter dan dekat dengan pembinaan siswa untuk membantu pribadi terbaik.",
  ctaText: "Daftar Sekarang",
  ctaLink: "/ppdb",
  heroImage: "/images/hero-students-hd.jpg",
  accreditationGrade: "B",
  accreditationBody: "BAN-S/M",
  ppdbStatus: "PPDB dibuka",
  ppdbAcademicYear: "2026/2027",
  ppdbActive: true
};

export const initialFeatures: FeatureItem[] = [
  {
    id: "f1",
    title: "Prestasi Akademik",
    description: "Bimbingan terstruktur dan intensif melahirkan siswa berprestasi di tingkat daerah maupun provinsi.",
    icon: "trophy",
    sortOrder: 1
  },
  {
    id: "f2",
    title: "Pembinaan Akhlak",
    description: "Membiasakan adab islami, sholat berjamaah, dan pendampingan karakter santun serta berakhlak mulia.",
    icon: "heart",
    sortOrder: 2
  },
  {
    id: "f3",
    title: "Lingkungan Asri",
    description: "Kawasan sekolah hijau, aman, nyaman, dan sangat mendukung iklim pembelajaran yang tenang & fokus.",
    icon: "building",
    sortOrder: 3
  },
  {
    id: "f4",
    title: "Kurikulum Terpadu",
    description: "Perpaduan Kurikulum Nasional Merdeka dengan muatan kepesantrenan dan literasi digital modern.",
    icon: "book",
    sortOrder: 4
  }
];

export const initialAboutData: AboutData = {
  badge: "Tentang Sekolah",
  titlePart1: "Membina Potensi Siswa Menjadi",
  titleHighlight: "Generasi Mandiri & Berakhlak",
  description: "SMA Al Falah Banjaran berkomitmen mendidik generasi penerus bangsa yang tidak hanya unggul dalam ilmu pengetahuan dan teknologi, tetapi juga teguh berpegang pada nilai-nilai keimanan, ketakwaan, serta kepedulian sosial yang nyata.",
  ctaText: "Cari Tahu Lebih Lanjut",
  ctaLink: "/profil",
  image: "/images/about-school.jpg",
  stats: [
    {
      id: "s1",
      value: "25:1",
      label: "Rasio guru dan murid",
      icon: "graduation",
      sortOrder: 1
    },
    {
      id: "s2",
      value: "30+",
      label: "Ekskul dan kegiatan",
      icon: "activity",
      sortOrder: 2
    },
    {
      id: "s3",
      value: "20+",
      label: "Kelas dan Laboratorium",
      icon: "classroom",
      sortOrder: 3
    }
  ]
};

export const initialGallery: GalleryPhoto[] = [
  {
    id: "g1",
    title: "Selasar Kelas & Lingkungan Belajar",
    altText: "Selasar dan koridor ruang kelas SMA Al Falah Banjaran",
    imageUrl: "/images/gallery-1.jpg",
    sortOrder: 1
  },
  {
    id: "g2",
    title: "Gedung Utama Terakreditasi",
    altText: "Fasad gedung pembelajaran utama SMA Al Falah Banjaran",
    imageUrl: "/images/gallery-2.jpg",
    sortOrder: 2
  },
  {
    id: "g3",
    title: "Kegiatan Peduli Lingkungan & Penghijauan",
    altText: "Siswi SMA Al Falah Banjaran bersama guru dalam kegiatan peduli lingkungan",
    imageUrl: "/images/gallery-3.jpg",
    sortOrder: 3
  },
  {
    id: "g4",
    title: "Apresiasi & Prestasi Siswa",
    altText: "Penyerahan plakat dan apresiasi prestasi siswa SMA Al Falah Banjaran",
    imageUrl: "/images/gallery-4.jpg",
    sortOrder: 4
  }
];

export const initialTestimonials: TestimonialItem[] = [
  {
    id: "t1",
    name: "Bunda Mila",
    relation: "Orang Tua Siswa Kelas XII",
    quote: "Alhamdulillah putra kami berkembang sangat baik sejak bersekolah di SMA Al Falah Banjaran. Guru-gurunya tulus, sabar, dan sangat komunikatif membimbing siswa.",
    photoUrl: "/images/avatar-1.jpg",
    sortOrder: 1
  },
  {
    id: "t2",
    name: "Ayah Rizki",
    relation: "Orang Tua Siswa Kelas XI",
    quote: "Keseimbangan ilmu umum dan pendalaman agama sangat kami rasakan. Anak menjadi rajin ibadah mandiri, disiplin belajar, dan memiliki lingkungan pergaulan yang sehat.",
    photoUrl: "/images/avatar-2.jpg",
    sortOrder: 2
  },
  {
    id: "t3",
    name: "Papah Adit",
    relation: "Orang Tua Alumni 2025",
    quote: "SMA Al Falah Banjaran adalah pilihan terbaik di Banjaran. Pembekalan akademik dan program ekstrakurikulernya membuat anak saya percaya diri melanjutkan ke perguruan tinggi.",
    photoUrl: "/images/avatar-3.jpg",
    sortOrder: 3
  }
];

export const initialFaqs: FaqItem[] = [
  {
    id: "faq1",
    question: "Berapa usia anak yang dapat mendaftar?",
    answer: "Calon peserta didik yang mendaftar di SMA Al Falah Banjaran maksimal berusia 21 tahun pada awal tahun ajaran baru dan telah lulus dari jenjang SMP/MTs sederajat.",
    sortOrder: 1
  },
  {
    id: "faq2",
    question: "Bagaimana proses pendaftarannya?",
    answer: "Pendaftaran dapat dilakukan secara online melalui halaman PPDB di website ini atau datang langsung ke ruang sekretariat PPDB SMA Al Falah Banjaran pada jam kerja (08.00 - 14.00 WIB).",
    sortOrder: 2
  },
  {
    id: "faq3",
    question: "Apa saja syarat pendaftarannya?",
    answer: "Persyaratan umum meliputi: Fotokopi Ijazah/Surat Keterangan Lulus, Akta Kelahiran, Kartu Keluarga, Pas Foto terbaru 3x4 (3 lembar), serta fotokopi Rapor SMP/MTs semester 1-5.",
    sortOrder: 3
  },
  {
    id: "faq4",
    question: "Berapa biaya pendidikan di SMA Al Falah?",
    answer: "Biaya pendidikan di SMA Al Falah Banjaran sangat terjangkau dengan skema pembiayaan transparan. Tersedia juga program keringanan dan beasiswa prestasi bagi siswa berprestasi serta tahfidz Al-Qur'an.",
    sortOrder: 4
  },
  {
    id: "faq5",
    question: "Kapan Tahun ajaran dimulai?",
    answer: "Tahun ajaran baru biasanya dimulai pada pertengahan bulan Juli, diawali dengan kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) yang edukatif dan ramah anak.",
    sortOrder: 5
  }
];

export const initialPrograms: ProgramItem[] = [
  {
    id: "p1",
    slug: "tahfidz-dan-studi-islam",
    title: "Program Tahfidz & Studi Islam Intensif",
    summary: "Bimbingan tahsin dan tahfidz Al-Qur'an dengan target hafalan bertahap, kajian kitab adab, dan pembiasaan ibadah harian.",
    content: "Program ini didesain untuk mencetak generasi yang qur'ani, hafal Al-Qur'an minimal juz 30 hingga beberapa juz pilihan, didampingi oleh asatidz pembina tahfidz berpengalaman. Program mencakup setoran harian (ziyadah), muroja'ah berkala, dan wisuda tahfidz.",
    image: "/images/activity-tahfidz.jpg",
    icon: "book",
    sortOrder: 1
  },
  {
    id: "p2",
    slug: "sains-dan-teknologi-modern",
    title: "Penguatan Sains & Literasi Digital",
    summary: "Praktikum sains terpadu, pemanfaatan laboratorium komputer, dan pembelajaran berbasis teknologi untuk menghadapi era modern.",
    content: "Fokus pada penguasaan metode ilmiah, praktikum di laboratorium IPA, pemrograman dasar, literasi data, serta pemecahan masalah kritis melalui riset mini siswa.",
    image: "/images/activity-lab.jpg",
    icon: "atom",
    sortOrder: 2
  },
  {
    id: "p3",
    slug: "bahasa-dan-public-speaking",
    title: "Pengembangan Bahasa & Kepemimpinan",
    summary: "Pelatihan bahasa Arab dan Inggris praktis, pidato (muhadhoroh), serta kepemimpinan OSIS dan kepramukaan.",
    content: "Membentuk santri dan siswa yang percaya diri berbicara di depan umum, mampu berkomunikasi dalam bahasa asing secara aktif, dan memiliki jiwa kepemimpinan amanah.",
    image: "/images/gallery-4.jpg",
    icon: "mic",
    sortOrder: 3
  },
  {
    id: "p4",
    slug: "ekstrakurikuler-minat-bakat",
    title: "Ekstrakurikuler & Penyaluran Bakat",
    summary: "Pramuka, Paskibra, PMR, Futsal, Basket, Seni Marawis/Hadroh, Kaligrafi, hingga Pecinta Alam.",
    content: "Menyediakan lebih dari 15 cabang kegiatan ekstrakurikuler guna menyalurkan minat, bakat, kesehatan fisik, dan sportivitas setiap peserta didik.",
    image: "/images/gallery-3.jpg",
    icon: "trophy",
    sortOrder: 4
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: "a1",
    slug: "peringatan-maulid-dan-lomba-kaligrafi",
    title: "Peringatan Maulid Nabi Muhammad SAW & Lomba Kaligrafi Antar Kelas",
    excerpt: "Siswa SMA Al Falah Banjaran antusias memperingati maulid nabi dengan tausiyah keagamaan dan pentas kreasi kaligrafi islam.",
    content: "Peringatan Maulid Nabi di SMA Al Falah Banjaran berlangsung khidmat dan meriah. Acara diisi oleh pembacaan shalawat bersama, tausiyah keagamaan oleh guru pembimbing, serta kompetisi kaligrafi dan tilawah Al-Qur'an antar kelas.",
    coverImage: "/images/activity-tahfidz.jpg",
    category: "Keagamaan",
    eventDate: "2026-09-15",
    status: "PUBLISHED"
  },
  {
    id: "a2",
    slug: "praktikum-laboratorium-sains-terpadu",
    title: "Praktikum Sains Terpadu: Uji Senyawa Kimia & Biologi Lingkungan",
    excerpt: "Siswa kelas XI IPA melaksanakan praktikum mandiri di laboratorium kimia dan biologi untuk memverifikasi materi asam-basa.",
    content: "Praktikum rutin dilaksanakan untuk menunjang pemahaman konseptual siswa. Dengan bimbingan guru dan fasilitas laboratorium lengkap, para siswa melakukan pengujian pH air tanah sekitar Banjaran dan identifikasi mikroorganisme.",
    coverImage: "/images/activity-lab.jpg",
    category: "Akademik",
    eventDate: "2026-09-08",
    status: "PUBLISHED"
  },
  {
    id: "a3",
    slug: "gerakan-penghijauan-kampus-hijau",
    title: "Aksi Nyata Gerakan Sekolah Hijau: Penanaman 100 Bibit Pohon",
    excerpt: "OSIS SMA Al Falah Banjaran bersama komunitas pecinta alam menginisiasi penanaman bibit pohon buah di area sekolah.",
    content: "Sebagai bentuk kepedulian terhadap kelestarian lingkungan dan kenyamanan iklim sekolah, seluruh civitas akademika bergotong royong menanam aneka pohon peneduh di pekarangan sekolah.",
    coverImage: "/images/gallery-3.jpg",
    category: "Sosial & Lingkungan",
    eventDate: "2026-08-25",
    status: "PUBLISHED"
  },
  {
    id: "a4",
    slug: "penyerahan-penghargaan-juara-lomba-daerah",
    title: "Siswa SMA Al Falah Banjaran Raih Juara 2 Pidato Bahasa Arab Kabupaten",
    excerpt: "Apresiasi membanggakan ditorehkan oleh siswa dalam kompetisi bahasa Arab tingkat Kabupaten Bandung.",
    content: "Kepala SMA Al Falah Banjaran secara resmi menyerahkan piagam dan piala penghargaan kepada ananda peraih prestasi dalam upacara bendera hari Senin.",
    coverImage: "/images/gallery-4.jpg",
    category: "Prestasi",
    eventDate: "2026-08-18",
    status: "PUBLISHED"
  }
];

export const initialPpdb: PpdbData = {
  academicYear: "2026/2027",
  isOpen: true,
  tagline: "Penerimaan Peserta Didik Baru (PPDB) SMA Al Falah Banjaran",
  description: "Selamat datang di pendaftaran siswa baru SMA Al Falah Banjaran. Mari bertumbuh bersama mewujudkan generasi islami yang cerdas, berkarakter, dan siap memimpin masa depan.",
  registrationUrl: "https://wa.me/6281234567890?text=Halo%20Admin%20PPDB%20SMA%20Al%20Falah%20Banjaran,%20saya%20ingin%20mendaftar",
  schedule: [
    {
      phase: "Gelombang 1 (Jalur Prestasi & Afirmasi)",
      dates: "1 Januari - 31 Maret 2026",
      desc: "Diskon infaq gedung 30% dan bebas tes tulis bagi peraih peringkat 1-3 serta tahfidz minimal 2 Juz."
    },
    {
      phase: "Gelombang 2 (Jalur Reguler)",
      dates: "1 April - 30 Juni 2026",
      desc: "Pendaftaran reguler dengan tes pemetaan minat bakat dan wawancara orang tua."
    },
    {
      phase: "Masa Pengenalan Lingkungan Sekolah (MPLS)",
      dates: "13 - 17 Juli 2026",
      desc: "Pengenalan budaya sekolah islami, sarana prasarana, guru pembimbing, dan teman belajar baru."
    }
  ],
  requirements: [
    "Mengisi formulir pendaftaran PPDB (online/offline)",
    "Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir 2 lembar",
    "Fotokopi Kartu Keluarga (KK) dan KTP Orang Tua / Wali 2 lembar",
    "Fotokopi Akta Kelahiran siswa 2 lembar",
    "Fotokopi Rapor SMP/MTs semester 1 s.d. 5",
    "Pas foto berseragam ukuran 3x4 berwarna (4 lembar)"
  ],
  contacts: [
    { name: "Ust. Ahmad S.Pd (Ketua PPDB)", wa: "6281234567890" },
    { name: "Ibu Rahma M.Pd (Sekretariat)", wa: "6281987654321" }
  ]
};
