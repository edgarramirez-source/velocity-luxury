import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { couponSchema, firstError } from "@/lib/validators";

export async function POST(req: Request) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const p = couponSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  if (p.data.type === "PERCENT" && (p.data.value <= 0 || p.data.value > 90)) return NextResponse.json({ error: "El porcentaje debe estar entre 1 y 90." }, { status: 400 });
  if (await prisma.coupon.findUnique({ where: { code: p.data.code } })) return NextResponse.json({ error: "Ya existe un código con ese nombre." }, { status: 409 });
  const coupon = await prisma.coupon.create({ data: { ...p.data, usageLimit: p.data.usageLimit ?? null, expiresAt: p.data.expiresAt ? new Date(p.data.expiresAt) : null } });
  return NextResponse.json({ coupon });
}
