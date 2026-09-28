import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMA Al Falah Banjaran | Sekolah Islami Unggul & Berkarakter",
  description:
    "Website Resmi SMA Al Falah Banjaran. Mewujudkan generasi berilmu, berakhlak mulia, dan siap menghadapi masa depan di Banjaran, Kabupaten Bandung.",
  keywords: [
    "SMA Al Falah Banjaran",
    "SMA Islam Banjaran",
    "PPDB SMA Al Falah Banjaran",
    "Sekolah Islami Bandung",
    "SMA Al Falah",
  ],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "SMA Al Falah Banjaran | Sekolah Islami Unggul & Berkarakter",
    description:
      "Mewujudkan generasi berilmu, berakhlak, dan siap menghadapi masa depan.",
    images: ["/images/hero-students-hd.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
