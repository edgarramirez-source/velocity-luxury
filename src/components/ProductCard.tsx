"use client";
import Link from "next/link";
import { useState } from "react";
import type { ProductDTO } from "@/lib/products";
import { discountPct, formatPrice } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { isPhoto, thumb } from "@/lib/media";

export function ProductBadges({ p }: { p: Pick<ProductDTO, "isNew" | "isExclusive" | "price" | "compareAt" | "stock"> }) {
  const off = discountPct(p.price, p.compareAt);
  return (
    <div className="flex flex-col items-start gap-1.5">
      {p.isExclusive && <span className="badge bg-black text-giallo border border-giallo/60">Exclusivo</span>}
      {p.isNew && <span className="badge bg-white text-black">Nuevo</span>}
      {off > 0 && <span className="badge bg-giallo text-black">Oferta −{off}%</span>}
      {p.stock === 0 && <span className="badge bg-red-600 text-white">Agotado</span>}
    </div>
  );
}

export function ProductCard({ p, priority = false }: { p: ProductDTO; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  const toast = useUI((s) => s.toast);
  const color = p.colors[colorIdx];
  const main = color?.image ?? p.images[0];
  const second = p.images.find((x, i) => i > 0 && x !== main && isPhoto(x) === isPhoto(main)) ?? main;

  function quickAdd(size: string) {
    add({ productId: p.id, slug: p.slug, name: p.name, image: main, price: p.price, size, color: color?.name ?? "Único", quantity: 1, maxStock: p.stock });
    toast({ title: "Añadido al carrito", description: `${p.name} · Talla ${size} · ${color?.name}`, image: main, tone: "success", action: { label: "Ver carrito", href: "/carrito" } });
    setOpen(false);
  }

  return (
    <article className="group relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
        <Link href={`/producto/${p.slug}`} className="absolute inset-0 block" aria-label={p.name}>
          <img src={thumb(main)} alt={`${p.name} en color ${color?.name ?? ""}`} loading={priority ? "eager" : "lazy"} decoding="async" className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-race ${hover ? "scale-105 opacity-0" : "scale-100 opacity-100"}`} />
          <img src={thumb(second)} alt="" aria-hidden loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-race ${hover ? "scale-100 opacity-100" : "scale-105 opacity-0"}`} />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3"><ProductBadges p={p} /></div>
        {p.model3d && <span className="pointer-events-none absolute bottom-3 right-3 border border-giallo/50 bg-black/60 px-2 py-1 font-tech text-[8px] tracking-[0.2em] text-giallo backdrop-blur lg:group-hover:opacity-0">360°</span>}
        <FavoriteButton productId={p.id} name={p.name} className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-black/40 backdrop-blur hover:bg-black/70" />
        {p.stock > 0 && (
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-500 ease-race group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:block">
            <p className="mb-2 font-tech text-[8px] tracking-[0.25em] text-white/70">AÑADIDO RÁPIDO · TALLA</p>
            <div className="flex flex-wrap gap-1">
              {p.sizes.map((s) => <button key={s} onClick={() => quickAdd(s)} className="min-w-9 border border-white/30 bg-black/60 px-2 py-1.5 text-[11px] backdrop-blur transition hover:border-giallo hover:bg-giallo hover:text-black" aria-label={`Añadir ${p.name} talla ${s} al carrito`}>{s}</button>)}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-tech text-[8.5px] tracking-[0.25em] text-white/40 uppercase">{p.category?.name}</p>
          <h3 className="mt-1.5 truncate text-[15px] font-semibold"><Link href={`/producto/${p.slug}`} className="hover:text-giallo transition">{p.name}</Link></h3>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-bold">{formatPrice(p.price)}</p>
          {p.compareAt && p.compareAt > p.price && <p className="text-xs text-white/40 line-through">{formatPrice(p.compareAt)}</p>}
        </div>
      </div>
      {p.colors.length > 1 && (
        <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Colores">
          {p.colors.map((c, i) => (
            <button key={c.name} onClick={() => setColorIdx(i)} role="radio" aria-checked={i === colorIdx} aria-label={c.name} title={c.name}
              className={`h-4 w-4 rounded-full border transition ${i === colorIdx ? "ring-1 ring-giallo ring-offset-2 ring-offset-ink border-transparent" : "border-white/30 hover:scale-110"}`} style={{ background: c.hex }} />
          ))}
        </div>
      )}
    </article>
  );
}
