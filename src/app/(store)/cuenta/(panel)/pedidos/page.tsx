import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/orders/OrderSummary";

export const metadata: Metadata = { title: "Mis pedidos" };

export default async function Pedidos() {
  const u = await requireUser("/cuenta/pedidos");
  const orders = await prisma.order.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, include: { items: true } });
  if (!orders.length) return <div className="card p-10 text-center"><p className="h-display text-4xl">Aún no tienes pedidos</p><Link href="/tienda" className="btn-primary mt-6">Explorar la tienda</Link></div>;
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link href={`/cuenta/pedidos/${o.number}`} className="card flex flex-wrap items-center gap-5 p-5 transition hover:border-giallo/40">
            <div className="flex -space-x-4">{o.items.slice(0, 3).map((i) => <img key={i.id} src={i.image} alt="" className="h-16 w-12 border-2 border-graphite object-cover" />)}</div>
            <div className="min-w-[140px] flex-1"><p className="font-semibold">{o.number}</p><p className="text-sm text-white/50">{formatDate(o.createdAt)} · {o.items.reduce((s, i) => s + i.quantity, 0)} artículos</p></div>
            <StatusBadge status={o.status} />
            <p className="w-28 text-right font-display text-xl font-bold">{formatPrice(o.total)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
