import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkoutSchema, firstError } from "@/lib/validators";
import { computeTotals } from "@/lib/shipping";
import { findValidCoupon } from "@/lib/coupons";
import { availablePaymentMethods, startPayment } from "@/lib/payments";
import { nextOrderNumber, sendOrderEmail, successUrl } from "@/lib/orders";
import { safeJson } from "@/lib/utils";

function luhn(num: string) { let s = 0, alt = false; for (let i = num.length - 1; i >= 0; i--) { let n = +num[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } s += n; alt = !alt; } return s % 10 === 0; }

export async function POST(req: Request) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  const d = parsed.data;
  const user = await getCurrentUser();

  const method = availablePaymentMethods().find((m) => m.id === d.paymentMethod);
  if (!method) return NextResponse.json({ error: "Método de pago no disponible." }, { status: 400 });

  if (method.kind === "card-demo") {
    const num = (d.card?.number ?? "").replace(/\s/g, "");
    const [mm, yy] = (d.card?.exp ?? "").split("/").map((x) => Number(x));
    const expOk = mm >= 1 && mm <= 12 && new Date(2000 + yy, mm) > new Date();
    if (!/^\d{13,19}$/.test(num) || !luhn(num)) return NextResponse.json({ error: "Número de tarjeta inválido." }, { status: 400 });
    if (!expOk) return NextResponse.json({ error: "La tarjeta está vencida o la fecha es inválida." }, { status: 400 });
    if (!/^\d{3,4}$/.test(d.card?.cvc ?? "")) return NextResponse.json({ error: "CVC inválido." }, { status: 400 });
    if (!d.card?.name || d.card.name.trim().length < 3) return NextResponse.json({ error: "Ingresa el nombre del titular." }, { status: 400 });
    if (num === "4000000000000002") return NextResponse.json({ error: "Pago rechazado por el banco emisor (tarjeta de prueba de rechazo)." }, { status: 402 });
  }

  // Validar productos, variantes y stock contra la base de datos
  const ids = [...new Set(d.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));
  const qtyByProduct = new Map<string, number>();
  const lines: { productId: string; name: string; image: string; price: number; size: string; color: string; quantity: number }[] = [];
  for (const it of d.items) {
    const p = byId.get(it.productId);
    if (!p || !p.active) return NextResponse.json({ error: "Un producto del carrito ya no está disponible." }, { status: 409 });
    const sizes = safeJson<string[]>(p.sizes, []); const colors = safeJson<{ name: string; image?: string }[]>(p.colors, []);
    const color = colors.find((c) => c.name === it.color);
    if (!sizes.includes(it.size) || !color) return NextResponse.json({ error: `La talla o color de ${p.name} no es válida.` }, { status: 409 });
    qtyByProduct.set(p.id, (qtyByProduct.get(p.id) ?? 0) + it.quantity);
    lines.push({ productId: p.id, name: p.name, image: color.image ?? safeJson<string[]>(p.images, [])[0], price: p.price, size: it.size, color: it.color, quantity: it.quantity });
  }
  for (const [pid, q] of qtyByProduct) { const p = byId.get(pid)!; if (p.stock < q) return NextResponse.json({ error: `Stock insuficiente para ${p.name} (disponibles: ${p.stock}).` }, { status: 409 }); }

  const subtotal = Math.round(lines.reduce((s, l) => s + l.price * l.quantity, 0) * 100) / 100;
  let coupon = null;
  if (d.couponCode) { const r = await findValidCoupon(d.couponCode, subtotal); if (r.error) return NextResponse.json({ error: r.error }, { status: 400 }); coupon = r.coupon; }
  const totals = computeTotals(subtotal, d.shippingMethod, coupon);

  const paidNow = method.kind === "card-demo";
  const number = await nextOrderNumber();
  const order = await prisma.$transaction(async (tx) => {
    for (const [pid, q] of qtyByProduct) {
      const r = await tx.product.updateMany({ where: { id: pid, stock: { gte: q } }, data: { stock: { decrement: q }, soldCount: { increment: q } } });
      if (r.count === 0) throw new Error("STOCK");
    }
    if (coupon) await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    return tx.order.create({ data: {
      number, userId: user?.id ?? null, email: d.customer.email, customerName: d.customer.name, phone: d.customer.phone, idNumber: d.customer.idNumber || null,
      line1: d.address.line1, line2: d.address.line2 || null, city: d.address.city, province: d.address.province, postalCode: d.address.postalCode || null, notes: d.address.notes || null,
      shippingMethod: totals.method.id, shippingCost: totals.shipping, subtotal, discount: totals.discount, total: totals.total, couponCode: coupon?.code ?? null,
      paymentMethod: method.id, paymentStatus: paidNow ? "PAGADO" : "PENDIENTE", paymentRef: paidNow ? `DEMO-${Date.now().toString(36).toUpperCase()}` : null, status: paidNow ? "CONFIRMADO" : "PENDIENTE",
      items: { create: lines },
    } });
  }).catch((e) => (e instanceof Error && e.message === "STOCK" ? null : Promise.reject(e)));
  if (!order) return NextResponse.json({ error: "El stock cambió mientras comprabas. Revisa tu carrito." }, { status: 409 });

  if (method.kind === "redirect") {
    try {
      const r = await startPayment(method.id, order);
      if (r.ref) await prisma.order.update({ where: { id: order.id }, data: { paymentRef: r.ref } });
      if (!r.url) throw new Error("La pasarela no devolvió URL de pago.");
      return NextResponse.json({ number: order.number, redirectUrl: r.url });
    } catch (e) {
      await prisma.$transaction([
        ...[...qtyByProduct].map(([pid, q]) => prisma.product.update({ where: { id: pid }, data: { stock: { increment: q }, soldCount: { decrement: q } } })),
        prisma.order.update({ where: { id: order.id }, data: { status: "CANCELADO", paymentStatus: "FALLIDO" } }),
      ]);
      return NextResponse.json({ error: `No se pudo iniciar el pago: ${(e as Error).message}` }, { status: 502 });
    }
  }
  await sendOrderEmail(order.id).catch(() => {});
  return NextResponse.json({ number: order.number, successUrl: successUrl(order) });
}
