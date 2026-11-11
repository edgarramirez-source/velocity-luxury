import "server-only";
// Pasarelas de pago configurables mediante variables de entorno.
export interface PaymentMethodInfo { id: string; name: string; description: string; kind: "redirect" | "card-demo" | "offline" }

export function availablePaymentMethods(): PaymentMethodInfo[] {
  const m: PaymentMethodInfo[] = [];
  if (process.env.STRIPE_SECRET_KEY) m.push({ id: "stripe", name: "Tarjeta (Stripe)", description: "Pago seguro con Visa, Mastercard o Amex vía Stripe Checkout.", kind: "redirect" });
  if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) m.push({ id: "paypal", name: "PayPal", description: "Paga con tu cuenta PayPal o tarjeta.", kind: "redirect" });
  if (process.env.PAYPHONE_TOKEN && process.env.PAYPHONE_STORE_ID) m.push({ id: "payphone", name: "PayPhone", description: "Pago con tarjeta o saldo PayPhone (Ecuador).", kind: "redirect" });
  if (process.env.PAYMENT_DEMO_ENABLED !== "false") m.push({ id: "demo", name: "Tarjeta de crédito (modo demo)", description: "Simulación de pago para pruebas. Usa 4242 4242 4242 4242.", kind: "card-demo" });
  m.push({ id: "transfer", name: "Transferencia bancaria", description: "Recibirás los datos bancarios. Tu pedido se confirma al validar el pago.", kind: "offline" });
  m.push({ id: "cod", name: "Pago contra entrega", description: "Paga en efectivo o tarjeta al recibir (solo Quito y Guayaquil).", kind: "offline" });
  return m;
}

const site = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
interface OrderForPayment { id: string; number: string; total: number; email: string }

/** Devuelve la URL de redirección a la pasarela, o null si el método no redirige. */
export async function startPayment(method: string, order: OrderForPayment): Promise<{ url?: string; ref?: string }> {
  const cents = Math.round(order.total * 100);
  if (method === "stripe") {
    const body = new URLSearchParams({
      mode: "payment", customer_email: order.email, client_reference_id: order.number,
      success_url: `${site()}/api/payments/stripe/return?order=${order.number}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site()}/checkout?cancelado=1`,
      "line_items[0][quantity]": "1", "line_items[0][price_data][currency]": "usd", "line_items[0][price_data][unit_amount]": String(cents),
      "line_items[0][price_data][product_data][name]": `Pedido ${order.number} · VELOCITY LUXURY`,
    });
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
    const j = await r.json(); if (!r.ok) throw new Error(j?.error?.message || "Error en Stripe");
    return { url: j.url, ref: j.id };
  }
  if (method === "paypal") {
    const base = process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    const tok = await fetch(`${base}/v1/oauth2/token`, { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" }).then((r) => r.json());
    const r = await fetch(`${base}/v2/checkout/orders`, { method: "POST", headers: { Authorization: `Bearer ${tok.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({
      intent: "CAPTURE", purchase_units: [{ reference_id: order.number, amount: { currency_code: "USD", value: order.total.toFixed(2) } }],
      application_context: { brand_name: "VELOCITY LUXURY", return_url: `${site()}/api/payments/paypal/return?order=${order.number}`, cancel_url: `${site()}/checkout?cancelado=1` },
    }) });
    const j = await r.json(); if (!r.ok) throw new Error(j?.message || "Error en PayPal");
    return { url: j.links?.find((l: { rel: string }) => l.rel === "approve")?.href, ref: j.id };
  }
  if (method === "payphone") {
    const r = await fetch("https://pay.payphonetodoesposible.com/api/button/Prepare", { method: "POST", headers: { Authorization: `Bearer ${process.env.PAYPHONE_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({
      amount: cents, amountWithoutTax: cents, currency: "USD", clientTransactionId: order.number, storeId: process.env.PAYPHONE_STORE_ID,
      responseUrl: `${site()}/api/payments/payphone/return`, cancellationUrl: `${site()}/checkout?cancelado=1`, reference: `Pedido ${order.number}`,
    }) });
    const j = await r.json(); if (!r.ok) throw new Error(j?.message || "Error en PayPhone");
    return { url: j.payWithCard || j.payWithPayPhone, ref: String(j.paymentId ?? "") };
  }
  return {};
}

export async function verifyStripe(sessionId: string) {
  const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } });
  const j = await r.json(); return j.payment_status === "paid";
}
export async function capturePaypal(token: string) {
  const base = process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const tok = await fetch(`${base}/v1/oauth2/token`, { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" }).then((r) => r.json());
  const r = await fetch(`${base}/v2/checkout/orders/${token}/capture`, { method: "POST", headers: { Authorization: `Bearer ${tok.access_token}`, "Content-Type": "application/json" } });
  const j = await r.json(); return j.status === "COMPLETED";
}
export async function confirmPayphone(id: string, clientTxId: string) {
  const r = await fetch("https://pay.payphonetodoesposible.com/api/button/V2/Confirm", { method: "POST", headers: { Authorization: `Bearer ${process.env.PAYPHONE_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ id: Number(id), clientTxId }) });
  const j = await r.json(); return j.transactionStatus === "Approved";
}
