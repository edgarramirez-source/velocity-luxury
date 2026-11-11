import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiUser, createSession } from "@/lib/auth";
import { firstError, profileSchema } from "@/lib/validators";

export async function PUT(req: Request) {
  const u = await apiUser(); if (!u) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const p = profileSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const user = await prisma.user.update({ where: { id: u.id }, data: { name: p.data.name, phone: p.data.phone || null } });
  await createSession(user);
  return NextResponse.json({ ok: true });
}
