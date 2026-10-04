import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [ppdb, rekeningList] = await Promise.all([
      prisma.pengaturanPpdb.findFirst(),
      prisma.rekeningPembayaran.findMany({
        where: { status_aktif: true },
        orderBy: { urutan: "asc" },
      }),
    ]);

    let schedule = [];
    let requirements = [];
    let contacts = [];

    if (ppdb) {
      try {
        if (ppdb.jadwal) schedule = JSON.parse(ppdb.jadwal);
      } catch (_e) {}
      try {
        if (ppdb.persyaratan) requirements = JSON.parse(ppdb.persyaratan);
      } catch (_e) {}
      try {
        if (ppdb.kontak) contacts = JSON.parse(ppdb.kontak);
      } catch (_e) {}
    }

    return NextResponse.json({
      academicYear: ppdb?.tahun_ajaran || "2026/2027",
      isOpen: ppdb?.status_buka ?? true,
      tagline: ppdb?.tagline || "Penerimaan Peserta Didik Baru (PPDB)",
      description: ppdb?.deskripsi || "",
      registrationUrl: ppdb?.url_pendaftaran || "",
      biayaPendaftaran: ppdb?.biaya_pendaftaran ?? 150000,
      instruksiPembayaran:
        ppdb?.instruksi_pembayaran ||
        "Transfer biaya pendaftaran sesuai nominal ke salah satu rekening resmi sekolah atau scan QRIS di bawah ini.",
      qrisImage: ppdb?.qris_image || "/images/qris-alfalah.jpg",
      schedule,
      requirements,
      contacts,
      rekeningList: rekeningList.map((r) => ({
        id: r.id,
        namaBank: r.nama_bank,
        nomorRekening: r.nomor_rekening,
        atasNama: r.atas_nama,
        catatan: r.catatan,
      })),
    });
  } catch (error) {
    console.error("Fetch PPDB info error:", error);
    return NextResponse.json(
      { error: "Gagal memuat informasi PPDB." },
      { status: 500 }
    );
  }
}
