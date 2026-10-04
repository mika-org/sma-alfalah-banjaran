import { NextResponse } from "next/server";
import { getOrtuSessionUser, comparePassword, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getOrtuSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { passwordLama, passwordBaru } = await request.json();

    if (!passwordLama || !passwordBaru) {
      return NextResponse.json(
        { error: "Password lama dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (passwordBaru.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const akun = await prisma.akunOrangTua.findUnique({
      where: { id: session.ortuId },
    });

    if (!akun) {
      return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
    }

    const isMatch = await comparePassword(passwordLama, akun.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Password lama tidak sesuai." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(passwordBaru);
    await prisma.akunOrangTua.update({
      where: { id: akun.id },
      data: {
        password_hash: newHash,
        password_terbuka_sementara: null, // clear temporary password once changed
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Ganti password error:", error);
    return NextResponse.json(
      { error: "Gagal mengganti password." },
      { status: 500 }
    );
  }
}
