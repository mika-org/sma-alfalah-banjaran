import { NextResponse } from "next/server";
import { getSessionUser, hashPassword, comparePassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.pengguna.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      nama_pengguna: true,
      email: true,
      nama: true,
      peran: true,
      created_at: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      ...user,
      username: user.nama_pengguna,
      name: user.nama,
      role: user.peran,
    },
  });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { nama, name, email, currentPassword, newPassword } = body;

  const user = await prisma.pengguna.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const updateData: { nama?: string; email?: string; password_hash?: string } = {};

  const resolvedName = nama || name;
  if (resolvedName) updateData.nama = resolvedName;
  if (email) updateData.email = email;

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Password saat ini harus diisi untuk mengubah password" },
        { status: 400 }
      );
    }

    const isMatch = await comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Password saat ini tidak sesuai" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    updateData.password_hash = await hashPassword(newPassword);
  }

  const updatedUser = await prisma.pengguna.update({
    where: { id: session.userId },
    data: updateData,
    select: {
      id: true,
      nama_pengguna: true,
      email: true,
      nama: true,
      peran: true,
    },
  });

  return NextResponse.json({ success: true, user: updatedUser });
}
