import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { firstError, productSchema } from "@/lib/validators";
import { productData, uniqueSlug } from "@/lib/admin-products";

export async function POST(req: Request) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const p = productSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const product = await prisma.product.create({ data: { ...productData(p.data), slug: await uniqueSlug(p.data.slug || p.data.name) } });
  return NextResponse.json({ product });
}
