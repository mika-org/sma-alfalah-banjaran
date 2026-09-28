import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
