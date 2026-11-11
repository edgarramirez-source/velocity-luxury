"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUI } from "@/store/ui";

function useSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function post(url: string, body: unknown) {
    setLoading(true); setError(null);
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({})); setLoading(false);
    if (!r.ok) { setError(j.error ?? "Ocurrió un error"); return null; }
    return j;
  }
  return { loading, error, post, setError };
}
function PasswordInput({ id, value, onChange, autoComplete }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} required autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} className="input pr-12" />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </div>
  );
}
const ErrorBox = ({ e }: { e: string | null }) => (e ? <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{e}</p> : null);
const safeNext = (n: string | null) => (n && n.startsWith("/") && !n.startsWith("//") ? n : null);

export function LoginForm() {
  const sp = useSearchParams(); const router = useRouter(); const toast = useUI((s) => s.toast);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const { loading, error, post } = useSubmit();
  return (
    <form className="space-y-5" onSubmit={async (e) => { e.preventDefault(); const j = await post("/api/auth/login", { email, password }); if (j) { toast({ title: "Sesión iniciada", tone: "success" }); router.push(safeNext(sp.get("next")) ?? (j.role === "ADMIN" ? "/admin" : "/cuenta")); router.refresh(); } }}>
      <ErrorBox e={error} />
      <div><label htmlFor="email" className="label">Correo electrónico</label><input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
      <div><div className="flex justify-between"><label htmlFor="password" className="label">Contraseña</label><Link href="/cuenta/recuperar" className="text-xs text-white/50 hover:text-giallo">¿Olvidaste tu contraseña?</Link></div><PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" /></div>
      <button disabled={loading} className="btn-primary w-full">{loading ? "Ingresando..." : "Iniciar sesión"}</button>
      <p className="text-center text-sm text-white/50">¿Nuevo en Velocity? <Link href={`/cuenta/registro${sp.get("next") ? `?next=${encodeURIComponent(sp.get("next")!)}` : ""}`} className="text-giallo hover:underline">Crea tu cuenta</Link></p>
      <div className="border border-dashed border-white/15 p-4 text-xs text-white/50">
        <p className="font-tech text-[9px] tracking-[0.2em] text-giallo">CUENTAS DE DEMOSTRACIÓN</p>
        <button type="button" onClick={() => { setEmail("cliente@velocityluxury.com"); setPassword("Cliente123!"); }} className="mt-2 block hover:text-white">Cliente: cliente@velocityluxury.com / Cliente123!</button>
        <button type="button" onClick={() => { setEmail("admin@velocityluxury.com"); setPassword("Admin123!"); }} className="mt-1 block hover:text-white">Admin: admin@velocityluxury.com / Admin123!</button>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const sp = useSearchParams(); const router = useRouter(); const toast = useUI((s) => s.toast);
  const [f, setF] = useState({ name: "", email: sp.get("email") ?? "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const { loading, error, post, setError } = useSubmit();
  const checks = [[f.password.length >= 8, "8+ caracteres"], [/[A-Z]/.test(f.password), "Una mayúscula"], [/[0-9]/.test(f.password), "Un número"]] as const;
  return (
    <form className="space-y-5" onSubmit={async (e) => {
      e.preventDefault();
      if (f.password !== f.confirm) return setError("Las contraseñas no coinciden.");
      if (!terms) return setError("Debes aceptar los términos y la política de privacidad.");
      const j = await post("/api/auth/register", { name: f.name, email: f.email, password: f.password });
      if (j) { toast({ title: "¡Bienvenido al club!", description: "Tu cuenta fue creada.", tone: "success" }); router.push(safeNext(sp.get("next")) ?? "/cuenta"); router.refresh(); }
    }}>
      <ErrorBox e={error} />
      <div><label htmlFor="name" className="label">Nombre completo</label><input id="name" required autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="input" /></div>
      <div><label htmlFor="email" className="label">Correo electrónico</label><input id="email" type="email" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="input" /></div>
      <div><label htmlFor="password" className="label">Contraseña</label><PasswordInput id="password" value={f.password} onChange={(v) => setF({ ...f, password: v })} autoComplete="new-password" />
        <div className="mt-2 flex gap-4 text-[11px]">{checks.map(([ok, l]) => <span key={l} className={ok ? "text-giallo" : "text-white/35"}>{ok ? "✓" : "○"} {l}</span>)}</div></div>
      <div><label htmlFor="confirm" className="label">Confirmar contraseña</label><PasswordInput id="confirm" value={f.confirm} onChange={(v) => setF({ ...f, confirm: v })} autoComplete="new-password" /></div>
      <label className="flex items-start gap-3 text-sm text-white/60"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 h-4 w-4 accent-[#FFD400]" /><span>Acepto los <Link href="/terminos" className="text-giallo hover:underline">términos</Link> y la <Link href="/privacidad" className="text-giallo hover:underline">política de privacidad</Link>.</span></label>
      <button disabled={loading} className="btn-primary w-full">{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
      <p className="text-center text-sm text-white/50">¿Ya tienes cuenta? <Link href="/cuenta/login" className="text-giallo hover:underline">Inicia sesión</Link></p>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState(""); const [done, setDone] = useState<{ devLink?: string } | null>(null);
  const { loading, error, post } = useSubmit();
  if (done) return (
    <div className="space-y-5">
      <p className="border border-giallo/30 bg-giallo/5 p-4 text-sm text-white/75">Si existe una cuenta con <b>{email}</b>, recibirás un enlace para restablecer tu contraseña. Revisa también tu carpeta de spam.</p>
      {done.devLink && <div className="border border-dashed border-white/20 p-4 text-xs text-white/60"><p className="font-tech text-[9px] tracking-[0.2em] text-giallo">MODO DESARROLLO (SMTP NO CONFIGURADO)</p><Link href={done.devLink.replace(/^https?:\/\/[^/]+/, "")} className="mt-2 block break-all text-giallo hover:underline">Abrir enlace de restablecimiento</Link></div>}
      <Link href="/cuenta/login" className="btn-outline w-full">Volver a iniciar sesión</Link>
    </div>
  );
  return (
    <form className="space-y-5" onSubmit={async (e) => { e.preventDefault(); const j = await post("/api/auth/forgot", { email }); if (j) setDone(j); }}>
      <ErrorBox e={error} />
      <div><label htmlFor="email" className="label">Correo electrónico</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
      <button disabled={loading} className="btn-primary w-full">{loading ? "Enviando..." : "Enviar enlace"}</button>
      <p className="text-center text-sm"><Link href="/cuenta/login" className="text-white/50 hover:text-giallo">Volver a iniciar sesión</Link></p>
    </form>
  );
}

export function ResetForm() {
  const sp = useSearchParams(); const router = useRouter(); const toast = useUI((s) => s.toast);
  const token = sp.get("token") ?? "";
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const { loading, error, post, setError } = useSubmit();
  if (!token) return <div className="space-y-5"><ErrorBox e="Falta el token de restablecimiento." /><Link href="/cuenta/recuperar" className="btn-primary w-full">Solicitar nuevo enlace</Link></div>;
  return (
    <form className="space-y-5" onSubmit={async (e) => { e.preventDefault(); if (password !== confirm) return setError("Las contraseñas no coinciden."); const j = await post("/api/auth/reset", { token, password }); if (j) { toast({ title: "Contraseña actualizada", description: "Ya puedes iniciar sesión.", tone: "success" }); router.push("/cuenta/login"); } }}>
      <ErrorBox e={error} />
      <div><label htmlFor="password" className="label">Nueva contraseña</label><PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" /><p className="mt-2 text-xs text-white/40">Mínimo 8 caracteres, una mayúscula y un número.</p></div>
      <div><label htmlFor="confirm" className="label">Confirmar contraseña</label><PasswordInput id="confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" /></div>
      <button disabled={loading} className="btn-primary w-full">{loading ? "Guardando..." : "Guardar contraseña"}</button>
    </form>
  );
}
