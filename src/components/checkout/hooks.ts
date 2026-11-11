"use client";
import { useEffect, useState } from "react";
import { cartSubtotal, useCart } from "@/store/cart";
import type { CouponLike } from "@/lib/shipping";

export interface ProductOptions { id: string; price: number; stock: number; active: boolean; sizes: string[]; colors: { name: string; hex: string; image?: string }[]; image: string }

export function useMounted() { const [m, setM] = useState(false); useEffect(() => setM(true), []); return m; }

/** Sincroniza precios/stock del carrito con la base de datos y devuelve las opciones de cada producto. */
export function useCartOptions() {
  const items = useCart((s) => s.items);
  const [opts, setOpts] = useState<Record<string, ProductOptions>>({});
  const ids = [...new Set(items.map((i) => i.productId))].sort().join(",");
  useEffect(() => {
    if (!ids) return;
    fetch(`/api/cart/options?ids=${ids}`).then((r) => r.json()).then((j: { products: ProductOptions[] }) => {
      const map: Record<string, ProductOptions> = {}; j.products.forEach((p) => (map[p.id] = p)); setOpts(map);
      const st = useCart.getState();
      useCart.setState({ items: st.items.filter((i) => map[i.productId]?.active !== false && map[i.productId]).map((i) => ({ ...i, price: map[i.productId].price, maxStock: map[i.productId].stock, quantity: Math.min(i.quantity, Math.max(1, map[i.productId].stock)) })) });
    });
  }, [ids]);
  return opts;
}

export function useCoupon() {
  const { items, coupon: code, setCoupon } = useCart();
  const subtotal = cartSubtotal(items);
  const [coupon, setInfo] = useState<(CouponLike & { description?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function apply(c: string) {
    setLoading(true); setError(null);
    const r = await fetch("/api/coupons/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: c, subtotal }) });
    const j = await r.json(); setLoading(false);
    if (!r.ok) { setError(j.error); setInfo(null); setCoupon(null); return false; }
    setInfo(j.coupon); setCoupon(j.coupon.code); return true;
  }
  useEffect(() => { if (code && subtotal > 0) apply(code); else setInfo(null); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, subtotal]);
  return { coupon, error, loading, apply, remove: () => { setCoupon(null); setInfo(null); setError(null); } };
}
