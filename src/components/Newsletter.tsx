"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useUI } from "@/store/ui";

export function Newsletter({ large = false }: { large?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useUI((s) => s.toast);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const j = await r.json(); setLoading(false);
    if (r.ok) { toast({ title: "Suscripción confirmada", description: "Recibirás lanzamientos y accesos anticipados.", tone: "success" }); setEmail(""); }
    else toast({ title: "No se pudo suscribir", description: j.error, tone: "error" });
  }
  return (
    <form onSubmit={submit} className={large ? "flex w-full max-w-xl flex-col gap-3 sm:flex-row" : "flex border-b border-white/20 focus-within:border-giallo transition"}>
      <label htmlFor={large ? "nl-lg" : "nl"} className="sr-only">Correo electrónico</label>
      <input id={large ? "nl-lg" : "nl"} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu correo electrónico" className={large ? "input flex-1" : "flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-white/30"} />
      {large ? <button disabled={loading} className="btn-primary">{loading ? "Enviando..." : "Suscribirme"}</button>
        : <button disabled={loading} aria-label="Suscribirme" className="px-2 text-giallo transition hover:translate-x-1"><ArrowRight size={18} /></button>}
    </form>
  );
}
