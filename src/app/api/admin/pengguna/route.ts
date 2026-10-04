import { NextResponse } from "next/server";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PeranPengguna } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const users = await prisma.pengguna.findMany({
      select: {
        id: true,
        nama_pengguna: true,
        nama: true,
        email: true,
        peran: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: "asc" },
    });

    return NextResponse.json({
      users,
      currentUserId: session.userId,
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar pengguna" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only SUPER_ADMIN can manage other users
  if (session.peran !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Hanya Super Admin yang diizinkan mengelola pengguna." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { nama, nama_pengguna, email, peran = "EDITOR", password } = body;

    if (!nama || !nama_pengguna || !email || !password) {
      return NextResponse.json(
        { error: "Nama, username, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const cleanUsername = nama_pengguna.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate username or email
    const existing = await prisma.pengguna.findFirst({
      where: {
        OR: [
          { nama_pengguna: cleanUsername },
          { email: cleanEmail },
        ],
      },
    });

    if (existing) {
      if (existing.nama_pengguna.toLowerCase() === cleanUsername) {
        return NextResponse.json(
          { error: `Username '${cleanUsername}' sudah digunakan.` },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Email '${cleanEmail}' sudah digunakan.` },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.pengguna.create({
      data: {
        nama: nama.trim(),
        nama_pengguna: cleanUsername,
        email: cleanEmail,
        password_hash: passwordHash,
        peran: peran === "SUPER_ADMIN" ? PeranPengguna.SUPER_ADMIN : PeranPengguna.EDITOR,
      },
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
      message: "Pengguna baru berhasil ditambahkan.",
      user: newUser,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Gagal membuat pengguna" }, { status: 500 });
  }
}
