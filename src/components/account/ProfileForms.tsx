"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUI } from "@/store/ui";

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [f, setF] = useState({ name, phone }); const [loading, setLoading] = useState(false);
  const toast = useUI((s) => s.toast); const router = useRouter();
  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={async (e) => {
      e.preventDefault(); setLoading(true);
      const r = await fetch("/api/account/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); const j = await r.json(); setLoading(false);
      if (r.ok) { toast({ title: "Perfil actualizado", tone: "success" }); router.refresh(); } else toast({ title: "Error", description: j.error, tone: "error" });
    }}>
      <div><label className="label" htmlFor="pname">Nombre</label><input id="pname" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></div>
      <div><label className="label" htmlFor="pphone">Teléfono</label><input id="pphone" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="pemail">Correo (no editable)</label><input id="pemail" className="input opacity-60" value={email} disabled /></div>
      <div><button disabled={loading} className="btn-primary">{loading ? "Guardando..." : "Guardar cambios"}</button></div>
    </form>
  );
}

export function PasswordForm() {
  const [f, setF] = useState({ current: "", password: "", confirm: "" }); const [loading, setLoading] = useState(false);
  const toast = useUI((s) => s.toast);
  return (
    <form className="grid gap-5 sm:grid-cols-3" onSubmit={async (e) => {
      e.preventDefault();
      if (f.password !== f.confirm) return toast({ title: "Las contraseñas no coinciden", tone: "error" });
      setLoading(true);
      const r = await fetch("/api/account/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current: f.current, password: f.password }) }); const j = await r.json(); setLoading(false);
      if (r.ok) { toast({ title: "Contraseña actualizada", tone: "success" }); setF({ current: "", password: "", confirm: "" }); } else toast({ title: "Error", description: j.error, tone: "error" });
    }}>
      <div><label className="label" htmlFor="cur">Actual</label><input id="cur" type="password" autoComplete="current-password" className="input" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} required /></div>
      <div><label className="label" htmlFor="np">Nueva</label><input id="np" type="password" autoComplete="new-password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></div>
      <div><label className="label" htmlFor="cp">Confirmar</label><input id="cp" type="password" autoComplete="new-password" className="input" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} required /></div>
      <div><button disabled={loading} className="btn-outline">{loading ? "Guardando..." : "Cambiar contraseña"}</button></div>
    </form>
  );
}
