import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });
  const rows = await prisma.product.findMany({
    where: { active: true, OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { colors: { contains: q, mode: "insensitive" } }, { category: { name: { contains: q, mode: "insensitive" } } }, { collection: { name: { contains: q, mode: "insensitive" } } }] },
    take: 6, orderBy: { soldCount: "desc" }, include: { category: true },
  });
  return NextResponse.json({ results: rows.map((r) => ({ id: r.id, slug: r.slug, name: r.name, price: r.price, image: safeJson<string[]>(r.images, [])[0], category: r.category.name })) });
}
