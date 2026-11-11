import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { ORDER_STATUSES, PAYMENT_STATUSES, STATUS_LABEL } from "@/lib/utils";
import { sendMail } from "@/lib/mail";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params; const b = await req.json();
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  const data: { status?: string; paymentStatus?: string } = {};
  if (b.status && (ORDER_STATUSES as readonly string[]).includes(b.status)) data.status = b.status;
  if (b.paymentStatus && (PAYMENT_STATUSES as readonly string[]).includes(b.paymentStatus)) data.paymentStatus = b.paymentStatus;
  // Al cancelar, se repone el inventario; al reactivar un pedido cancelado, se descuenta de nuevo.
  const ops = [];
  if (data.status === "CANCELADO" && order.status !== "CANCELADO") for (const i of order.items) if (i.productId) ops.push(prisma.product.update({ where: { id: i.productId }, data: { stock: { increment: i.quantity }, soldCount: { decrement: i.quantity } } }));
  if (data.status && data.status !== "CANCELADO" && order.status === "CANCELADO") for (const i of order.items) if (i.productId) ops.push(prisma.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.quantity }, soldCount: { increment: i.quantity } } }));
  const [updated] = await prisma.$transaction([prisma.order.update({ where: { id }, data }), ...ops]);
  if (data.status && data.status !== order.status) await sendMail(order.email, `Tu pedido ${order.number} está: ${STATUS_LABEL[data.status]}`, `<p>Hola ${order.customerName}, el estado de tu pedido ${order.number} cambió a <b>${STATUS_LABEL[data.status]}</b>.</p>`).catch(() => {});
  return NextResponse.json({ order: updated });
}
