import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { firstError, loginSchema } from "@/lib/validators";
import { ipOf, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!rateLimit(`login:${ipOf(req)}`, 10)) return NextResponse.json({ error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  const p = loginSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: p.data.email } });
  if (!user || !(await bcrypt.compare(p.data.password, user.passwordHash))) return NextResponse.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  await createSession(user);
  return NextResponse.json({ ok: true, role: user.role });
}
