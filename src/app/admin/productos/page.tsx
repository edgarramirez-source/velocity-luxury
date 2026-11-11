import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/ui";
import { ProductTable } from "@/components/admin/ProductTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Productos" };

export default async function Productos() {
  const [rows, cats] = await Promise.all([prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } }), prisma.category.findMany({ orderBy: { sortOrder: "asc" } })]);
  return (
    <div>
      <AdminHeader title="Productos" subtitle={`${rows.length} productos · ${rows.reduce((s, r) => s + r.stock, 0)} unidades en inventario`} action={<Link href="/admin/productos/nuevo" className="btn-primary"><Plus size={14} />Nuevo producto</Link>} />
      <ProductTable categories={cats.map((c) => c.name)} rows={rows.map((r) => ({ id: r.id, slug: r.slug, name: r.name, image: safeJson<string[]>(r.images, [])[0], category: r.category.name, price: r.price, compareAt: r.compareAt, stock: r.stock, active: r.active, soldCount: r.soldCount, isNew: r.isNew, isExclusive: r.isExclusive }))} />
    </div>
  );
}
