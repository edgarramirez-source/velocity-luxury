import type { Product, Category, Collection } from "@prisma/client";
import { safeJson } from "./utils";

export interface ColorOption { name: string; hex: string; image?: string }
export interface ProductDTO {
  id: string; slug: string; name: string; description: string; details: string[]; price: number; compareAt: number | null; gender: string;
  images: string[]; sizes: string[]; colors: ColorOption[]; stock: number; isNew: boolean; isExclusive: boolean; soldCount: number; active: boolean;
  createdAt: string; category: { slug: string; name: string } | null; collection: { slug: string; name: string } | null;
}
export function toDTO(p: Product & { category?: Category | null; collection?: Collection | null }): ProductDTO {
  return {
    id: p.id, slug: p.slug, name: p.name, description: p.description, details: p.details ? p.details.split("\n").filter(Boolean) : [],
    price: p.price, compareAt: p.compareAt, gender: p.gender, images: safeJson<string[]>(p.images, []), sizes: safeJson<string[]>(p.sizes, []),
    colors: safeJson<ColorOption[]>(p.colors, []), stock: p.stock, isNew: p.isNew, isExclusive: p.isExclusive, soldCount: p.soldCount, active: p.active,
    createdAt: p.createdAt.toISOString(), category: p.category ? { slug: p.category.slug, name: p.category.name } : null,
    collection: p.collection ? { slug: p.collection.slug, name: p.collection.name } : null,
  };
}
