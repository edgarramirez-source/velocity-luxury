"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useUI } from "@/store/ui";
import { ALL_SIZES, cn } from "@/lib/utils";
import { thumb } from "@/lib/media";

export interface ProductFormValue {
  id?: string; name: string; slug: string; description: string; details: string; price: string; compareAt: string; gender: "HOMBRE" | "MUJER" | "UNISEX";
  categoryId: string; collectionId: string; images: string[]; sizes: string[]; colors: { name: string; hex: string; image?: string }[]; stock: string; isNew: boolean; isExclusive: boolean; active: boolean;
}
const PRESET_COLORS = [["Nero", "#111113"], ["Giallo", "#FFD400"], ["Grafito", "#3A3D42"], ["Titanio", "#8C9096"], ["Bianco", "#EEEEEA"], ["Arena", "#B9A88A"], ["Blu Notte", "#1B2540"], ["Rosso", "#8E1B1B"], ["Verde Corsa", "#2F4F38"]];

export function ProductForm({ initial, categories, collections }: { initial: ProductFormValue; categories: { id: string; name: string }[]; collections: { id: string; name: string }[] }) {
  const router = useRouter(); const toast = useUI((s) => s.toast);
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof ProductFormValue>(k: K, v: ProductFormValue[K]) => setF((s) => ({ ...s, [k]: v }));

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const fd = new FormData(); Array.from(files).forEach((file) => fd.append("files", file));
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd }); const j = await r.json(); setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (!r.ok) return toast({ title: "Error al subir", description: j.error, tone: "error" });
    set("images", [...f.images, ...j.urls]); toast({ title: `${j.urls.length} imagen(es) subida(s)`, tone: "success" });
  }
  function move(i: number, d: number) { const a = [...f.images]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set("images", a); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    const body = { ...f, price: Number(f.price), compareAt: f.compareAt ? Number(f.compareAt) : null, stock: Number(f.stock), collectionId: f.collectionId || null };
    if (body.compareAt !== null && body.compareAt <= body.price) return setError("El precio anterior debe ser mayor al precio actual (o déjalo vacío).");
    setSaving(true);
    const r = await fetch(f.id ? `/api/admin/products/${f.id}` : "/api/admin/products", { method: f.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json(); setSaving(false);
    if (!r.ok) { setError(j.error); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    toast({ title: f.id ? "Producto actualizado" : "Producto creado", description: j.product.name, tone: "success" });
    router.push("/admin/productos"); router.refresh();
  }

  const card = "card p-6 space-y-5";
  return (
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      {error && <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 xl:col-span-2" role="alert">{error}</p>}
      <div className="space-y-6">
        <section className={card}>
          <h2 className="font-tech text-[10px] tracking-[0.25em]">INFORMACIÓN</h2>
          <div><label className="label" htmlFor="name">Nombre *</label><input id="name" required className="input" value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><label className="label" htmlFor="slug">URL (slug) — opcional</label><input id="slug" className="input" value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="se genera desde el nombre" /></div>
          <div><label className="label" htmlFor="desc">Descripción *</label><textarea id="desc" required rows={4} className="input" value={f.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div><label className="label" htmlFor="details">Detalles y materiales (uno por línea)</label><textarea id="details" rows={4} className="input" value={f.details} onChange={(e) => set("details", e.target.value)} /></div>
        </section>
        <section className={card}>
          <div className="flex items-center justify-between"><h2 className="font-tech text-[10px] tracking-[0.25em]">IMÁGENES *</h2>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline px-4 py-2"><ImagePlus size={14} />{uploading ? "Subiendo..." : "Subir imágenes"}</button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => upload(e.target.files)} />
          </div>
          <p className="text-xs text-white/40">JPG, PNG, WEBP o AVIF · máx. 5 MB. La primera imagen es la principal.</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {f.images.map((img, i) => (
              <div key={img + i} className={cn("group relative aspect-[4/5] overflow-hidden border", i === 0 ? "border-giallo" : "border-white/10")}>
                <img src={thumb(img)} alt="" className="h-full w-full object-cover" />
                {i === 0 && <span className="badge absolute left-1 top-1 bg-giallo text-black">Principal</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/80 p-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                  <button type="button" onClick={() => move(i, -1)} aria-label="Mover a la izquierda" className="p-1 hover:text-giallo"><ArrowUp size={14} className="-rotate-90" /></button>
                  <button type="button" onClick={() => set("images", f.images.filter((_, k) => k !== i))} aria-label="Quitar imagen" className="p-1 hover:text-red-400"><X size={14} /></button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Mover a la derecha" className="p-1 hover:text-giallo"><ArrowDown size={14} className="-rotate-90" /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => fileRef.current?.click()} className="grid aspect-[4/5] place-items-center border border-dashed border-white/15 text-white/40 hover:border-giallo hover:text-giallo" aria-label="Añadir imagen"><Plus /></button>
          </div>
        </section>
        <section className={card}>
          <h2 className="font-tech text-[10px] tracking-[0.25em]">TALLAS Y COLORES</h2>
          <fieldset><legend className="label">Tallas disponibles *</legend>
            <div className="flex flex-wrap gap-2">{ALL_SIZES.map((s) => { const on = f.sizes.includes(s); return <button type="button" key={s} aria-pressed={on} onClick={() => set("sizes", on ? f.sizes.filter((x) => x !== s) : [...f.sizes, s].sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b)))} className={cn("min-w-14 border px-3 py-2 text-sm", on ? "border-giallo bg-giallo text-black" : "border-white/15 hover:border-white/40")}>{s}</button>; })}</div>
          </fieldset>
          <fieldset><legend className="label">Colores *</legend>
            <div className="space-y-2">
              {f.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={c.hex} onChange={(e) => set("colors", f.colors.map((x, k) => (k === i ? { ...x, hex: e.target.value.toUpperCase() } : x)))} className="h-11 w-12 cursor-pointer border border-white/15 bg-transparent" aria-label={`Color ${i + 1}`} />
                  <input value={c.name} onChange={(e) => set("colors", f.colors.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} className="input py-2" placeholder="Nombre del color" aria-label={`Nombre del color ${i + 1}`} />
                  <select value={c.image ?? ""} onChange={(e) => set("colors", f.colors.map((x, k) => (k === i ? { ...x, image: e.target.value || undefined } : x)))} className="input w-40 py-2" aria-label="Imagen asociada al color"><option value="" className="bg-ink">Sin imagen</option>{f.images.map((img, k) => <option key={img} value={img} className="bg-ink">Imagen {k + 1}</option>)}</select>
                  <button type="button" onClick={() => set("colors", f.colors.filter((_, k) => k !== i))} className="p-2 text-white/40 hover:text-red-400" aria-label="Quitar color"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_COLORS.filter(([n]) => !f.colors.some((c) => c.name === n)).map(([n, h]) => <button type="button" key={n} onClick={() => set("colors", [...f.colors, { name: n, hex: h }])} className="flex items-center gap-2 border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:border-white/40"><span className="h-3 w-3 rounded-full" style={{ background: h }} />{n}</button>)}
              <button type="button" onClick={() => set("colors", [...f.colors, { name: "", hex: "#777777" }])} className="flex items-center gap-1 border border-dashed border-white/20 px-2.5 py-1.5 text-xs text-white/60 hover:border-giallo hover:text-giallo"><Plus size={12} />Personalizado</button>
            </div>
          </fieldset>
        </section>
      </div>

      <div className="space-y-6">
        <section className={card}>
          <h2 className="font-tech text-[10px] tracking-[0.25em]">PRECIO E INVENTARIO</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label" htmlFor="price">Precio (USD) *</label><input id="price" type="number" step="0.01" min="0.01" required className="input" value={f.price} onChange={(e) => set("price", e.target.value)} /></div>
            <div><label className="label" htmlFor="compare">Precio anterior</label><input id="compare" type="number" step="0.01" min="0" className="input" value={f.compareAt} onChange={(e) => set("compareAt", e.target.value)} placeholder="Para ofertas" /></div>
          </div>
          <div><label className="label" htmlFor="stock">Unidades en stock *</label><input id="stock" type="number" min="0" step="1" required className="input" value={f.stock} onChange={(e) => set("stock", e.target.value)} /></div>
        </section>
        <section className={card}>
          <h2 className="font-tech text-[10px] tracking-[0.25em]">ORGANIZACIÓN</h2>
          <div><label className="label" htmlFor="cat">Categoría *</label><select id="cat" required className="input" value={f.categoryId} onChange={(e) => set("categoryId", e.target.value)}><option value="" className="bg-ink">Selecciona...</option>{categories.map((c) => <option key={c.id} value={c.id} className="bg-ink">{c.name}</option>)}</select></div>
          <div><label className="label" htmlFor="col">Colección</label><select id="col" className="input" value={f.collectionId} onChange={(e) => set("collectionId", e.target.value)}><option value="" className="bg-ink">Ninguna</option>{collections.map((c) => <option key={c.id} value={c.id} className="bg-ink">{c.name}</option>)}</select></div>
          <div><label className="label" htmlFor="gender">Género</label><select id="gender" className="input" value={f.gender} onChange={(e) => set("gender", e.target.value as ProductFormValue["gender"])}><option value="UNISEX" className="bg-ink">Unisex</option><option value="HOMBRE" className="bg-ink">Hombre</option><option value="MUJER" className="bg-ink">Mujer</option></select></div>
        </section>
        <section className={card}>
          <h2 className="font-tech text-[10px] tracking-[0.25em]">ETIQUETAS Y VISIBILIDAD</h2>
          {([["isNew", "Etiqueta NUEVO"], ["isExclusive", "Etiqueta EXCLUSIVO"], ["active", "Visible en la tienda"]] as const).map(([k, l]) => (
            <label key={k} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-[#FFD400]" />{l}</label>
          ))}
          <p className="text-xs text-white/40">La etiqueta OFERTA se muestra automáticamente cuando hay precio anterior.</p>
        </section>
        <div className="flex gap-3"><button disabled={saving || uploading} className="btn-primary flex-1">{saving ? "Guardando..." : f.id ? "Guardar cambios" : "Crear producto"}</button><button type="button" onClick={() => router.push("/admin/productos")} className="btn-dark">Cancelar</button></div>
      </div>
    </form>
  );
}
