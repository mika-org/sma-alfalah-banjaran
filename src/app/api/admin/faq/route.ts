import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const faqs = await prisma.faq.findMany({
    orderBy: { urutan: "asc" },
  });
  const mapped = faqs.map((f) => ({
    ...f,
    question: f.pertanyaan,
    answer: f.jawaban,
    sortOrder: f.urutan,
    isPublished: f.status_terbit,
  }));
  return NextResponse.json({ faqs: mapped });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const faq = await prisma.faq.create({
    data: {
      pertanyaan: body.pertanyaan || body.question || "",
      jawaban: body.jawaban || body.answer || "",
      urutan: body.urutan ?? body.sortOrder ?? 0,
      status_terbit: body.status_terbit ?? body.isPublished ?? true,
    },
  });

  return NextResponse.json({ faq });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, ...data } = body;

  const updateData: Record<string, any> = {};
  if (data.pertanyaan !== undefined || data.question !== undefined) updateData.pertanyaan = data.pertanyaan ?? data.question;
  if (data.jawaban !== undefined || data.answer !== undefined) updateData.jawaban = data.jawaban ?? data.answer;
  if (data.urutan !== undefined || data.sortOrder !== undefined) updateData.urutan = data.urutan ?? data.sortOrder;
  if (data.status_terbit !== undefined || data.isPublished !== undefined) updateData.status_terbit = data.status_terbit ?? data.isPublished;

  const faq = await prisma.faq.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ faq });
}

export async function DELETE(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.faq.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
