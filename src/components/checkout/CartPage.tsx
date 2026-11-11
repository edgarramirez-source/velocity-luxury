"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";
import { computeTotals, SHIPPING_METHODS, FREE_SHIPPING_FROM } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { useCartOptions, useCoupon, useMounted } from "./hooks";
import { CouponBox } from "./CouponBox";
import { thumb } from "@/lib/media";

export function CartPage() {
  const mounted = useMounted();
  const { items, remove, setQty, update, clear } = useCart();
  const opts = useCartOptions();
  const c = useCoupon();
  const [ship, setShip] = useState("standard");
  if (!mounted) return <div className="container-x min-h-[50vh] py-20" />;
  const subtotal = cartSubtotal(items);
  const t = computeTotals(subtotal, ship, c.coupon);

  if (!items.length) return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <ShoppingBag size={56} className="text-white/15" />
      <h1 className="h-display text-6xl">Tu carrito está vacío</h1>
      <p className="text-white/50">El próximo icono de tu armario te espera.</p>
      <Link href="/tienda" className="btn-primary">Explorar colección</Link>
    </div>
  );

  return (
    <div className="container-x py-14">
      <p className="eyebrow">Carrito</p>
      <h1 className="h-display mt-3 text-6xl">Tu selección <span className="text-giallo">({cartCount(items)})</span></h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {items.map((it) => {
              const o = opts[it.productId];
              return (
                <li key={it.key} className="grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr_auto]">
                  <Link href={`/producto/${it.slug}`}><img src={thumb(it.image)} alt={it.name} className="aspect-[4/5] w-full object-cover" /></Link>
                  <div className="min-w-0">
                    <Link href={`/producto/${it.slug}`} className="font-semibold hover:text-giallo">{it.name}</Link>
                    <p className="mt-1 text-sm text-white/50">{formatPrice(it.price)} c/u</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <label className="flex flex-col"><span className="label mb-1">Talla</span>
                        <select value={it.size} onChange={(e) => update(it.key, { size: e.target.value })} className="border border-white/15 bg-ink px-3 py-2 text-sm outline-none focus:border-giallo">
                          {(o?.sizes ?? [it.size]).map((s) => <option key={s}>{s}</option>)}
                        </select></label>
                      <label className="flex flex-col"><span className="label mb-1">Color</span>
                        <select value={it.color} onChange={(e) => { const col = o?.colors.find((x) => x.name === e.target.value); update(it.key, { color: e.target.value, image: col?.image ?? it.image }); }} className="border border-white/15 bg-ink px-3 py-2 text-sm outline-none focus:border-giallo">
                          {(o?.colors.map((x) => x.name) ?? [it.color]).map((s) => <option key={s}>{s}</option>)}
                        </select></label>
                      <div className="flex flex-col"><span className="label mb-1">Cantidad</span>
                        <div className="flex items-center border border-white/15">
                          <button onClick={() => setQty(it.key, it.quantity - 1)} disabled={it.quantity <= 1} className="p-2.5 hover:text-giallo disabled:opacity-30" aria-label="Disminuir"><Minus size={12} /></button>
                          <span className="w-8 text-center text-sm">{it.quantity}</span>
                          <button onClick={() => setQty(it.key, it.quantity + 1)} disabled={it.quantity >= it.maxStock} className="p-2.5 hover:text-giallo disabled:opacity-30" aria-label="Aumentar"><Plus size={12} /></button>
                        </div></div>
                    </div>
                    {o && o.stock < it.quantity && <p className="mt-2 text-xs text-red-400">Solo hay {o.stock} unidades disponibles.</p>}
                  </div>
                  <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
                    <p className="font-display text-2xl font-bold">{formatPrice(it.price * it.quantity)}</p>
                    <button onClick={() => remove(it.key)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400"><Trash2 size={14} /> Eliminar</button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap justify-between gap-4">
            <Link href="/tienda" className="btn-dark"><ArrowLeft size={14} /> Continuar comprando</Link>
            <button onClick={() => { if (confirm("¿Vaciar el carrito?")) clear(); }} className="font-tech text-[10px] tracking-[0.2em] text-white/40 hover:text-red-400">VACIAR CARRITO</button>
          </div>
        </div>

        <aside className="h-fit space-y-6 border border-white/[0.08] bg-carbon p-7 lg:sticky lg:top-28" aria-label="Resumen">
          <h2 className="font-tech text-xs tracking-[0.3em]">RESUMEN DEL PEDIDO</h2>
          <CouponBox c={c} />
          <fieldset>
            <legend className="label">Estimar envío</legend>
            <div className="space-y-2">
              {SHIPPING_METHODS.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center justify-between border px-4 py-3 text-sm transition ${ship === m.id ? "border-giallo" : "border-white/10 hover:border-white/30"}`}>
                  <span className="flex items-center gap-3"><input type="radio" name="ship" checked={ship === m.id} onChange={() => setShip(m.id)} className="accent-[#FFD400]" />{m.name}</span>
                  <span className="text-white/70">{m.id === "standard" && subtotal >= FREE_SHIPPING_FROM ? "Gratis" : m.price ? formatPrice(m.price) : "Gratis"}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <dl className="space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>{formatPrice(t.subtotal)}</dd></div>
            {t.discount > 0 && <div className="flex justify-between text-giallo"><dt>Descuento ({c.coupon?.code})</dt><dd>−{formatPrice(t.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-white/60">Envío</dt><dd>{t.shipping ? formatPrice(t.shipping) : "Gratis"}</dd></div>
            <div className="flex items-baseline justify-between border-t border-white/10 pt-4"><dt className="font-tech text-[10px] tracking-[0.25em]">TOTAL</dt><dd className="font-display text-3xl font-bold">{formatPrice(t.total)}</dd></div>
          </dl>
          <Link href="/checkout" className="btn-primary w-full"><Lock size={14} /> Finalizar compra</Link>
          <p className="text-center text-xs text-white/40">IVA incluido · Pago 100% seguro</p>
        </aside>
      </div>
    </div>
  );
}
