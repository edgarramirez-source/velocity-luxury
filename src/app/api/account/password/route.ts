import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { changePasswordSchema, firstError } from "@/lib/validators";

export async function PUT(req: Request) {
  const u = await apiUser(); if (!u) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const p = changePasswordSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const full = await prisma.user.findUniqueOrThrow({ where: { id: u.id } });
  if (!(await bcrypt.compare(p.data.current, full.passwordHash))) return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 400 });
  await prisma.user.update({ where: { id: u.id }, data: { passwordHash: await bcrypt.hash(p.data.password, 10) } });
  return NextResponse.json({ ok: true });
}
