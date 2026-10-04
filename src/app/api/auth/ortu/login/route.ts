import { NextResponse } from "next/server";
import { comparePassword, signOrtuToken, ORTU_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const akun = await prisma.akunOrangTua.findFirst({
      where: {
        username: { equals: cleanUsername, mode: "insensitive" },
      },
      include: {
        siswa: true,
      },
    });

    if (!akun) {
      return NextResponse.json(
        { error: "Username atau password salah. Pastikan akun telah diberikan oleh pihak sekolah." },
        { status: 401 }
      );
    }

    if (!akun.status_aktif) {
      return NextResponse.json(
        { error: "Akun Orang Tua ini telah dinonaktifkan. Silakan hubungi tata usaha sekolah." },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, akun.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.akunOrangTua.update({
      where: { id: akun.id },
      data: { terakhir_masuk: new Date() },
    });

    // Create JWT token for parent session
    const token = await signOrtuToken({
      ortuId: akun.id,
      username: akun.username,
      nama: akun.nama_lengkap,
      siswaId: akun.siswa_id,
      namaSiswa: akun.siswa.nama_lengkap,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: akun.id,
        username: akun.username,
        nama: akun.nama_lengkap,
        siswa: {
          id: akun.siswa.id,
          nama: akun.siswa.nama_lengkap,
          nis: akun.siswa.nis,
          kelas: akun.siswa.kelas,
        },
      },
    });

    // Set cookie
    response.cookies.set(ORTU_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Ortu login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat masuk." },
      { status: 500 }
    );
  }
}
