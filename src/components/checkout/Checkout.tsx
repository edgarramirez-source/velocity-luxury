"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, CreditCard, Lock, ChevronLeft, Landmark, Banknote, Wallet } from "lucide-react";
import { cartSubtotal, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { computeTotals, SHIPPING_METHODS, FREE_SHIPPING_FROM } from "@/lib/shipping";
import { cn, formatPrice } from "@/lib/utils";
import { useCartOptions, useCoupon, useMounted } from "./hooks";
import { CouponBox } from "./CouponBox";
import { thumb } from "@/lib/media";

interface Address { id: string; label: string; fullName: string; phone: string; line1: string; line2: string | null; city: string; province: string; postalCode: string | null; isDefault: boolean }
interface PM { id: string; name: string; description: string; kind: string }
const PROVINCES = ["Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora Chinchipe"];
const STEPS = ["Datos y entrega", "Envío", "Pago", "Confirmación"];

export function Checkout({ user, addresses, methods }: { user: { name: string; email: string; phone: string | null } | null; addresses: Address[]; methods: PM[] }) {
  const mounted = useMounted();
  const router = useRouter();
  const sp = useSearchParams();
  const { items, clear } = useCart();
  const toast = useUI((s) => s.toast);
  useCartOptions();
  const c = useCoupon();
  const def = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? def?.phone ?? "", idNumber: "" });
  const [address, setAddress] = useState({ line1: def?.line1 ?? "", line2: def?.line2 ?? "", city: def?.city ?? "", province: def?.province ?? "Pichincha", postalCode: def?.postalCode ?? "", notes: "" });
  const [ship, setShip] = useState("standard");
  const [pay, setPay] = useState(methods[0]?.id ?? "");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(sp.get("cancelado") ? "El pago fue cancelado. Puedes intentarlo nuevamente." : sp.get("error") ? "No se pudo verificar el pago." : null);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  if (!mounted) return <div className="min-h-[60vh]" />;
  if (!items.length) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="h-display text-5xl">No hay productos para pagar</h1>
      <Link href="/tienda" className="btn-primary">Ir a la tienda</Link>
    </div>
  );

  const subtotal = cartSubtotal(items);
  const t = computeTotals(subtotal, ship, c.coupon);
  const method = methods.find((m) => m.id === pay);

  function validateStep(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (customer.name.trim().length < 2) e.name = "Ingresa tu nombre completo";
      if (!/^\S+@\S+\.\S+$/.test(customer.email)) e.email = "Correo inválido";
      if (customer.phone.replace(/\D/g, "").length < 7) e.phone = "Teléfono inválido";
      if (ship !== "pickup" || true) {
        if (address.line1.trim().length < 5) e.line1 = "Ingresa la dirección";
        if (address.city.trim().length < 2) e.city = "Ingresa la ciudad";
        if (!address.province) e.province = "Selecciona la provincia";
      }
    }
    if (s === 2) {
      if (!pay) e.pay = "Selecciona un método de pago";
      if (method?.kind === "card-demo") {
        if (card.number.replace(/\s/g, "").length < 13) e.cardNumber = "Número de tarjeta incompleto";
        if (card.name.trim().length < 3) e.cardName = "Nombre del titular requerido";
        if (!/^\d{2}\/\d{2}$/.test(card.exp)) e.cardExp = "Formato MM/AA";
        if (!/^\d{3,4}$/.test(card.cvc)) e.cardCvc = "CVC inválido";
      }
    }
    if (s === 3 && !accept) e.accept = "Debes aceptar los términos y condiciones";
    setErrors(e); return Object.keys(e).length === 0;
  }
  const next = () => { if (validateStep(step)) setStep(step + 1); };

  async function placeOrder() {
    if (!validateStep(3)) return;
    setSubmitting(true); setServerError(null);
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      customer, address, shippingMethod: ship, paymentMethod: pay, couponCode: c.coupon?.code ?? "",
      items: items.map((i) => ({ productId: i.productId, size: i.size, color: i.color, quantity: i.quantity })),
      card: method?.kind === "card-demo" ? card : undefined,
    }) });
    const j = await r.json();
    if (!r.ok) { setSubmitting(false); setServerError(j.error); toast({ title: "No se pudo completar", description: j.error, tone: "error" }); if (r.status === 402 || /tarjeta|CVC|titular/i.test(j.error)) setStep(2); return; }
    if (j.redirectUrl) { window.location.href = j.redirectUrl; return; }
    clear(); router.push(j.successUrl);
  }

  const field = (label: string, key: string, el: React.ReactNode) => (
    <div><label className="label" htmlFor={key}>{label}</label>{el}{errors[key] && <p className="mt-1.5 text-xs text-red-400" role="alert">{errors[key]}</p>}</div>
  );
  const PayIcon = (k: string) => (k === "transfer" ? Landmark : k === "cod" ? Banknote : k === "paypal" || k === "payphone" ? Wallet : CreditCard);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
      <div>
        <ol className="mb-12 grid grid-cols-4 gap-2" aria-label="Pasos del checkout">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined}>
              <button disabled={i > step} onClick={() => setStep(i)} className="w-full text-left disabled:cursor-default">
                <div className={cn("h-1 transition-all duration-500", i <= step ? "bg-giallo" : "bg-white/10")} />
                <p className={cn("mt-3 flex items-center gap-2 font-tech text-[9px] tracking-[0.2em] uppercase", i === step ? "text-white" : i < step ? "text-giallo" : "text-white/30")}>{i < step ? <Check size={12} /> : <span>0{i + 1}</span>}<span className="hidden sm:inline">{s}</span></p>
              </button>
            </li>
          ))}
        </ol>
        {serverError && <div className="mb-8 border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-300" role="alert">{serverError}</div>}

        {step === 0 && (
          <div className="fade-in space-y-10">
            <section>
              <div className="flex items-center justify-between"><h2 className="h-display text-3xl">Datos del cliente</h2>{!user && <Link href="/cuenta/login?next=/checkout" className="text-sm text-giallo hover:underline">¿Tienes cuenta? Inicia sesión</Link>}</div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {field("Nombre completo *", "name", <input id="name" autoComplete="name" className="input" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />)}
                {field("Correo electrónico *", "email", <input id="email" type="email" autoComplete="email" className="input" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />)}
                {field("Teléfono *", "phone", <input id="phone" type="tel" autoComplete="tel" className="input" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="+593 99 999 9999" />)}
                {field("Cédula / RUC (facturación)", "idNumber", <input id="idNumber" className="input" value={customer.idNumber} onChange={(e) => setCustomer({ ...customer, idNumber: e.target.value })} />)}
              </div>
            </section>
            <section>
              <h2 className="h-display text-3xl">Dirección de entrega</h2>
              {addresses.length > 0 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {addresses.map((a) => { const sel = a.line1 === address.line1 && a.city === address.city; return (
                    <button key={a.id} type="button" onClick={() => { setAddress({ ...address, line1: a.line1, line2: a.line2 ?? "", city: a.city, province: a.province, postalCode: a.postalCode ?? "" }); if (!customer.phone) setCustomer({ ...customer, phone: a.phone }); }}
                      className={cn("border p-4 text-left text-sm transition", sel ? "border-giallo bg-giallo/5" : "border-white/10 hover:border-white/30")}>
                      <p className="font-tech text-[9px] tracking-[0.2em] text-giallo">{a.label.toUpperCase()}</p><p className="mt-2 text-white/80">{a.line1}</p><p className="text-white/50">{a.city}, {a.province}</p>
                    </button>
                  ); })}
                </div>
              )}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">{field("Dirección (calle principal, número, secundaria) *", "line1", <input id="line1" autoComplete="address-line1" className="input" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />)}</div>
                <div className="sm:col-span-2">{field("Referencia / departamento", "line2", <input id="line2" autoComplete="address-line2" className="input" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />)}</div>
                {field("Ciudad *", "city", <input id="city" autoComplete="address-level2" className="input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />)}
                {field("Provincia *", "province", <select id="province" className="input" value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })}>{PROVINCES.map((p) => <option key={p} className="bg-ink">{p}</option>)}</select>)}
                {field("Código postal", "postalCode", <input id="postalCode" autoComplete="postal-code" className="input" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />)}
                {field("Notas para la entrega", "notes", <input id="notes" className="input" value={address.notes} onChange={(e) => setAddress({ ...address, notes: e.target.value })} placeholder="Horario, portería..." />)}
              </div>
            </section>
          </div>
        )}

        {step === 1 && (
          <section className="fade-in">
            <h2 className="h-display text-3xl">Método de envío</h2>
            <div className="mt-6 space-y-3">
              {SHIPPING_METHODS.map((m) => { const price = m.id === "standard" && subtotal >= FREE_SHIPPING_FROM ? 0 : m.price; return (
                <label key={m.id} className={cn("flex cursor-pointer items-center justify-between gap-4 border p-5 transition", ship === m.id ? "border-giallo bg-giallo/5" : "border-white/10 hover:border-white/30")}>
                  <span className="flex items-center gap-4"><input type="radio" name="ship" checked={ship === m.id} onChange={() => setShip(m.id)} className="h-4 w-4 accent-[#FFD400]" /><span><span className="block font-semibold">{m.name}</span><span className="text-sm text-white/50">{m.eta}</span></span></span>
                  <span className="font-display text-xl font-bold">{price ? formatPrice(price) : "Gratis"}</span>
                </label>
              ); })}
            </div>
            {ship === "pickup" && <p className="mt-4 text-sm text-white/50">Showroom VELOCITY: Av. González Suárez N27-142, Quito. Lun–Sáb 10:00–20:00.</p>}
          </section>
        )}

        {step === 2 && (
          <section className="fade-in">
            <h2 className="h-display text-3xl">Método de pago</h2>
            <div className="mt-6 space-y-3" role="radiogroup">
              {methods.map((m) => { const Icon = PayIcon(m.id); return (
                <label key={m.id} className={cn("flex cursor-pointer items-start gap-4 border p-5 transition", pay === m.id ? "border-giallo bg-giallo/5" : "border-white/10 hover:border-white/30")}>
                  <input type="radio" name="pay" checked={pay === m.id} onChange={() => setPay(m.id)} className="mt-1 h-4 w-4 accent-[#FFD400]" />
                  <Icon size={20} className="mt-0.5 text-giallo" />
                  <span><span className="block font-semibold">{m.name}</span><span className="text-sm text-white/50">{m.description}</span></span>
                </label>
              ); })}
            </div>
            {errors.pay && <p className="mt-2 text-xs text-red-400">{errors.pay}</p>}
            {method?.kind === "card-demo" && (
              <div className="mt-8 grid gap-5 border border-white/10 bg-carbon p-6 sm:grid-cols-2">
                <div className="sm:col-span-2">{field("Número de tarjeta", "cardNumber", <input id="cardNumber" inputMode="numeric" autoComplete="cc-number" className="input tracking-widest" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim() })} />)}</div>
                <div className="sm:col-span-2">{field("Titular", "cardName", <input id="cardName" autoComplete="cc-name" className="input uppercase" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />)}</div>
                {field("Vencimiento", "cardExp", <input id="cardExp" autoComplete="cc-exp" className="input" placeholder="MM/AA" value={card.exp} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); setCard({ ...card, exp: v }); }} />)}
                {field("CVC", "cardCvc", <input id="cardCvc" inputMode="numeric" autoComplete="cc-csc" className="input" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} />)}
                <p className="text-xs text-white/40 sm:col-span-2">Modo demostración: usa 4242 4242 4242 4242 (aprobada) o 4000 0000 0000 0002 (rechazada), cualquier fecha futura y CVC.</p>
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="fade-in space-y-6">
            <h2 className="h-display text-3xl">Revisa y confirma</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Cliente", [customer.name, customer.email, customer.phone], 0],
                ["Entrega", [address.line1, address.line2, `${address.city}, ${address.province}`], 0],
                ["Envío y pago", [SHIPPING_METHODS.find((m) => m.id === ship)?.name, method?.name, method?.kind === "card-demo" ? `•••• ${card.number.slice(-4)}` : ""], 1],
              ].map(([title, lines, s]) => (
                <div key={title as string} className="border border-white/10 p-5">
                  <div className="flex justify-between"><p className="font-tech text-[9px] tracking-[0.2em] text-giallo">{(title as string).toUpperCase()}</p><button onClick={() => setStep(s as number)} className="text-xs text-white/50 hover:text-giallo">Editar</button></div>
                  {(lines as (string | undefined)[]).filter(Boolean).map((l) => <p key={l} className="mt-2 text-sm text-white/70">{l}</p>)}
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 text-sm text-white/70">
              <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-1 h-4 w-4 accent-[#FFD400]" />
              <span>He leído y acepto los <Link href="/terminos" target="_blank" className="text-giallo hover:underline">términos y condiciones</Link>, la <Link href="/privacidad" target="_blank" className="text-giallo hover:underline">política de privacidad</Link> y la <Link href="/devoluciones" target="_blank" className="text-giallo hover:underline">política de devoluciones</Link>.</span>
            </label>
            {errors.accept && <p className="text-xs text-red-400">{errors.accept}</p>}
          </section>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
          {step > 0 ? <button onClick={() => setStep(step - 1)} className="btn-dark"><ChevronLeft size={14} /> Atrás</button> : <Link href="/carrito" className="btn-dark"><ChevronLeft size={14} /> Volver al carrito</Link>}
          {step < 3 ? <button onClick={next} className="btn-primary">Continuar</button>
            : <button onClick={placeOrder} disabled={submitting} className="btn-primary"><Lock size={14} /> {submitting ? "Procesando..." : method?.kind === "redirect" ? `Pagar ${formatPrice(t.total)}` : `Confirmar pedido · ${formatPrice(t.total)}`}</button>}
        </div>
      </div>

      <aside className="h-fit space-y-6 border border-white/[0.08] bg-carbon p-7 lg:sticky lg:top-28" aria-label="Resumen del pedido">
        <h2 className="font-tech text-xs tracking-[0.3em]">RESUMEN DEL PEDIDO</h2>
        <ul className="max-h-80 space-y-4 overflow-y-auto">
          {items.map((i) => (
            <li key={i.key} className="flex gap-4">
              <div className="relative"><img src={thumb(i.image)} alt="" className="h-20 w-16 object-cover" /><span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-giallo text-[10px] font-bold text-black">{i.quantity}</span></div>
              <div className="flex-1 text-sm"><p className="font-semibold">{i.name}</p><p className="text-white/50">{i.size} · {i.color}</p></div>
              <p className="text-sm">{formatPrice(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <CouponBox c={c} />
        <dl className="space-y-3 border-t border-white/10 pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>{formatPrice(t.subtotal)}</dd></div>
          {t.discount > 0 && <div className="flex justify-between text-giallo"><dt>Descuento</dt><dd>−{formatPrice(t.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-white/60">Envío ({t.method.name})</dt><dd>{t.shipping ? formatPrice(t.shipping) : "Gratis"}</dd></div>
          <div className="flex items-baseline justify-between border-t border-white/10 pt-4"><dt className="font-tech text-[10px] tracking-[0.25em]">TOTAL</dt><dd className="font-display text-3xl font-bold">{formatPrice(t.total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
