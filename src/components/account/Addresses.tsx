"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2, Star } from "lucide-react";
import { useUI } from "@/store/ui";

interface A { id: string; label: string; fullName: string; phone: string; line1: string; line2: string | null; city: string; province: string; postalCode: string | null; country: string; isDefault: boolean }
const EMPTY = { label: "Casa", fullName: "", phone: "", line1: "", line2: "", city: "", province: "Pichincha", postalCode: "", country: "Ecuador", isDefault: false };

export function Addresses({ initial }: { initial: A[] }) {
  const router = useRouter(); const toast = useUI((s) => s.toast);
  const [editing, setEditing] = useState<string | "new" | null>(initial.length ? null : "new");
  const [f, setF] = useState(EMPTY); const [loading, setLoading] = useState(false);
  function edit(a?: A) { setEditing(a ? a.id : "new"); setF(a ? { ...a, line2: a.line2 ?? "", postalCode: a.postalCode ?? "" } : EMPTY); }
  async function save(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const r = await fetch(editing === "new" ? "/api/account/addresses" : `/api/account/addresses/${editing}`, { method: editing === "new" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setLoading(false);
    if (!r.ok) return toast({ title: "Revisa los datos", description: j.error, tone: "error" });
    toast({ title: "Dirección guardada", tone: "success" }); setEditing(null); router.refresh();
  }
  async function del(id: string) {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const r = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (r.ok) { toast({ title: "Dirección eliminada", tone: "info" }); router.refresh(); }
  }
  async function makeDefault(a: A) {
    await fetch(`/api/account/addresses/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...a, line2: a.line2 ?? "", postalCode: a.postalCode ?? "", isDefault: true }) });
    router.refresh();
  }
  const inp = (k: keyof typeof EMPTY, label: string, cls = "") => (
    <div className={cls}><label className="label" htmlFor={`a-${k}`}>{label}</label><input id={`a-${k}`} className="input" value={String(f[k] ?? "")} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
  );
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {initial.map((a) => (
          <div key={a.id} className={`card relative p-6 ${a.isDefault ? "border-giallo/40" : ""}`}>
            <div className="flex items-center justify-between"><p className="flex items-center gap-2 font-tech text-[10px] tracking-[0.2em] text-giallo"><MapPin size={14} />{a.label.toUpperCase()}</p>{a.isDefault && <span className="badge bg-giallo text-black">Predeterminada</span>}</div>
            <p className="mt-4 font-semibold">{a.fullName}</p>
            <p className="text-sm text-white/60">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
            <p className="text-sm text-white/60">{a.city}, {a.province} {a.postalCode} · {a.country}</p>
            <p className="text-sm text-white/60">{a.phone}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs">
              <button onClick={() => edit(a)} className="flex items-center gap-1 text-white/60 hover:text-giallo"><Pencil size={13} />Editar</button>
              {!a.isDefault && <button onClick={() => makeDefault(a)} className="flex items-center gap-1 text-white/60 hover:text-giallo"><Star size={13} />Predeterminar</button>}
              <button onClick={() => del(a.id)} className="flex items-center gap-1 text-white/60 hover:text-red-400"><Trash2 size={13} />Eliminar</button>
            </div>
          </div>
        ))}
        {editing === null && <button onClick={() => edit()} className="grid min-h-48 place-items-center border border-dashed border-white/15 text-white/50 transition hover:border-giallo hover:text-giallo"><span className="flex items-center gap-2 font-tech text-[10px] tracking-[0.2em]"><Plus size={16} />NUEVA DIRECCIÓN</span></button>}
      </div>
      {editing !== null && (
        <form onSubmit={save} className="card fade-in grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <h2 className="font-tech text-xs tracking-[0.3em] sm:col-span-2">{editing === "new" ? "NUEVA DIRECCIÓN" : "EDITAR DIRECCIÓN"}</h2>
          {inp("label", "Etiqueta (Casa, Oficina...)")}{inp("fullName", "Nombre de quien recibe")}{inp("phone", "Teléfono")}{inp("line1", "Dirección")}{inp("line2", "Referencia")}{inp("city", "Ciudad")}{inp("province", "Provincia")}{inp("postalCode", "Código postal")}
          <label className="flex items-center gap-3 text-sm text-white/70 sm:col-span-2"><input type="checkbox" checked={f.isDefault} onChange={(e) => setF({ ...f, isDefault: e.target.checked })} className="h-4 w-4 accent-[#FFD400]" />Usar como dirección predeterminada</label>
          <div className="flex gap-3 sm:col-span-2"><button disabled={loading} className="btn-primary">{loading ? "Guardando..." : "Guardar dirección"}</button>{initial.length > 0 && <button type="button" onClick={() => setEditing(null)} className="btn-dark">Cancelar</button>}</div>
        </form>
      )}
    </div>
  );
}
