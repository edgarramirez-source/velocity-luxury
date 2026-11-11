import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  await prisma.contactMessage.update({ where: { id: (await params).id }, data: { read: !!b.read } });
  return NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.contactMessage.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
