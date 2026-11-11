import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { firstError, registerSchema } from "@/lib/validators";
import { ipOf, rateLimit } from "@/lib/ratelimit";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  if (!rateLimit(`reg:${ipOf(req)}`, 8)) return NextResponse.json({ error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  const p = registerSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const { name, email, password } = p.data;
  if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "Ya existe una cuenta con este correo." }, { status: 409 });
  const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 10) } });
  await prisma.order.updateMany({ where: { email, userId: null }, data: { userId: user.id } });
  await createSession(user);
  await sendMail(email, "Bienvenido a VELOCITY LUXURY", `<h1>Bienvenido, ${name}</h1><p>Usa el código BIENVENIDA20 en tu primera compra sobre $150.</p>`).catch(() => {});
  return NextResponse.json({ ok: true });
}
