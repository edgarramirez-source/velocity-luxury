import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { toDTO } from "./products";
import { safeJson } from "./utils";

export type SP = Record<string, string | string[] | undefined>;
export const PAGE_SIZE = 12;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const list = (v: string | string[] | undefined) => one(v).split(",").map((s) => s.trim()).filter(Boolean);

export const SORTS = [
  { id: "destacados", label: "Destacados" },
  { id: "novedades", label: "Novedades" },
  { id: "popularidad", label: "Popularidad" },
  { id: "precio-asc", label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
];

export async function getCatalog(sp: SP, forced: { oferta?: boolean; coleccion?: string } = {}) {
  const q = one(sp.q).trim();
  const cats = list(sp.categoria);
  const genero = one(sp.genero);
  const sizes = list(sp.talla);
  const colors = list(sp.color);
  const min = Number(one(sp.min)) || undefined;
  const max = Number(one(sp.max)) || undefined;
  const oferta = forced.oferta || one(sp.oferta) === "1";
  const exclusivo = one(sp.exclusivo) === "1";
  const nuevo = one(sp.nuevo) === "1";
  const coleccion = forced.coleccion || one(sp.coleccion);
  const orden = one(sp.orden) || "destacados";
  const page = Math.max(1, Number(one(sp.pagina)) || 1);

  const AND: Prisma.ProductWhereInput[] = [{ active: true }];
  if (q) AND.push({ OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { colors: { contains: q, mode: "insensitive" } }, { category: { name: { contains: q, mode: "insensitive" } } }, { collection: { name: { contains: q, mode: "insensitive" } } }] });
  if (cats.length) AND.push({ category: { slug: { in: cats } } });
  if (genero === "HOMBRE" || genero === "MUJER") AND.push({ gender: { in: [genero, "UNISEX"] } });
  if (sizes.length) AND.push({ OR: sizes.map((s) => ({ sizes: { contains: `"${s}"` } })) });
  if (colors.length) AND.push({ OR: colors.map((c) => ({ colors: { contains: `"name":"${c}"` } })) });
  if (min) AND.push({ price: { gte: min } });
  if (max) AND.push({ price: { lte: max } });
  if (exclusivo) AND.push({ isExclusive: true });
  if (nuevo) AND.push({ isNew: true });
  if (coleccion) AND.push({ collection: { slug: coleccion } });
  const where: Prisma.ProductWhereInput = { AND };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    orden === "precio-asc" ? [{ price: "asc" }] : orden === "precio-desc" ? [{ price: "desc" }] : orden === "popularidad" ? [{ soldCount: "desc" }] : orden === "novedades" ? [{ createdAt: "desc" }] : [{ isExclusive: "desc" }, { isNew: "desc" }, { soldCount: "desc" }];

  // Ofertas: SQLite no compara columnas entre sí en Prisma, así que filtramos compareAt > price en memoria.
  let rows = await prisma.product.findMany({ where: oferta ? { AND: [...AND, { compareAt: { not: null } }] } : where, orderBy, include: { category: true, collection: true } });
  if (oferta) rows = rows.filter((r) => r.compareAt && r.compareAt > r.price);
  const total = rows.length;
  const products = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(toDTO);

  const [categories, all] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { slug: true, name: true } }),
    prisma.product.findMany({ where: { active: true }, select: { colors: true, sizes: true, price: true } }),
  ]);
  const colorMap = new Map<string, string>();
  const sizeSet = new Set<string>();
  let maxPrice = 0;
  for (const p of all) {
    safeJson<{ name: string; hex: string }[]>(p.colors, []).forEach((c) => colorMap.set(c.name, c.hex));
    safeJson<string[]>(p.sizes, []).forEach((s) => sizeSet.add(s));
    maxPrice = Math.max(maxPrice, p.price);
  }
  const ORDER = ["XS", "S", "M", "L", "XL", "XXL", "ÚNICA"];
  return {
    products, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    facets: { categories, colors: [...colorMap].map(([name, hex]) => ({ name, hex })), sizes: [...sizeSet].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)), maxPrice: Math.ceil(maxPrice / 50) * 50 },
    active: { q, cats, genero, sizes, colors, min, max, oferta, exclusivo, nuevo, orden },
  };
}
export type CatalogResult = Awaited<ReturnType<typeof getCatalog>>;
