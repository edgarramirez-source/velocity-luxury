import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { addressSchema, firstError } from "@/lib/validators";

async function own(id: string) { const u = await apiUser(); if (!u) return null; const a = await prisma.address.findFirst({ where: { id, userId: u.id } }); return a ? { u, a } : null; }

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const o = await own((await params).id); if (!o) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const p = addressSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  if (p.data.isDefault) await prisma.address.updateMany({ where: { userId: o.u.id }, data: { isDefault: false } });
  const a = await prisma.address.update({ where: { id: o.a.id }, data: { ...p.data, line2: p.data.line2 || null, postalCode: p.data.postalCode || null, isDefault: p.data.isDefault ?? o.a.isDefault } });
  return NextResponse.json({ address: a });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const o = await own((await params).id); if (!o) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  await prisma.address.delete({ where: { id: o.a.id } });
  if (o.a.isDefault) { const first = await prisma.address.findFirst({ where: { userId: o.u.id } }); if (first) await prisma.address.update({ where: { id: first.id }, data: { isDefault: true } }); }
  return NextResponse.json({ ok: true });
}
