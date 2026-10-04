import { NextResponse } from "next/server";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PeranPengguna } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const user = await prisma.pengguna.findUnique({
      where: { id },
      select: {
        id: true,
        nama_pengguna: true,
        nama: true,
        email: true,
        peran: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json({ error: "Gagal memuat pengguna." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.peran !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Hanya Super Admin yang diizinkan mengubah akun pengguna lain." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, nama_pengguna, email, peran, newPassword } = body;

    const existingUser = await prisma.pengguna.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const updateData: any = {};

    if (nama) updateData.nama = nama.trim();

    if (nama_pengguna) {
      const cleanUsername = nama_pengguna.trim().toLowerCase();
      if (cleanUsername !== existingUser.nama_pengguna.toLowerCase()) {
        const dupUser = await prisma.pengguna.findUnique({
          where: { nama_pengguna: cleanUsername },
        });
        if (dupUser) {
          return NextResponse.json(
            { error: `Username '${cleanUsername}' sudah digunakan.` },
            { status: 400 }
          );
        }
        updateData.nama_pengguna = cleanUsername;
      }
    }

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== existingUser.email.toLowerCase()) {
        const dupEmail = await prisma.pengguna.findUnique({
          where: { email: cleanEmail },
        });
        if (dupEmail) {
          return NextResponse.json(
            { error: `Email '${cleanEmail}' sudah digunakan.` },
            { status: 400 }
          );
        }
        updateData.email = cleanEmail;
      }
    }

    if (peran) {
      // If demoting self or another super admin, ensure there is still at least one super admin
      if (existingUser.peran === "SUPER_ADMIN" && peran !== "SUPER_ADMIN") {
        const superAdminCount = await prisma.pengguna.count({
          where: { peran: PeranPengguna.SUPER_ADMIN },
        });
        if (superAdminCount <= 1) {
          return NextResponse.json(
            { error: "Tidak dapat mengubah peran. Minimal harus ada satu Super Admin di sistem." },
            { status: 400 }
          );
        }
      }
      updateData.peran = peran === "SUPER_ADMIN" ? PeranPengguna.SUPER_ADMIN : PeranPengguna.EDITOR;
    }

    // Reset password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password baru minimal 6 karakter." },
          { status: 400 }
        );
      }
      updateData.password_hash = await hashPassword(newPassword);
    }

    const updated = await prisma.pengguna.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nama_pengguna: true,
        nama: true,
        email: true,
        peran: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data akun pengguna berhasil diperbarui.",
      user: updated,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengguna." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.peran !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Hanya Super Admin yang diizinkan menghapus akun pengguna." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    // Cannot delete own account
    if (id === session.userId) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.pengguna.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // If deleting a SUPER_ADMIN, ensure there is at least one remaining
    if (targetUser.peran === "SUPER_ADMIN") {
      const superAdminCount = await prisma.pengguna.count({
        where: { peran: PeranPengguna.SUPER_ADMIN },
      });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Tidak dapat menghapus. Minimal harus ada satu Super Admin di sistem." },
          { status: 400 }
        );
      }
    }

    await prisma.pengguna.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Akun pengguna berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna." }, { status: 500 });
  }
}
