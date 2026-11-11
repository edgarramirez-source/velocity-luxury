import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema, firstError } from "@/lib/validators";
import { ipOf, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!rateLimit(`contact:${ipOf(req)}`, 5)) return NextResponse.json({ error: "Demasiados mensajes. Intenta más tarde." }, { status: 429 });
  const p = contactSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  await prisma.contactMessage.create({ data: p.data });
  return NextResponse.json({ ok: true });
}
