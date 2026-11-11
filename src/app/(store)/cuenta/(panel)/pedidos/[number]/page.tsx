import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrderSummary } from "@/components/orders/OrderSummary";

export default async function PedidoDetalle({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const u = await requireUser(`/cuenta/pedidos/${number}`);
  const order = await prisma.order.findFirst({ where: { number, userId: u.id }, include: { items: true } });
  if (!order) notFound();
  return (
    <div>
      <Link href="/cuenta/pedidos" className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-giallo"><ArrowLeft size={14} /> Mis pedidos</Link>
      <div className="card p-6 sm:p-8"><h2 className="h-display mb-6 text-4xl">Pedido {order.number}</h2><OrderSummary order={order} /></div>
    </div>
  );
}
