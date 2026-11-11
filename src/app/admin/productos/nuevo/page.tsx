import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Nuevo producto" };
export default async function Nuevo() {
  const [categories, collections] = await Promise.all([prisma.category.findMany({ orderBy: { sortOrder: "asc" } }), prisma.collection.findMany()]);
  return (
    <div>
      <AdminHeader title="Nuevo producto" />
      <ProductForm categories={categories} collections={collections} initial={{ name: "", slug: "", description: "", details: "", price: "", compareAt: "", gender: "UNISEX", categoryId: "", collectionId: "", images: [], sizes: ["S", "M", "L", "XL"], colors: [{ name: "Nero", hex: "#111113" }], stock: "0", isNew: true, isExclusive: false, active: true }} />
    </div>
  );
}
