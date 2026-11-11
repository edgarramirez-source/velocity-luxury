import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await apiAdmin(); if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params; const b = await req.json();
  if (id === admin.id) return NextResponse.json({ error: "No puedes cambiar tu propio rol." }, { status: 400 });
  if (!["CUSTOMER", "ADMIN"].includes(b.role)) return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  await prisma.user.update({ where: { id }, data: { role: b.role } });
  return NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await apiAdmin(); if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  if (id === admin.id) return NextResponse.json({ error: "No puedes eliminar tu propia cuenta." }, { status: 400 });
  await prisma.user.delete({ where: { id } }); // los pedidos se conservan sin usuario
  return NextResponse.json({ ok: true });
}
