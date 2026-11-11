import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { forgotSchema, firstError } from "@/lib/validators";
import { sendMail } from "@/lib/mail";
import { ipOf, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!rateLimit(`forgot:${ipOf(req)}`, 5)) return NextResponse.json({ error: "Demasiadas solicitudes. Espera un minuto." }, { status: 429 });
  const p = forgotSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: p.data.email } });
  let devLink: string | undefined;
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: crypto.createHash("sha256").update(token).digest("hex"), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
    const link = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cuenta/restablecer?token=${token}`;
    const r = await sendMail(user.email, "Restablece tu contraseña — VELOCITY LUXURY", `<p>Hola ${user.name},</p><p>Para crear una nueva contraseña visita: <a href="${link}">${link}</a></p><p>El enlace expira en 1 hora.</p>`);
    if (!r.delivered && process.env.NODE_ENV !== "production") devLink = link;
  }
  // Respuesta idéntica exista o no la cuenta (evita enumeración de usuarios)
  return NextResponse.json({ ok: true, devLink });
}
