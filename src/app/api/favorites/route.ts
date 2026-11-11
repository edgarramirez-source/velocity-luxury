import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";

export async function GET() {
  const u = await apiUser(); if (!u) return NextResponse.json({ ids: [] });
  const f = await prisma.favorite.findMany({ where: { userId: u.id }, select: { productId: true } });
  return NextResponse.json({ ids: f.map((x) => x.productId) });
}
export async function POST(req: Request) {
  const u = await apiUser(); if (!u) return NextResponse.json({ error: "Inicia sesión" }, { status: 401 });
  const { productId } = await req.json();
  if (!(await prisma.product.findUnique({ where: { id: String(productId) } }))) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  await prisma.favorite.upsert({ where: { userId_productId: { userId: u.id, productId } }, create: { userId: u.id, productId }, update: {} });
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  const u = await apiUser(); if (!u) return NextResponse.json({ error: "Inicia sesión" }, { status: 401 });
  const { productId } = await req.json();
  await prisma.favorite.deleteMany({ where: { userId: u.id, productId: String(productId) } });
  return NextResponse.json({ ok: true });
}
