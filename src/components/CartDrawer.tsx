"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cartSubtotal, useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_FROM } from "@/lib/shipping";
import { thumb } from "@/lib/media";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty } = useCart();
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open, setOpen]);
  if (!open) return null;
  const subtotal = cartSubtotal(items);
  const remaining = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="absolute inset-0 fade-in bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-carbon">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-tech text-xs tracking-[0.3em]">TU CARRITO <span className="text-giallo">({items.reduce((s, i) => s + i.quantity, 0)})</span></h2>
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-giallo" aria-label="Cerrar carrito"><X size={22} /></button>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            <ShoppingBag size={48} className="text-white/15" />
            <p className="font-display text-3xl font-bold uppercase">Tu garaje está vacío</p>
            <p className="text-sm text-white/50">Descubre piezas diseñadas para destacar.</p>
            <Link href="/tienda" onClick={() => setOpen(false)} className="btn-primary">Explorar colección</Link>
          </div>
        ) : (
          <>
            <div className="border-b border-white/10 px-6 py-4">
              <p className="text-xs text-white/60">{remaining > 0 ? <>Te faltan <b className="text-giallo">{formatPrice(remaining)}</b> para el envío gratis</> : <span className="text-giallo">¡Tienes envío estándar gratis!</span>}</p>
              <div className="mt-2 h-1 bg-white/10"><div className="h-full bg-giallo transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }} /></div>
            </div>
            <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-6">
              {items.map((it) => (
                <li key={it.key} className="flex gap-4 py-5">
                  <Link href={`/producto/${it.slug}`} onClick={() => setOpen(false)}><img src={thumb(it.image)} alt={it.name} className="h-28 w-[88px] object-cover" /></Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2"><Link href={`/producto/${it.slug}`} onClick={() => setOpen(false)} className="text-sm font-semibold hover:text-giallo">{it.name}</Link><p className="text-sm">{formatPrice(it.price * it.quantity)}</p></div>
                    <p className="mt-1 text-xs text-white/50">Talla {it.size} · {it.color}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-white/15">
                        <button onClick={() => setQty(it.key, it.quantity - 1)} disabled={it.quantity <= 1} className="p-2 hover:text-giallo disabled:opacity-30" aria-label="Disminuir cantidad"><Minus size={12} /></button>
                        <span className="w-8 text-center text-sm">{it.quantity}</span>
                        <button onClick={() => setQty(it.key, it.quantity + 1)} disabled={it.quantity >= it.maxStock} className="p-2 hover:text-giallo disabled:opacity-30" aria-label="Aumentar cantidad"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => remove(it.key)} className="flex items-center gap-1 text-xs text-white/40 hover:text-red-400" aria-label={`Eliminar ${it.name}`}><Trash2 size={14} /> Eliminar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-white/10 p-6">
              <div className="flex justify-between"><span className="font-tech text-[10px] tracking-[0.25em] text-white/60">SUBTOTAL</span><span className="font-display text-2xl font-bold">{formatPrice(subtotal)}</span></div>
              <p className="text-xs text-white/40">Envío y descuentos se calculan en el siguiente paso.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full">Finalizar compra</Link>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/carrito" onClick={() => setOpen(false)} className="btn-outline px-2">Ver carrito</Link>
                <button onClick={() => setOpen(false)} className="btn-dark px-2">Seguir comprando</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
