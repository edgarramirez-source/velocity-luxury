import { Suspense } from "react";
import Link from "next/link";
import type { CatalogResult } from "@/lib/catalog";
import { ProductCard } from "../ProductCard";
import { Filters, Pagination, SortSelect } from "./Filters";

export function CatalogView({ data, hideCategory, hideOffer }: { data: CatalogResult; hideCategory?: boolean; hideOffer?: boolean }) {
  const { products, total, page, pages, facets, active } = data;
  return (
    <div className="container-x grid gap-6 pb-10 lg:grid-cols-[250px_1fr] lg:gap-10">
      <Suspense><Filters facets={facets} active={active} hideCategory={hideCategory} hideOffer={hideOffer} /></Suspense>
      <div>
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <p className="text-sm text-white/50" aria-live="polite"><b className="text-white">{total}</b> {total === 1 ? "producto" : "productos"}{active.q && <> para “<span className="text-giallo">{active.q}</span>”</>}</p>
          <Suspense><SortSelect value={active.orden} /></Suspense>
        </div>
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="h-display text-4xl">Sin resultados</p>
            <p className="mt-3 text-white/50">Ajusta los filtros o explora toda la tienda.</p>
            <Link href="/tienda" className="btn-primary mt-8">Ver todos los productos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 xl:grid-cols-3">
            {products.map((p, i) => <ProductCard key={p.id} p={p} priority={i < 3} />)}
          </div>
        )}
        <Suspense><Pagination page={page} pages={pages} /></Suspense>
      </div>
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle, image }: { eyebrow: string; title: string; subtitle?: string; image?: string }) {
  return (
    <section className="relative mb-12 overflow-hidden border-b border-white/[0.06]">
      {image ? <><img src={image} alt="" className="zoom-out absolute inset-0 h-full w-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" /></> : <div className="grid-lines absolute inset-0" />}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-giallo/10 blur-3xl" />
      <div className="container-x relative py-20 sm:py-28">
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 className="h-display rise mt-4 text-6xl italic sm:text-8xl [animation-delay:100ms]">{title}</h1>
        {subtitle && <p className="rise mt-5 max-w-xl text-white/60 [animation-delay:200ms]">{subtitle}</p>}
      </div>
    </section>
  );
}
