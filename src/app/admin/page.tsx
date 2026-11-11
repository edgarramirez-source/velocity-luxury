import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice, STATUS_LABEL } from "@/lib/utils";
import { AdminHeader, Th } from "@/components/admin/ui";
import { RevenueChart } from "@/components/admin/Charts";
import { HBarList } from "@/components/admin/HBarList";
import { StatusBadge } from "@/components/orders/OrderSummary";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const since = new Date(Date.now() - 30 * 86400000); since.setHours(0, 0, 0, 0);
  const prev = new Date(since.getTime() - 30 * 86400000);
  const valid = { status: { not: "CANCELADO" } };
  const [all, last30, prev30, customers, newCustomers, byStatus, recent, lowStock, items] = await Promise.all([
    prisma.order.aggregate({ where: valid, _sum: { total: true }, _count: true }),
    prisma.order.findMany({ where: { ...valid, createdAt: { gte: since } }, select: { total: true, createdAt: true } }),
    prisma.order.aggregate({ where: { ...valid, createdAt: { gte: prev, lt: since } }, _sum: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: since } } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.product.findMany({ where: { active: true, stock: { lte: 15 } }, orderBy: { stock: "asc" }, take: 6 }),
    prisma.orderItem.findMany({ where: { order: valid }, select: { name: true, image: true, quantity: true, price: true, productId: true } }),
  ]);
  const rev30 = last30.reduce((s, o) => s + o.total, 0);
  const prevRev = prev30._sum.total ?? 0;
  const delta = prevRev ? ((rev30 - prevRev) / prevRev) * 100 : 0;
  const days = Array.from({ length: 30 }, (_, i) => { const d = new Date(since.getTime() + i * 86400000); return { key: d.toDateString(), label: d.toLocaleDateString("es-EC", { day: "2-digit", month: "short" }), value: 0, orders: 0 }; });
  for (const o of last30) { const d = days.find((x) => x.key === new Date(o.createdAt).toDateString()); if (d) { d.value += o.total; d.orders++; } }
  const top = new Map<string, { label: string; value: number; revenue: number; image: string }>();
  for (const i of items) { const k = i.productId ?? i.name; const t = top.get(k) ?? { label: i.name, value: 0, revenue: 0, image: i.image }; t.value += i.quantity; t.revenue += i.quantity * i.price; top.set(k, t); }
  const topList = [...top.values()].sort((a, b) => b.value - a.value).slice(0, 6);
  const avg = all._count ? (all._sum.total ?? 0) / all._count : 0;

  const kpis = [
    { l: "Ingresos totales", v: formatPrice(all._sum.total ?? 0), s: `${all._count} pedidos válidos` },
    { l: "Ingresos 30 días", v: formatPrice(rev30), s: prevRev ? `${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)}% vs. 30 días previos` : `${last30.length} pedidos` },
    { l: "Ticket promedio", v: formatPrice(avg), s: "Por pedido" },
    { l: "Clientes", v: String(customers), s: `+${newCustomers} en 30 días` },
  ];

  return (
    <div>
      <AdminHeader title="Estadísticas" subtitle={`Actualizado ${formatDate(new Date())}`} action={<Link href="/admin/productos/nuevo" className="btn-primary">Nuevo producto</Link>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <div key={k.l} className="card p-6"><p className="font-tech text-[9px] tracking-[0.2em] text-white/40 uppercase">{k.l}</p><p className="mt-3 font-display text-4xl font-bold">{k.v}</p><p className="mt-1 text-xs text-white/50">{k.s}</p></div>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card p-6">
          <h2 className="font-tech text-[10px] tracking-[0.25em]">INGRESOS DIARIOS · ÚLTIMOS 30 DÍAS (USD)</h2>
          <div className="mt-6"><RevenueChart data={days.map(({ label, value, orders }) => ({ label, value: Math.round(value * 100) / 100, orders }))} /></div>
        </section>
        <section className="card p-6">
          <h2 className="font-tech text-[10px] tracking-[0.25em]">PRODUCTOS MÁS VENDIDOS (UNIDADES)</h2>
          <div className="mt-6"><HBarList data={topList.map((t) => ({ label: t.label, value: t.value, sub: `${formatPrice(t.revenue)} en ingresos`, image: t.image }))} unit=" u." /></div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between p-6"><h2 className="font-tech text-[10px] tracking-[0.25em]">PEDIDOS RECIENTES</h2><Link href="/admin/pedidos" className="flex items-center gap-1 text-xs text-giallo hover:underline">Ver todos <ArrowUpRight size={14} /></Link></div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="border-y border-white/[0.06]"><tr><Th>Pedido</Th><Th>Cliente</Th><Th>Fecha</Th><Th>Estado</Th><Th className="text-right">Total</Th></tr></thead>
            <tbody>{recent.map((o) => (
              <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3"><Link href={`/admin/pedidos/${o.id}`} className="font-semibold hover:text-giallo">{o.number}</Link></td>
                <td className="px-4 py-3 text-white/70">{o.customerName}</td><td className="px-4 py-3 text-white/50">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td><td className="px-4 py-3 text-right">{formatPrice(o.total)}</td>
              </tr>
            ))}</tbody>
          </table></div>
        </section>
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-tech text-[10px] tracking-[0.25em]">PEDIDOS POR ESTADO</h2>
            <div className="mt-6"><HBarList data={["PENDIENTE", "CONFIRMADO", "PREPARANDO", "ENVIADO", "ENTREGADO", "CANCELADO"].map((s) => ({ label: STATUS_LABEL[s], value: byStatus.find((b) => b.status === s)?._count ?? 0 }))} /></div>
          </section>
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-tech text-[10px] tracking-[0.25em]"><AlertTriangle size={14} className="text-giallo" />STOCK BAJO</h2>
            {lowStock.length === 0 ? <p className="mt-4 text-sm text-white/50">Todo el inventario está en niveles saludables.</p> : (
              <ul className="mt-4 divide-y divide-white/[0.06]">{lowStock.map((p) => <li key={p.id} className="flex justify-between py-2.5 text-sm"><Link href={`/admin/productos/${p.id}`} className="hover:text-giallo">{p.name}</Link><span className={p.stock === 0 ? "text-red-400" : "text-giallo"}>{p.stock} u.</span></li>)}</ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
