import { NextResponse } from "next/server";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const siswa = await prisma.siswa.findUnique({
      where: { id },
      include: {
        akun_orang_tua: true,
        calon_siswa: true,
      },
    });

    if (!siswa) {
      return NextResponse.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ siswa });
  } catch (error) {
    console.error("Fetch siswa detail error:", error);
    return NextResponse.json({ error: "Gagal memuat detail siswa" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      namaLengkap,
      kelas,
      status,
      resetPasswordOrtu,
      namaOrtu,
      noWhatsappOrtu,
      emailOrtu,
    } = body;

    const existingSiswa = await prisma.siswa.findUnique({
      where: { id },
      include: { akun_orang_tua: true },
    });

    if (!existingSiswa) {
      return NextResponse.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
    }

    // Update Siswa
    const updatedSiswa = await prisma.siswa.update({
      where: { id },
      data: {
        ...(namaLengkap && { nama_lengkap: namaLengkap.trim() }),
        ...(kelas && { kelas: kelas.trim() }),
        ...(status && { status: status.trim() }),
      },
      include: { akun_orang_tua: true },
    });

    // Handle Orang Tua updates / Reset Password
    let plainNewPassword: string | null = null;
    if (existingSiswa.akun_orang_tua) {
      const ortuUpdates: any = {};
      if (namaOrtu) ortuUpdates.nama_lengkap = namaOrtu.trim();
      if (noWhatsappOrtu) ortuUpdates.no_whatsapp = noWhatsappOrtu.trim();
      if (emailOrtu !== undefined) ortuUpdates.email = emailOrtu ? emailOrtu.trim() : null;

      if (resetPasswordOrtu) {
        const randomPin = Math.floor(1000 + Math.random() * 9000);
        plainNewPassword = `falah${randomPin}`;
        ortuUpdates.password_hash = await hashPassword(plainNewPassword);
        ortuUpdates.password_terbuka_sementara = plainNewPassword;
      }

      if (Object.keys(ortuUpdates).length > 0) {
        await prisma.akunOrangTua.update({
          where: { id: existingSiswa.akun_orang_tua.id },
          data: ortuUpdates,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil diperbarui.",
      siswa: updatedSiswa,
      newPassword: plainNewPassword,
    });
  } catch (error) {
    console.error("Update siswa error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data siswa" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.siswa.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa dan akun orang tua terkait berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete siswa error:", error);
    return NextResponse.json({ error: "Gagal menghapus siswa" }, { status: 500 });
  }
}
