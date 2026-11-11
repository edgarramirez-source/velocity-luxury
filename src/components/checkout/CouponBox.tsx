"use client";
import { useState } from "react";
import { Tag, X } from "lucide-react";
import type { useCoupon } from "./hooks";

export function CouponBox({ c }: { c: ReturnType<typeof useCoupon> }) {
  const [code, setCode] = useState("");
  if (c.coupon) return (
    <div className="flex items-center justify-between border border-giallo/40 bg-giallo/5 px-4 py-3">
      <div className="flex items-center gap-3"><Tag size={16} className="text-giallo" /><div><p className="font-tech text-[10px] tracking-[0.2em] text-giallo">{c.coupon.code}</p>{c.coupon.description && <p className="text-xs text-white/50">{c.coupon.description}</p>}</div></div>
      <button onClick={c.remove} className="text-white/50 hover:text-white" aria-label="Quitar código"><X size={16} /></button>
    </div>
  );
  return (
    <form onSubmit={async (e) => { e.preventDefault(); if (code.trim() && (await c.apply(code.trim()))) setCode(""); }}>
      <label htmlFor="coupon" className="label">Código de descuento</label>
      <div className="flex gap-2">
        <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="VELOCITY10" className="input uppercase" />
        <button disabled={c.loading || !code.trim()} className="btn-outline px-5">{c.loading ? "..." : "Aplicar"}</button>
      </div>
      {c.error && <p className="mt-2 text-xs text-red-400" role="alert">{c.error}</p>}
    </form>
  );
}
