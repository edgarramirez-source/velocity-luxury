import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";

export async function GET(req: Request) {
  const ids = (new URL(req.url).searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 50);
  const rows = await prisma.product.findMany({ where: { id: { in: ids } } });
  return NextResponse.json({ products: rows.map((p) => ({ id: p.id, price: p.price, stock: p.stock, active: p.active, sizes: safeJson<string[]>(p.sizes, []), colors: safeJson<{ name: string; hex: string; image?: string }[]>(p.colors, []), image: safeJson<string[]>(p.images, [])[0] })) });
}
