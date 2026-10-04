import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const list = await prisma.rekeningPembayaran.findMany({
      orderBy: { urutan: "asc" },
    });
    return NextResponse.json({ rekening: list });
  } catch (error) {
    console.error("Fetch rekening error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar rekening" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { namaBank, nomorRekening, atasNama, catatan, statusAktif = true, urutan = 0 } = body;

    if (!namaBank || !nomorRekening || !atasNama) {
      return NextResponse.json(
        { error: "Nama bank, nomor rekening, dan atas nama wajib diisi." },
        { status: 400 }
      );
    }

    const created = await prisma.rekeningPembayaran.create({
      data: {
        nama_bank: namaBank.trim(),
        nomor_rekening: nomorRekening.trim(),
        atas_nama: atasNama.trim(),
        catatan: catatan?.trim() || null,
        status_aktif: Boolean(statusAktif),
        urutan: Number(urutan) || 0,
      },
    });

    return NextResponse.json({ success: true, rekening: created });
  } catch (error) {
    console.error("Create rekening error:", error);
    return NextResponse.json({ error: "Gagal menambahkan nomor rekening" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, namaBank, nomorRekening, atasNama, catatan, statusAktif, urutan } = body;

    if (!id) {
      return NextResponse.json({ error: "ID rekening wajib disertakan." }, { status: 400 });
    }

    const updated = await prisma.rekeningPembayaran.update({
      where: { id },
      data: {
        ...(namaBank !== undefined && { nama_bank: namaBank.trim() }),
        ...(nomorRekening !== undefined && { nomor_rekening: nomorRekening.trim() }),
        ...(atasNama !== undefined && { atas_nama: atasNama.trim() }),
        ...(catatan !== undefined && { catatan: catatan ? catatan.trim() : null }),
        ...(statusAktif !== undefined && { status_aktif: Boolean(statusAktif) }),
        ...(urutan !== undefined && { urutan: Number(urutan) }),
      },
    });

    return NextResponse.json({ success: true, rekening: updated });
  } catch (error) {
    console.error("Update rekening error:", error);
    return NextResponse.json({ error: "Gagal memperbarui nomor rekening" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID rekening wajib disertakan." }, { status: 400 });
    }

    await prisma.rekeningPembayaran.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Rekening berhasil dihapus." });
  } catch (error) {
    console.error("Delete rekening error:", error);
    return NextResponse.json({ error: "Gagal menghapus nomor rekening" }, { status: 500 });
  }
}
