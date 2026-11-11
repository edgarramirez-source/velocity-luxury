import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCatalog, type SP } from "@/lib/catalog";
import { CatalogView, PageHero } from "@/components/catalog/CatalogView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await prisma.collection.findUnique({ where: { slug: (await params).slug } });
  return { title: c ? `Colección ${c.name}` : "Colección", description: c?.description };
}

export default async function Coleccion({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SP> }) {
  const { slug } = await params;
  const col = await prisma.collection.findUnique({ where: { slug } });
  if (!col) notFound();
  const data = await getCatalog(await searchParams, { coleccion: slug });
  return (
    <>
      <PageHero eyebrow={col.exclusive ? "Edición exclusiva · Numerada" : "Colección"} title={col.name} subtitle={col.description} image={col.image} />
      <CatalogView data={data} />
    </>
  );
}
