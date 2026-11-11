"use client";
import { useState } from "react";
import { useUI } from "@/store/ui";

export function ContactForm() {
  const toast = useUI((s) => s.toast);
  const [f, setF] = useState({ name: "", email: "", subject: "Consulta sobre un pedido", message: "" });
  const [loading, setLoading] = useState(false); const [sent, setSent] = useState(false); const [error, setError] = useState<string | null>(null);
  if (sent) return <div className="card p-10 text-center"><p className="h-display text-4xl">Mensaje enviado</p><p className="mt-3 text-white/60">Gracias, {f.name.split(" ")[0]}. Te responderemos en menos de 24 horas hábiles.</p><button onClick={() => { setSent(false); setF({ ...f, message: "" }); }} className="btn-outline mt-8">Enviar otro mensaje</button></div>;
  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={async (e) => {
      e.preventDefault(); setLoading(true); setError(null);
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); const j = await r.json(); setLoading(false);
      if (r.ok) { setSent(true); toast({ title: "Mensaje enviado", tone: "success" }); } else setError(j.error);
    }}>
      {error && <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:col-span-2" role="alert">{error}</p>}
      <div><label className="label" htmlFor="c-name">Nombre *</label><input id="c-name" required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div><label className="label" htmlFor="c-email">Correo *</label><input id="c-email" type="email" required className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="c-subject">Asunto *</label>
        <select id="c-subject" className="input" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>{["Consulta sobre un pedido", "Cambios y devoluciones", "Tallas y productos", "Colaboraciones y prensa", "Ventas corporativas", "Otro"].map((s) => <option key={s} className="bg-ink">{s}</option>)}</select></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="c-msg">Mensaje *</label><textarea id="c-msg" required minLength={10} rows={6} className="input" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
      <div><button disabled={loading} className="btn-primary">{loading ? "Enviando..." : "Enviar mensaje"}</button></div>
    </form>
  );
}
