import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { cn, formatDate, formatPrice, ORDER_STATUSES, STATUS_LABEL } from "@/lib/utils";
import { AdminHeader, Th } from "@/components/admin/ui";
import { StatusBadge } from "@/components/orders/OrderSummary";
import { QuickStatus } from "@/components/admin/OrderControls";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pedidos" };

export default async function Pedidos({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string }> }) {
  const { estado, q } = await searchParams;
  const where: Prisma.OrderWhereInput = { ...(estado ? { status: estado } : {}), ...(q ? { OR: [{ number: { contains: q } }, { customerName: { contains: q } }, { email: { contains: q } }] } : {}) };
  const [orders, counts] = await Promise.all([prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, include: { _count: { select: { items: true } } } }), prisma.order.groupBy({ by: ["status"], _count: true })]);
  const total = counts.reduce((s, c) => s + c._count, 0);
  return (
    <div>
      <AdminHeader title="Pedidos" subtitle={`${total} pedidos en total`} />
      <div className="mb-4 flex flex-wrap gap-2">
        {[["", "Todos", total], ...ORDER_STATUSES.map((s) => [s, STATUS_LABEL[s], counts.find((c) => c.status === s)?._count ?? 0])].map(([v, l, n]) => (
          <Link key={l as string} href={`/admin/pedidos${v ? `?estado=${v}` : ""}`} className={cn("border px-3 py-2 text-xs transition", (estado ?? "") === v ? "border-giallo bg-giallo text-black" : "border-white/15 text-white/70 hover:border-white/40")}>{l} ({n})</Link>
        ))}
      </div>
      <div className="card">
        <form className="border-b border-white/[0.06] p-4">{estado && <input type="hidden" name="estado" value={estado} />}<input name="q" defaultValue={q} placeholder="Buscar por número, cliente o correo..." className="input max-w-md py-2" aria-label="Buscar pedidos" /></form>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="border-b border-white/[0.06]"><tr><Th>Pedido</Th><Th>Fecha</Th><Th>Cliente</Th><Th>Artículos</Th><Th>Pago</Th><Th>Estado</Th><Th className="text-right">Total</Th></tr></thead>
          <tbody>{orders.map((o) => (
            <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
              <td className="px-4 py-3"><Link href={`/admin/pedidos/${o.id}`} className="font-semibold hover:text-giallo">{o.number}</Link></td>
              <td className="px-4 py-3 text-white/50">{formatDate(o.createdAt)}</td>
              <td className="px-4 py-3"><p>{o.customerName}</p><p className="text-xs text-white/40">{o.email}</p></td>
              <td className="px-4 py-3 text-white/60">{o._count.items}</td>
              <td className="px-4 py-3"><StatusBadge status={o.paymentStatus} /></td>
              <td className="px-4 py-3"><QuickStatus id={o.id} status={o.status} /></td>
              <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
            </tr>
          ))}</tbody>
        </table>{orders.length === 0 && <p className="p-10 text-center text-white/50">No hay pedidos con estos filtros.</p>}</div>
      </div>
    </div>
  );
}
