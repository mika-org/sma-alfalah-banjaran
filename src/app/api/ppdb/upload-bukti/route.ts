import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File bukti pembayaran wajib diunggah." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format file tidak didukung. Harap gunakan format gambar (JPG, JPEG, PNG, WebP) atau PDF.",
        },
        { status: 400 }
      );
    }

    // Max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file bukti pembayaran melebihi batas 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const randomName = `bukti-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "bukti-pembayaran"
    );
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, randomName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/bukti-pembayaran/${randomName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Upload bukti error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah bukti pembayaran." },
      { status: 500 }
    );
  }
}
