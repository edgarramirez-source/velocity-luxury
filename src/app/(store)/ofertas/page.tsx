import type { Metadata } from "next";
import { getCatalog, type SP } from "@/lib/catalog";
import { CatalogView, PageHero } from "@/components/catalog/CatalogView";

export const metadata: Metadata = { title: "Ofertas", description: "Piezas seleccionadas con precio especial por tiempo limitado." };

export default async function Ofertas({ searchParams }: { searchParams: Promise<SP> }) {
  const data = await getCatalog(await searchParams, { oferta: true });
  return (
    <>
      <PageHero eyebrow="Tiempo limitado" title="Ofertas" subtitle="Piezas seleccionadas con precio especial. Cuando se agotan, no vuelven." />
      <CatalogView data={data} hideOffer />
    </>
  );
}
