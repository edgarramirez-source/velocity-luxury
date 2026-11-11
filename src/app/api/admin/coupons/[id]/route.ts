import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  const coupon = await prisma.coupon.update({ where: { id: (await params).id }, data: { active: !!b.active } });
  return NextResponse.json({ coupon });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.coupon.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
