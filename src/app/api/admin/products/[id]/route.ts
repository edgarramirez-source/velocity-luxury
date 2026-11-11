import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { firstError, productSchema } from "@/lib/validators";
import { productData, uniqueSlug } from "@/lib/admin-products";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const p = productSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: firstError(p.error) }, { status: 400 });
  const product = await prisma.product.update({ where: { id }, data: { ...productData(p.data), slug: await uniqueSlug(p.data.slug || p.data.name, id) } });
  return NextResponse.json({ product });
}
/** Actualización rápida de stock / precio / estado desde el listado. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params; const b = await req.json();
  const data: { stock?: number; price?: number; active?: boolean } = {};
  if (Number.isInteger(b.stock) && b.stock >= 0) data.stock = b.stock;
  if (typeof b.price === "number" && b.price > 0) data.price = b.price;
  if (typeof b.active === "boolean") data.active = b.active;
  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.product.delete({ where: { id } }); // OrderItem conserva nombre/precio; su productId pasa a null
  return NextResponse.json({ ok: true });
}
