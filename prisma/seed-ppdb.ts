import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Update Pengaturan PPDB with default payment info if not set
  const ppdb = await prisma.pengaturanPpdb.findFirst();
  if (ppdb) {
    await prisma.pengaturanPpdb.update({
      where: { id: ppdb.id },
      data: {
        biaya_pendaftaran: ppdb.biaya_pendaftaran || 150000,
        instruksi_pembayaran:
          ppdb.instruksi_pembayaran ||
          "Transfer biaya pendaftaran sesuai nominal ke salah satu rekening resmi atau pindai QRIS di bawah ini. Simpan bukti transfer dan unggah pada formulir pendaftaran PPDB.",
        qris_image: ppdb.qris_image || "/images/qris-alfalah.jpg",
      },
    });
  }

  // Rekening Bank
  const countRekening = await prisma.rekeningPembayaran.count();
  if (countRekening === 0) {
    await prisma.rekeningPembayaran.createMany({
      data: [
        {
          nama_bank: "Bank Syariah Indonesia (BSI)",
          nomor_rekening: "7123456789",
          atas_nama: "SMA AL FALAH BANJARAN",
          urutan: 1,
          status_aktif: true,
          catatan: "Kode Bank: 451 (Untuk transfer antar bank)",
        },
        {
          nama_bank: "Bank Mandiri",
          nomor_rekening: "1300098765432",
          atas_nama: "YAYASAN AL FALAH BANJARAN",
          urutan: 2,
          status_aktif: true,
          catatan: "Kode Bank: 008 (Rekening Utama Yayasan)",
        },
        {
          nama_bank: "Bank BCA",
          nomor_rekening: "8475123980",
          atas_nama: "SMA AL FALAH BANJARAN",
          urutan: 3,
          status_aktif: true,
          catatan: "Kode Bank: 014",
        },
      ],
    });
    console.log("Rekening pembayaran seeded successfully.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
