import { NextResponse } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { firstError, resetSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const p = resetSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const tokenHash = crypto.createHash("sha256").update(p.data.token).digest("hex");
  const t = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!t || t.usedAt || t.expiresAt < new Date()) return NextResponse.json({ error: "El enlace es inválido o ha expirado. Solicita uno nuevo." }, { status: 400 });
  await prisma.$transaction([
    prisma.user.update({ where: { id: t.userId }, data: { passwordHash: await bcrypt.hash(p.data.password, 10) } }),
    prisma.passwordResetToken.update({ where: { id: t.id }, data: { usedAt: new Date() } }),
  ]);
  return NextResponse.json({ ok: true });
}
