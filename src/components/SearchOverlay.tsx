"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useUI } from "@/store/ui";
import { formatPrice } from "@/lib/utils";
import { thumb } from "@/lib/media";

interface Hit { id: string; slug: string; name: string; price: number; image: string; category: string }
const POPULAR = ["Hoodie", "Chaqueta", "Giallo", "Jogger", "Gorra", "Apex"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    setLoading(true);
    const ctl = new AbortController();
    const t = setTimeout(() => fetch(`/api/products/search?q=${encodeURIComponent(q)}`, { signal: ctl.signal }).then((r) => r.json()).then((j) => { setHits(j.results); setLoading(false); }).catch(() => {}), 220);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q]);

  if (!searchOpen) return null;
  const go = (term: string) => { setSearchOpen(false); router.push(`/tienda?q=${encodeURIComponent(term)}`); };

  return (
    <div className="fixed inset-0 z-[90] fade-in bg-ink/95 backdrop-blur-2xl" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <div className="container-x pt-8">
        <div className="flex justify-end"><button onClick={() => setSearchOpen(false)} className="p-2 text-white/60 hover:text-giallo" aria-label="Cerrar búsqueda"><X size={28} /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(q.trim()); }} className="mx-auto mt-8 max-w-4xl">
          <p className="eyebrow">Buscar</p>
          <div className="mt-4 flex items-center gap-4 border-b-2 border-white/15 pb-4 focus-within:border-giallo transition">
            <Search className="text-giallo shrink-0" size={30} />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="¿Qué estás buscando?" className="w-full bg-transparent font-display text-4xl font-bold uppercase outline-none placeholder:text-white/20 sm:text-6xl" aria-label="Término de búsqueda" />
          </div>
        </form>
        <div className="mx-auto mt-10 max-w-4xl">
          {q.trim().length < 2 ? (
            <div>
              <p className="font-tech text-[10px] tracking-[0.3em] text-white/40">BÚSQUEDAS POPULARES</p>
              <div className="mt-4 flex flex-wrap gap-2">{POPULAR.map((p) => <button key={p} onClick={() => setQ(p)} className="border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-giallo hover:text-giallo">{p}</button>)}</div>
            </div>
          ) : loading && !hits.length ? <p className="text-white/40">Buscando...</p> : hits.length === 0 ? <p className="text-white/50">Sin resultados para “{q}”. Prueba con otro término.</p> : (
            <>
              <ul className="grid gap-3 sm:grid-cols-2">
                {hits.map((h) => (
                  <li key={h.id}><Link href={`/producto/${h.slug}`} onClick={() => setSearchOpen(false)} className="group flex items-center gap-4 border border-white/5 bg-white/[0.02] p-3 transition hover:border-giallo/50">
                    <img src={thumb(h.image)} alt="" className="h-20 w-16 object-cover" />
                    <div><p className="font-tech text-[9px] tracking-[0.2em] text-white/40 uppercase">{h.category}</p><p className="mt-1 font-semibold group-hover:text-giallo transition">{h.name}</p><p className="text-sm text-white/60">{formatPrice(h.price)}</p></div>
                  </Link></li>
                ))}
              </ul>
              <button onClick={() => go(q)} className="btn-outline mt-8">Ver todos los resultados</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
