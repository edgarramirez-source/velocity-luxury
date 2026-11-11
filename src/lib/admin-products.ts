import type { z } from "zod";
import { prisma } from "./db";
import type { productSchema } from "./validators";
import { slugify } from "./utils";

export function productData(d: z.infer<typeof productSchema>) {
  return {
    name: d.name, description: d.description, details: d.details, price: d.price, compareAt: d.compareAt ?? null, gender: d.gender,
    categoryId: d.categoryId, collectionId: d.collectionId || null, images: JSON.stringify(d.images), model3d: d.model3d || null, sizes: JSON.stringify(d.sizes),
    colors: JSON.stringify(d.colors), stock: d.stock, isNew: d.isNew, isExclusive: d.isExclusive, active: d.active,
  };
}
export async function uniqueSlug(base: string, exceptId?: string) {
  const root = slugify(base) || "producto"; let slug = root; let i = 1;
  while (true) { const ex = await prisma.product.findUnique({ where: { slug } }); if (!ex || ex.id === exceptId) return slug; slug = `${root}-${++i}`; }
}
