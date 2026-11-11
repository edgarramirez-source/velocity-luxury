import "server-only";
import crypto from "node:crypto";
import { prisma } from "./db";
import { sendMail } from "./mail";
import { formatPrice } from "./utils";

export const orderAccessKey = (id: string) => crypto.createHmac("sha256", process.env.AUTH_SECRET!).update(`order:${id}`).digest("hex").slice(0, 32);
export function successUrl(order: { id: string; number: string }) { return `/pedido/${order.number}?k=${orderAccessKey(order.id)}`; }

export async function nextOrderNumber() {
  const last = await prisma.order.findFirst({ orderBy: { createdAt: "desc" }, select: { number: true } });
  const all = await prisma.order.findMany({ select: { number: true } });
  const max = all.reduce((m, o) => Math.max(m, Number(o.number.replace(/\D/g, "")) || 0), Number(last?.number.replace(/\D/g, "")) || 1000);
  return `VL-${max + 1}`;
}

export async function markPaid(number: string, ref?: string) {
  const o = await prisma.order.update({ where: { number }, data: { paymentStatus: "PAGADO", status: "CONFIRMADO", ...(ref ? { paymentRef: ref } : {}) } });
  return o;
}

export async function sendOrderEmail(orderId: string) {
  const o = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!o) return;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await sendMail(o.email, `Confirmación de pedido ${o.number} — VELOCITY LUXURY`, `<h1>Gracias, ${o.customerName}</h1><p>Recibimos tu pedido <b>${o.number}</b> por ${formatPrice(o.total)}.</p><ul>${o.items.map((i) => `<li>${i.name} (${i.size}, ${i.color}) × ${i.quantity}</li>`).join("")}</ul><p>Ver pedido: ${site}${successUrl(o)}</p>`);
}
