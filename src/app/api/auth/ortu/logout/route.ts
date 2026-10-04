import { NextResponse } from "next/server";
import { ORTU_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar" });
  response.cookies.set(ORTU_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
