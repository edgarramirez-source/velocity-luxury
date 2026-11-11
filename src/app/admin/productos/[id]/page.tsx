import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Editar producto" };
export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const p = await prisma.product.findUnique({ where: { id: (await params).id } });
  if (!p) notFound();
  const [categories, collections] = await Promise.all([prisma.category.findMany({ orderBy: { sortOrder: "asc" } }), prisma.collection.findMany()]);
  return (
    <div>
      <AdminHeader title="Editar producto" subtitle={p.name} />
      <ProductForm categories={categories} collections={collections} initial={{
        id: p.id, name: p.name, slug: p.slug, description: p.description, details: p.details, price: String(p.price), compareAt: p.compareAt ? String(p.compareAt) : "",
        gender: p.gender as "UNISEX", categoryId: p.categoryId, collectionId: p.collectionId ?? "", images: safeJson(p.images, []), sizes: safeJson(p.sizes, []), colors: safeJson(p.colors, []),
        stock: String(p.stock), isNew: p.isNew, isExclusive: p.isExclusive, active: p.active,
      }} />
    </div>
  );
}
