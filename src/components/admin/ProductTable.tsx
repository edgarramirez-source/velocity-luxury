"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useUI } from "@/store/ui";
import { cn, formatPrice } from "@/lib/utils";
import { Th } from "./ui";
import { thumb } from "@/lib/media";

interface Row { id: string; slug: string; name: string; image: string; category: string; price: number; compareAt: number | null; stock: number; active: boolean; soldCount: number; isNew: boolean; isExclusive: boolean }

export function ProductTable({ rows, categories }: { rows: Row[]; categories: string[] }) {
  const router = useRouter(); const toast = useUI((s) => s.toast);
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [status, setStatus] = useState("");
  const [stock, setStock] = useState<Record<string, string>>({});
  const list = useMemo(() => rows.filter((r) => (!q || r.name.toLowerCase().includes(q.toLowerCase())) && (!cat || r.category === cat) && (!status || (status === "activo" ? r.active : status === "inactivo" ? !r.active : r.stock <= 10))), [rows, q, cat, status]);

  async function patch(id: string, body: object, msg: string) {
    const r = await fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) { toast({ title: msg, tone: "success" }); router.refresh(); } else toast({ title: "Error al actualizar", tone: "error" });
  }
  async function del(r: Row) {
    if (!confirm(`¿Eliminar "${r.name}"? Esta acción no se puede deshacer. Los pedidos históricos se conservan.`)) return;
    const res = await fetch(`/api/admin/products/${r.id}`, { method: "DELETE" });
    if (res.ok) { toast({ title: "Producto eliminado", tone: "info" }); router.refresh(); } else toast({ title: "No se pudo eliminar", tone: "error" });
  }

  return (
    <div className="card">
      <div className="flex flex-wrap gap-3 border-b border-white/[0.06] p-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto..." className="input max-w-xs py-2" aria-label="Buscar producto" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input w-auto py-2" aria-label="Filtrar por categoría"><option value="" className="bg-ink">Todas las categorías</option>{categories.map((c) => <option key={c} className="bg-ink">{c}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto py-2" aria-label="Filtrar por estado"><option value="" className="bg-ink">Todos los estados</option><option value="activo" className="bg-ink">Activos</option><option value="inactivo" className="bg-ink">Ocultos</option><option value="bajo" className="bg-ink">Stock bajo (≤10)</option></select>
        <p className="ml-auto self-center text-xs text-white/40">{list.length} de {rows.length}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/[0.06]"><tr><Th>Producto</Th><Th>Categoría</Th><Th>Precio</Th><Th>Inventario</Th><Th>Vendidos</Th><Th>Visible</Th><Th className="text-right">Acciones</Th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={thumb(r.image)} alt="" className="h-14 w-11 object-cover" /><div><Link href={`/admin/productos/${r.id}`} className="font-semibold hover:text-giallo">{r.name}</Link><div className="mt-1 flex gap-1">{r.isNew && <span className="badge bg-white/10 py-0.5 text-white/70">Nuevo</span>}{r.isExclusive && <span className="badge bg-giallo/15 py-0.5 text-giallo">Exclusivo</span>}{r.compareAt && r.compareAt > r.price && <span className="badge bg-giallo py-0.5 text-black">Oferta</span>}</div></div></div></td>
                <td className="px-4 py-3 text-white/60">{r.category}</td>
                <td className="px-4 py-3">{formatPrice(r.price)}{r.compareAt && <span className="ml-2 text-xs text-white/40 line-through">{formatPrice(r.compareAt)}</span>}</td>
                <td className="px-4 py-3">
                  <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); const v = Number(stock[r.id]); if (Number.isInteger(v) && v >= 0) patch(r.id, { stock: v }, `Stock de ${r.name}: ${v}`); }}>
                    <input type="number" min={0} value={stock[r.id] ?? r.stock} onChange={(e) => setStock({ ...stock, [r.id]: e.target.value })} className={cn("w-20 border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-giallo", r.stock === 0 ? "border-red-500/50 text-red-300" : r.stock <= 10 ? "border-giallo/50 text-giallo" : "border-white/15")} aria-label={`Stock de ${r.name}`} />
                    {stock[r.id] !== undefined && Number(stock[r.id]) !== r.stock && <button className="text-xs text-giallo hover:underline">Guardar</button>}
                  </form>
                </td>
                <td className="px-4 py-3 text-white/60">{r.soldCount}</td>
                <td className="px-4 py-3"><button onClick={() => patch(r.id, { active: !r.active }, r.active ? "Producto ocultado" : "Producto publicado")} role="switch" aria-checked={r.active} aria-label={`Visibilidad de ${r.name}`} className={cn("relative h-6 w-11 rounded-full transition", r.active ? "bg-giallo" : "bg-white/15")}><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-black transition-all", r.active ? "left-6" : "left-1 bg-white/60")} /></button></td>
                <td className="px-4 py-3"><div className="flex justify-end gap-1">
                  <Link href={`/producto/${r.slug}`} target="_blank" className="p-2 text-white/50 hover:text-white" aria-label={`Ver ${r.name} en la tienda`} title="Ver en tienda"><Eye size={16} /></Link>
                  <Link href={`/admin/productos/${r.id}`} className="p-2 text-white/50 hover:text-giallo" aria-label={`Editar ${r.name}`} title="Editar"><Pencil size={16} /></Link>
                  <button onClick={() => del(r)} className="p-2 text-white/50 hover:text-red-400" aria-label={`Eliminar ${r.name}`} title="Eliminar"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-10 text-center text-white/50">No hay productos que coincidan.</p>}
      </div>
    </div>
  );
}
