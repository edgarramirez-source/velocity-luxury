"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem { key: string; productId: string; slug: string; name: string; image: string; price: number; size: string; color: string; quantity: number; maxStock: number }
interface CartState {
  items: CartItem[]; open: boolean; coupon: string | null;
  add: (i: Omit<CartItem, "key">) => void; remove: (key: string) => void; setQty: (key: string, q: number) => void;
  update: (key: string, patch: { size?: string; color?: string; image?: string }) => void; clear: () => void; setOpen: (o: boolean) => void; setCoupon: (c: string | null) => void;
}
const keyOf = (productId: string, size: string, color: string) => `${productId}|${size}|${color}`;

export const useCart = create<CartState>()(persist((set, get) => ({
  items: [], open: false, coupon: null,
  add: (i) => {
    const key = keyOf(i.productId, i.size, i.color);
    const ex = get().items.find((x) => x.key === key);
    if (ex) set({ items: get().items.map((x) => (x.key === key ? { ...x, quantity: Math.min(x.quantity + i.quantity, x.maxStock || 99) } : x)) });
    else set({ items: [...get().items, { ...i, key, quantity: Math.min(i.quantity, i.maxStock || 99) }] });
  },
  remove: (key) => set({ items: get().items.filter((x) => x.key !== key) }),
  setQty: (key, q) => set({ items: get().items.map((x) => (x.key === key ? { ...x, quantity: Math.max(1, Math.min(q, x.maxStock || 99)) } : x)) }),
  update: (key, patch) => {
    const items = get().items; const it = items.find((x) => x.key === key); if (!it) return;
    const next = { ...it, ...patch }; next.key = keyOf(next.productId, next.size, next.color);
    const dup = items.find((x) => x.key === next.key && x.key !== key);
    if (dup) set({ items: items.filter((x) => x.key !== key).map((x) => (x.key === dup.key ? { ...x, quantity: Math.min(x.quantity + it.quantity, x.maxStock || 99) } : x)) });
    else set({ items: items.map((x) => (x.key === key ? next : x)) });
  },
  clear: () => set({ items: [], coupon: null }),
  setOpen: (open) => set({ open }),
  setCoupon: (coupon) => set({ coupon }),
}), { name: "vl-cart", partialize: (s) => ({ items: s.items, coupon: s.coupon }) }));

export const cartCount = (items: CartItem[]) => items.reduce((s, i) => s + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) => Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
