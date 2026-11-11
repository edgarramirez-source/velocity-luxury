"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { CatalogResult } from "@/lib/catalog";
import { SORTS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function useParamsUpdater() {
  const router = useRouter(); const pathname = usePathname(); const sp = useSearchParams();
  const [pending, start] = useTransition();
  const update = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null || v === "") p.delete(k); else p.set(k, v); }
    if (!("pagina" in patch)) p.delete("pagina");
    start(() => router.push(`${pathname}${p.toString() ? `?${p}` : ""}`, { scroll: false }));
  };
  return { update, pending, sp };
}

function toggleIn(listStr: string | null, v: string) {
  const l = (listStr ?? "").split(",").filter(Boolean);
  const n = l.includes(v) ? l.filter((x) => x !== v) : [...l, v];
  return n.join(",") || null;
}

export function SortSelect({ value }: { value: string }) {
  const { update } = useParamsUpdater();
  return (
    <label className="flex items-center gap-3">
      <span className="hidden font-tech text-[9px] tracking-[0.2em] text-white/40 sm:block">ORDENAR</span>
      <select value={value} onChange={(e) => update({ orden: e.target.value === "destacados" ? null : e.target.value })} className="border border-white/15 bg-ink px-3 py-2.5 text-sm outline-none focus:border-giallo" aria-label="Ordenar productos">
        {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
    </label>
  );
}

export function Filters({ facets, active, hideCategory = false, hideOffer = false }: { facets: CatalogResult["facets"]; active: CatalogResult["active"]; hideCategory?: boolean; hideOffer?: boolean }) {
  const { update, pending, sp } = useParamsUpdater();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(active.min?.toString() ?? "");
  const [max, setMax] = useState(active.max?.toString() ?? "");
  useEffect(() => { setMin(active.min?.toString() ?? ""); setMax(active.max?.toString() ?? ""); }, [active.min, active.max]);
  const activeCount = active.cats.length + active.sizes.length + active.colors.length + (active.min ? 1 : 0) + (active.max ? 1 : 0) + (active.genero ? 1 : 0) + (active.exclusivo ? 1 : 0) + (active.nuevo ? 1 : 0) + (!hideOffer && active.oferta ? 1 : 0) + (active.q ? 1 : 0);
  const PRESETS = [[0, 100], [100, 200], [200, 400], [400, 0]];

  const body = (
    <div className={cn("space-y-9 transition-opacity", pending && "opacity-60")}>
      <div>
        <label htmlFor="f-q" className="label">Buscar</label>
        <form onSubmit={(e) => { e.preventDefault(); update({ q: (new FormData(e.currentTarget).get("q") as string) || null }); }}>
          <input id="f-q" name="q" defaultValue={active.q} key={active.q} placeholder="Nombre, color..." className="input" />
        </form>
      </div>
      <fieldset>
        <legend className="label">Género</legend>
        <div className="flex flex-wrap gap-2">
          {[["", "Todos"], ["HOMBRE", "Hombre"], ["MUJER", "Mujer"]].map(([v, l]) => (
            <button key={l} onClick={() => update({ genero: v || null })} aria-pressed={active.genero === v} className={cn("border px-3 py-2 text-xs transition", active.genero === v ? "border-giallo bg-giallo text-black" : "border-white/15 hover:border-white/40")}>{l}</button>
          ))}
        </div>
      </fieldset>
      {!hideCategory && (
        <fieldset>
          <legend className="label">Categoría</legend>
          <ul className="space-y-2.5">
            {facets.categories.map((c) => (
              <li key={c.slug}><label className="flex cursor-pointer items-center gap-3 text-sm text-white/75 hover:text-white">
                <input type="checkbox" className="h-4 w-4 accent-[#FFD400]" checked={active.cats.includes(c.slug)} onChange={() => update({ categoria: toggleIn(sp.get("categoria"), c.slug) })} />{c.name}
              </label></li>
            ))}
          </ul>
        </fieldset>
      )}
      <fieldset>
        <legend className="label">Precio (USD)</legend>
        <div className="mb-3 flex flex-wrap gap-2">
          {PRESETS.map(([a, b]) => { const on = (active.min ?? 0) === a && (active.max ?? 0) === b; return (
            <button key={`${a}-${b}`} onClick={() => update({ min: a ? String(a) : null, max: b ? String(b) : null })} aria-pressed={on} className={cn("border px-2.5 py-1.5 text-xs transition", on ? "border-giallo text-giallo" : "border-white/15 text-white/70 hover:border-white/40")}>{b ? (a ? `$${a}–$${b}` : `< $${b}`) : `> $${a}`}</button>
          ); })}
        </div>
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); update({ min: min || null, max: max || null }); }}>
          <input type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} placeholder="Mín" className="input py-2" aria-label="Precio mínimo" />
          <span className="text-white/30">—</span>
          <input type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} placeholder={`Máx ${facets.maxPrice}`} className="input py-2" aria-label="Precio máximo" />
          <button className="border border-white/20 px-3 py-2 text-xs hover:border-giallo hover:text-giallo">OK</button>
        </form>
      </fieldset>
      <fieldset>
        <legend className="label">Talla</legend>
        <div className="grid grid-cols-4 gap-2">
          {facets.sizes.map((s) => <button key={s} onClick={() => update({ talla: toggleIn(sp.get("talla"), s) })} aria-pressed={active.sizes.includes(s)} className={cn("border py-2 text-xs transition", active.sizes.includes(s) ? "border-giallo bg-giallo text-black" : "border-white/15 hover:border-white/40")}>{s}</button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">Color</legend>
        <div className="flex flex-wrap gap-3">
          {facets.colors.map((c) => (
            <button key={c.name} onClick={() => update({ color: toggleIn(sp.get("color"), c.name) })} aria-pressed={active.colors.includes(c.name)} title={c.name} className="group flex flex-col items-center gap-1.5">
              <span className={cn("h-8 w-8 rounded-full border transition", active.colors.includes(c.name) ? "ring-2 ring-giallo ring-offset-2 ring-offset-ink border-transparent" : "border-white/25 group-hover:scale-110")} style={{ background: c.hex }} />
              <span className="text-[10px] text-white/50">{c.name}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-2.5">
        <legend className="label">Destacados</legend>
        {([["nuevo", "Solo novedades", active.nuevo], ["exclusivo", "Solo exclusivos", active.exclusivo], ...(hideOffer ? [] : [["oferta", "Solo ofertas", active.oferta]])] as [string, string, boolean][]).map(([k, l, on]) => (
          <label key={k} className="flex cursor-pointer items-center gap-3 text-sm text-white/75"><input type="checkbox" className="h-4 w-4 accent-[#FFD400]" checked={on} onChange={() => update({ [k]: on ? null : "1" })} />{l}</label>
        ))}
      </fieldset>
    </div>
  );

  return (
    <>
      <div className="lg:hidden"><button onClick={() => setOpen(true)} className="btn-outline px-4 py-2.5"><SlidersHorizontal size={14} /> Filtros {activeCount > 0 && <span className="text-giallo">({activeCount})</span>}</button></div>
      <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] self-start overflow-y-auto pr-4 lg:block" aria-label="Filtros">
        <div className="mb-6 flex items-center justify-between"><h2 className="font-tech text-[11px] tracking-[0.3em]">FILTROS</h2>{activeCount > 0 && <ClearButton />}</div>
        {body}
      </aside>
      {open && (
        <div className="fixed inset-0 z-[85] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <div className="absolute inset-0 bg-black/70 fade-in" onClick={() => setOpen(false)} />
          <div className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-carbon">
            <div className="flex items-center justify-between border-b border-white/10 p-5"><h2 className="font-tech text-xs tracking-[0.3em]">FILTROS</h2><button onClick={() => setOpen(false)} aria-label="Cerrar filtros"><X /></button></div>
            <div className="flex-1 overflow-y-auto p-5">{body}</div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-5"><ClearButton asButton /><button onClick={() => setOpen(false)} className="btn-primary px-3">Ver resultados</button></div>
          </div>
        </div>
      )}
    </>
  );
}

function ClearButton({ asButton = false }: { asButton?: boolean }) {
  const router = useRouter(); const pathname = usePathname(); const sp = useSearchParams();
  const keep = new URLSearchParams(); if (sp.get("orden")) keep.set("orden", sp.get("orden")!);
  return <button onClick={() => router.push(`${pathname}${keep.toString() ? `?${keep}` : ""}`, { scroll: false })} className={asButton ? "btn-outline px-3" : "font-tech text-[9px] tracking-[0.2em] text-giallo hover:underline"}>LIMPIAR</button>;
}

export function Pagination({ page, pages }: { page: number; pages: number }) {
  const { update } = useParamsUpdater();
  if (pages <= 1) return null;
  return (
    <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Paginación">
      <button disabled={page <= 1} onClick={() => update({ pagina: String(page - 1) })} className="border border-white/15 px-4 py-2.5 text-sm disabled:opacity-30 hover:border-giallo">Anterior</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => update({ pagina: n === 1 ? null : String(n) })} aria-current={n === page ? "page" : undefined} className={cn("h-10 w-10 border text-sm", n === page ? "border-giallo bg-giallo text-black" : "border-white/15 hover:border-white/40")}>{n}</button>
      ))}
      <button disabled={page >= pages} onClick={() => update({ pagina: String(page + 1) })} className="border border-white/15 px-4 py-2.5 text-sm disabled:opacity-30 hover:border-giallo">Siguiente</button>
    </nav>
  );
}
