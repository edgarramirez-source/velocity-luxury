"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, Ruler, ShieldCheck, Truck, RotateCcw, X, ChevronDown } from "lucide-react";
import type { ProductDTO } from "@/lib/products";
import { discountPct, formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { FavoriteButton } from "../FavoriteButton";
import { ProductBadges } from "../ProductCard";
import { thumb } from "@/lib/media";
import dynamic from "next/dynamic";
const Viewer360 = dynamic(() => import("./Viewer360").then((m) => m.Viewer360), { ssr: false });

const GUIDE = [["XS", "84–88", "68–72", "166–170"], ["S", "88–94", "72–78", "170–174"], ["M", "94–100", "78–84", "174–178"], ["L", "100–106", "84–90", "178–182"], ["XL", "106–112", "90–96", "182–186"], ["XXL", "112–118", "96–102", "186–190"]];

export function ProductDetail({ p }: { p: ProductDTO }) {
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [guide, setGuide] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  const toast = useUI((s) => s.toast);
  const color = p.colors[colorIdx];
  const gallery = useMemo(() => { const g = [...p.images]; if (color?.image && !g.includes(color.image)) g.unshift(color.image); return g; }, [p.images, color]);
  const [imgIdx, setImgIdx] = useState(0);
  const [view360, setView360] = useState(false);
  const current = gallery[imgIdx] ?? gallery[0];
  const off = discountPct(p.price, p.compareAt);
  const soldOut = p.stock === 0;

  function pickColor(i: number) {
    setColorIdx(i);
    const img = p.colors[i]?.image; const idx = img ? gallery.indexOf(img) : -1;
    setImgIdx(idx >= 0 ? idx : 0);
  }
  function addToCart() {
    if (!size) { setSizeError(true); return; }
    add({ productId: p.id, slug: p.slug, name: p.name, image: color?.image ?? p.images[0], price: p.price, size, color: color?.name ?? "Único", quantity: qty, maxStock: p.stock });
    toast({ title: "Añadido al carrito", description: `${p.name} · ${size} · ${color?.name} × ${qty}`, image: color?.image ?? p.images[0], tone: "success", action: { label: "Finalizar compra", href: "/checkout" } });
    setOpen(true);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* Galería */}
      <div className="grid gap-3 md:grid-cols-[84px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col" role="tablist" aria-label="Imágenes del producto">
          {gallery.map((g, i) => (
            <button key={g + i} role="tab" aria-selected={!view360 && i === imgIdx} aria-label={`Imagen ${i + 1}`} onClick={() => { setImgIdx(i); setView360(false); }} className={cn("aspect-[4/5] w-20 shrink-0 overflow-hidden border transition md:w-full", !view360 && i === imgIdx ? "border-giallo" : "border-white/10 opacity-60 hover:opacity-100")}>
              <img src={thumb(g)} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
          {p.model3d && (
            <button role="tab" aria-selected={view360} aria-label="Vista 360°" onClick={() => setView360(true)} className={cn("grid aspect-[4/5] w-20 shrink-0 place-items-center border bg-graphite font-tech text-[11px] tracking-widest transition md:w-full", view360 ? "border-giallo text-giallo" : "border-white/10 text-white/70 hover:text-giallo")}>360°</button>
          )}
        </div>
        {view360 && p.model3d ? (
          <div className="relative order-1 aspect-[4/5] overflow-hidden md:order-2"><Viewer360 src={p.model3d} alt={`Vista 360° de ${p.name}`} poster={thumb(p.images[0])} /></div>
        ) : (
        <div className="relative order-1 aspect-[4/5] cursor-zoom-in overflow-hidden bg-graphite md:order-2"
          onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
          onMouseLeave={() => setZoom(null)}>
          <img key={current} src={current} alt={`${p.name} — ${color?.name ?? ""}`} className="fade-in h-full w-full object-cover transition-transform duration-300" style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
          <div className="pointer-events-none absolute left-4 top-4"><ProductBadges p={p} /></div>
          {p.model3d && <button onClick={() => setView360(true)} className="absolute bottom-4 right-4 border border-giallo/60 bg-black/70 px-3 py-2 font-tech text-[9px] tracking-[0.2em] text-giallo backdrop-blur transition hover:bg-giallo hover:text-black">VER EN 360°</button>}
        </div>
        )}
      </div>

      {/* Información */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <nav className="font-tech text-[9px] tracking-[0.2em] text-white/40" aria-label="Migas de pan">
          <Link href="/tienda" className="hover:text-giallo">TIENDA</Link> / {p.category && <Link href={`/tienda?categoria=${p.category.slug}`} className="hover:text-giallo">{p.category.name.toUpperCase()}</Link>}
        </nav>
        {p.collection && <Link href={`/colecciones/${p.collection.slug}`} className="eyebrow mt-6 inline-block hover:underline">Colección {p.collection.name}</Link>}
        <h1 className="h-display mt-3 text-5xl sm:text-6xl">{p.name}</h1>
        <div className="mt-5 flex items-baseline gap-4">
          <p className="font-display text-4xl font-bold">{formatPrice(p.price)}</p>
          {off > 0 && <><p className="text-lg text-white/40 line-through">{formatPrice(p.compareAt!)}</p><span className="badge bg-giallo text-black">−{off}%</span></>}
        </div>
        <p className="mt-6 leading-relaxed text-white/65">{p.description}</p>

        <div className="mt-8">
          <p className="label">Color: <span className="text-white">{color?.name}</span></p>
          <div className="flex gap-3" role="radiogroup" aria-label="Color">
            {p.colors.map((c, i) => (
              <button key={c.name} role="radio" aria-checked={i === colorIdx} aria-label={c.name} title={c.name} onClick={() => pickColor(i)}
                className={cn("h-10 w-10 rounded-full border transition", i === colorIdx ? "ring-2 ring-giallo ring-offset-[3px] ring-offset-ink border-transparent" : "border-white/25 hover:scale-110")} style={{ background: c.hex }} />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="label">Talla {size && <span className="text-white">: {size}</span>}</p>
            {p.sizes.length > 1 && <button onClick={() => setGuide(true)} className="mb-2 flex items-center gap-1.5 font-tech text-[9px] tracking-[0.2em] text-white/50 hover:text-giallo"><Ruler size={13} /> GUÍA DE TALLAS</button>}
          </div>
          <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Talla">
            {["XS", "S", "M", "L", "XL", "XXL"].filter((s) => p.sizes.length > 1 || p.sizes.includes(s)).concat(p.sizes.filter((s) => !["XS", "S", "M", "L", "XL", "XXL"].includes(s))).map((s) => {
              const available = p.sizes.includes(s);
              return (
                <button key={s} role="radio" aria-checked={size === s} disabled={!available || soldOut} onClick={() => { setSize(s); setSizeError(false); }}
                  className={cn("border py-3 text-sm transition", size === s ? "border-giallo bg-giallo font-semibold text-black" : "border-white/15 hover:border-white/50", (!available || soldOut) && "cursor-not-allowed text-white/20 line-through hover:border-white/15", s === "ÚNICA" && "col-span-2")}>{s}</button>
              );
            })}
          </div>
          {sizeError && <p className="mt-2 text-sm text-red-400" role="alert">Selecciona una talla para continuar.</p>}
        </div>

        <div className="mt-8 flex gap-3">
          <div className="flex items-center border border-white/15" aria-label="Cantidad">
            <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} className="px-4 py-4 hover:text-giallo disabled:opacity-30" aria-label="Disminuir cantidad"><Minus size={14} /></button>
            <input value={qty} onChange={(e) => setQty(Math.max(1, Math.min(p.stock || 1, Number(e.target.value.replace(/\D/g, "")) || 1)))} className="w-10 bg-transparent text-center outline-none" aria-label="Cantidad" inputMode="numeric" />
            <button onClick={() => setQty(Math.min(p.stock, qty + 1))} disabled={qty >= p.stock} className="px-4 py-4 hover:text-giallo disabled:opacity-30" aria-label="Aumentar cantidad"><Plus size={14} /></button>
          </div>
          <button onClick={addToCart} disabled={soldOut} className="btn-primary flex-1">{soldOut ? "Agotado" : "Añadir al carrito"}</button>
          <FavoriteButton productId={p.id} name={p.name} className="grid w-14 place-items-center border border-white/15 hover:border-giallo" />
        </div>
        <p className={cn("mt-3 text-xs", p.stock <= 10 ? "text-giallo" : "text-white/40")}>{soldOut ? "Sin stock por el momento." : p.stock <= 10 ? `¡Solo quedan ${p.stock} unidades!` : "En stock · Despacho en 24 horas"}</p>

        <div className="mt-8 grid grid-cols-3 gap-px border border-white/[0.06] bg-white/[0.06] text-center">
          {[[Truck, "Envío gratis +$150"], [RotateCcw, "Devolución 30 días"], [ShieldCheck, "Pago seguro"]].map(([Icon, t]) => { const I = Icon as typeof Truck; return (
            <div key={t as string} className="bg-ink px-2 py-4"><I size={18} className="mx-auto text-giallo" strokeWidth={1.5} /><p className="mt-2 text-[11px] text-white/60">{t as string}</p></div>
          ); })}
        </div>

        <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          <Accordion title="Detalles y materiales" open>{<ul className="space-y-2">{p.details.map((d) => <li key={d} className="flex gap-3 text-sm text-white/65"><span className="mt-2 h-px w-3 shrink-0 bg-giallo" />{d}</li>)}</ul>}</Accordion>
          <Accordion title="Envío y devoluciones"><p className="text-sm leading-relaxed text-white/65">Envío estándar en 3–5 días hábiles ($5.99, gratis sobre $150). Express 24–48 h ($14.99). Devoluciones gratuitas en 30 días con etiquetas intactas. <Link href="/envios" className="text-giallo hover:underline">Más información</Link>.</p></Accordion>
          <Accordion title="Cuidado"><p className="text-sm leading-relaxed text-white/65">Lavar en frío del revés, no usar secadora, planchar a baja temperatura evitando estampados y bordados. Las piezas exclusivas requieren limpieza profesional.</p></Accordion>
        </div>
      </div>

      {guide && (
        <div className="fixed inset-0 z-[95] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Guía de tallas">
          <div className="absolute inset-0 bg-black/80 fade-in" onClick={() => setGuide(false)} />
          <div className="toast-in relative w-full max-w-lg border border-white/10 bg-carbon p-8">
            <button onClick={() => setGuide(false)} className="absolute right-4 top-4 text-white/50 hover:text-giallo" aria-label="Cerrar guía"><X /></button>
            <p className="eyebrow">Guía de tallas</p><h2 className="h-display mt-2 text-4xl">Medidas en cm</h2>
            <table className="mt-6 w-full text-sm">
              <thead><tr className="border-b border-white/10 text-left font-tech text-[9px] tracking-[0.2em] text-white/50"><th className="py-2">Talla</th><th>Pecho</th><th>Cintura</th><th>Altura</th></tr></thead>
              <tbody>{GUIDE.map((r) => <tr key={r[0]} className="border-b border-white/5">{r.map((c, i) => <td key={i} className={cn("py-2.5", i === 0 && "font-semibold text-giallo")}>{c}</td>)}</tr>)}</tbody>
            </table>
            <p className="mt-4 text-xs text-white/40">Si estás entre dos tallas, para un fit oversize elige la mayor.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [o, setO] = useState(open);
  return (
    <div>
      <button onClick={() => setO(!o)} aria-expanded={o} className="flex w-full items-center justify-between py-5 font-tech text-[10px] tracking-[0.25em] uppercase hover:text-giallo">{title}<ChevronDown size={16} className={cn("transition", o && "rotate-180")} /></button>
      {o && <div className="fade-in pb-5">{children}</div>}
    </div>
  );
}
