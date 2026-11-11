import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { orderAccessKey } from "@/lib/orders";
import { OrderSummary } from "@/components/orders/OrderSummary";

export const metadata: Metadata = { title: "Pedido confirmado", robots: { index: false } };

export default async function OrderSuccess({ params, searchParams }: { params: Promise<{ number: string }>; searchParams: Promise<{ k?: string }> }) {
  const { number } = await params; const { k } = await searchParams;
  const order = await prisma.order.findUnique({ where: { number }, include: { items: true } });
  if (!order) notFound();
  const s = await getSession();
  const allowed = (k && k === orderAccessKey(order.id)) || (s && (s.sub === order.userId || s.role === "ADMIN"));
  if (!allowed) notFound();
  const paid = order.paymentStatus === "PAGADO";
  return (
    <div className="container-x max-w-4xl py-16">
      <div className="text-center">
        <CheckCircle2 size={64} strokeWidth={1.2} className="rise mx-auto text-giallo" />
        <p className="eyebrow rise mt-6">Pedido {order.number}</p>
        <h1 className="h-display rise mt-3 text-6xl sm:text-7xl">{paid ? "¡Gracias por tu compra!" : "¡Pedido recibido!"}</h1>
        <p className="rise mx-auto mt-4 max-w-lg text-white/60">{paid ? `Tu pago fue aprobado. Enviamos la confirmación a ${order.email}.` : `Registramos tu pedido. ${order.paymentMethod === "cod" ? "Pagarás al recibirlo." : "Lo confirmaremos al validar el pago."} Te escribimos a ${order.email}.`}</p>
      </div>
      <div className="mt-14 border border-white/[0.08] bg-carbon p-6 sm:p-10"><OrderSummary order={order} /></div>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/tienda" className="btn-primary">Seguir comprando</Link>
        {order.userId ? <Link href={`/cuenta/pedidos/${order.number}`} className="btn-outline">Ver en mi cuenta</Link> : <Link href={`/cuenta/registro?email=${encodeURIComponent(order.email)}`} className="btn-outline">Crear cuenta para seguir tus pedidos</Link>}
      </div>
    </div>
  );
}
