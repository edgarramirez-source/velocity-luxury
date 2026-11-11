import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toDTO } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Favoritos" };
export default async function Page() {
  const u = await requireUser("/cuenta/favoritos");
  const favs = await prisma.favorite.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, include: { product: { include: { category: true, collection: true } } } });
  if (!favs.length) return <div className="card p-10 text-center"><p className="h-display text-4xl">Tu lista está vacía</p><p className="mt-2 text-white/50">Toca el corazón en cualquier producto para guardarlo aquí.</p><Link href="/tienda" className="btn-primary mt-6">Descubrir productos</Link></div>;
  return <div className="grid grid-cols-2 gap-x-4 gap-y-12 xl:grid-cols-3">{favs.filter((f) => f.product.active).map((f) => <ProductCard key={f.id} p={toDTO(f.product)} />)}</div>;
}
