import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const p = z.object({ email: z.string().trim().toLowerCase().email() }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  const exists = await prisma.subscriber.findUnique({ where: { email: p.data.email } });
  if (exists) return NextResponse.json({ error: "Este correo ya está suscrito." }, { status: 409 });
  await prisma.subscriber.create({ data: { email: p.data.email } });
  return NextResponse.json({ ok: true });
}
