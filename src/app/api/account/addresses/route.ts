import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { addressSchema, firstError } from "@/lib/validators";

export async function POST(req: Request) {
  const u = await apiUser(); if (!u) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const p = addressSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const count = await prisma.address.count({ where: { userId: u.id } });
  const isDefault = p.data.isDefault || count === 0;
  if (isDefault) await prisma.address.updateMany({ where: { userId: u.id }, data: { isDefault: false } });
  const a = await prisma.address.create({ data: { ...p.data, line2: p.data.line2 || null, postalCode: p.data.postalCode || null, isDefault, userId: u.id } });
  return NextResponse.json({ address: a });
}
