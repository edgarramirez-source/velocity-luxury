"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useUI } from "@/store/ui";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { Th } from "./ui";

interface C { id: string; code: string; description: string; type: string; value: number; minSubtotal: number; usageLimit: number | null; usedCount: number; active: boolean; expiresAt: string | null }
const EMPTY = { code: "", description: "", type: "PERCENT", value: "10", minSubtotal: "0", usageLimit: "", expiresAt: "" };

export function Coupons({ list }: { list: C[] }) {
  const router = useRouter(); const toast = useUI((s) => s.toast);
  const [f, setF] = useState(EMPTY); const [loading, setLoading] = useState(false);
  async function create(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const r = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: f.code, description: f.description, type: f.type, value: Number(f.value) || 0, minSubtotal: Number(f.minSubtotal) || 0, usageLimit: f.usageLimit ? Number(f.usageLimit) : null, active: true, expiresAt: f.expiresAt || null }) });
    const j = await r.json(); setLoading(false);
    if (!r.ok) return toast({ title: "No se pudo crear", description: j.error, tone: "error" });
    toast({ title: `Código ${j.coupon.code} creado`, tone: "success" }); setF(EMPTY); router.refresh();
  }
  async function toggle(c: C) { await fetch(`/api/admin/coupons/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !c.active }) }); router.refresh(); }
  async function del(c: C) { if (!confirm(`¿Eliminar el código ${c.code}?`)) return; await fetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" }); toast({ title: "Código eliminado", tone: "info" }); router.refresh(); }
  const label = (c: C) => (c.type === "PERCENT" ? `${c.value}%` : c.type === "FIXED" ? formatPrice(c.value) : "Envío gratis");
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/[0.06]"><tr><Th>Código</Th><Th>Beneficio</Th><Th>Mínimo</Th><Th>Usos</Th><Th>Vence</Th><Th>Activo</Th><Th /></tr></thead>
          <tbody>{list.map((c) => { const expired = c.expiresAt && new Date(c.expiresAt) < new Date(); return (
            <tr key={c.id} className="border-b border-white/[0.04]">
              <td className="px-4 py-3"><p className="font-tech text-[11px] tracking-[0.15em] text-giallo">{c.code}</p><p className="text-xs text-white/40">{c.description}</p></td>
              <td className="px-4 py-3">{label(c)}</td><td className="px-4 py-3 text-white/60">{c.minSubtotal ? formatPrice(c.minSubtotal) : "—"}</td>
              <td className="px-4 py-3 text-white/60">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
              <td className={cn("px-4 py-3", expired ? "text-red-400" : "text-white/60")}>{c.expiresAt ? formatDate(c.expiresAt) : "Sin vencimiento"}</td>
              <td className="px-4 py-3"><button onClick={() => toggle(c)} role="switch" aria-checked={c.active} aria-label={`Activar ${c.code}`} className={cn("relative h-6 w-11 rounded-full transition", c.active ? "bg-giallo" : "bg-white/15")}><span className={cn("absolute top-1 h-4 w-4 rounded-full transition-all", c.active ? "left-6 bg-black" : "left-1 bg-white/60")} /></button></td>
              <td className="px-4 py-3 text-right"><button onClick={() => del(c)} className="p-2 text-white/40 hover:text-red-400" aria-label={`Eliminar ${c.code}`}><Trash2 size={15} /></button></td>
            </tr>
          ); })}</tbody>
        </table>
        {list.length === 0 && <p className="p-10 text-center text-white/50">Aún no hay códigos.</p>}
      </div>
      <form onSubmit={create} className="card h-fit space-y-4 p-6">
        <h2 className="font-tech text-[10px] tracking-[0.25em]">NUEVA PROMOCIÓN</h2>
        <div><label className="label" htmlFor="c-code">Código *</label><input id="c-code" required className="input uppercase" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, "") })} placeholder="VERANO25" /></div>
        <div><label className="label" htmlFor="c-desc">Descripción</label><input id="c-desc" className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="c-type">Tipo</label><select id="c-type" className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option value="PERCENT" className="bg-ink">Porcentaje</option><option value="FIXED" className="bg-ink">Monto fijo</option><option value="FREESHIP" className="bg-ink">Envío gratis</option></select></div>
          {f.type !== "FREESHIP" && <div><label className="label" htmlFor="c-val">{f.type === "PERCENT" ? "% descuento" : "Monto USD"}</label><input id="c-val" type="number" min="0" step="0.01" className="input" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} /></div>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="c-min">Compra mínima</label><input id="c-min" type="number" min="0" className="input" value={f.minSubtotal} onChange={(e) => setF({ ...f, minSubtotal: e.target.value })} /></div>
          <div><label className="label" htmlFor="c-lim">Límite de usos</label><input id="c-lim" type="number" min="1" className="input" value={f.usageLimit} onChange={(e) => setF({ ...f, usageLimit: e.target.value })} placeholder="Ilimitado" /></div>
        </div>
        <div><label className="label" htmlFor="c-exp">Fecha de vencimiento</label><input id="c-exp" type="date" className="input" value={f.expiresAt} onChange={(e) => setF({ ...f, expiresAt: e.target.value })} /></div>
        <button disabled={loading} className="btn-primary w-full">{loading ? "Creando..." : "Crear código"}</button>
      </form>
    </div>
  );
}
