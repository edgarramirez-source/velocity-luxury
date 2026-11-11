import type { Metadata } from "next";
import { getCatalog, type SP } from "@/lib/catalog";
import { CatalogView, PageHero } from "@/components/catalog/CatalogView";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Tienda", description: "Explora el catálogo completo de VELOCITY LUXURY." };

export default async function Tienda({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const data = await getCatalog(sp);
  let title = "La colección";
  let eyebrow = "Tienda";
  if (data.active.genero === "HOMBRE") { title = "Hombres"; eyebrow = "Para él"; }
  if (data.active.genero === "MUJER") { title = "Mujeres"; eyebrow = "Para ella"; }
  if (data.active.cats.length === 1) {
    const c = await prisma.category.findUnique({ where: { slug: data.active.cats[0] } });
    if (c) { title = c.name; eyebrow = c.description; }
  }
  if (data.active.orden === "novedades" && !data.active.cats.length) eyebrow = "Lo último del taller";
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <CatalogView data={data} />
    </>
  );
}
