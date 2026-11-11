import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/ui";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { OrderControls } from "@/components/admin/OrderControls";

export const metadata = { title: "Detalle de pedido" };
export default async function Pedido({ params }: { params: Promise<{ id: string }> }) {
  const o = await prisma.order.findUnique({ where: { id: (await params).id }, include: { items: true, user: true } });
  if (!o) notFound();
  return (
    <div>
      <Link href="/admin/pedidos" className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 hover:text-giallo"><ArrowLeft size={14} />Pedidos</Link>
      <AdminHeader title={`Pedido ${o.number}`} subtitle={`${o.customerName} · ${o.email}`} />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-6 sm:p-8"><OrderSummary order={o} /></div>
        <div className="space-y-6">
          <section className="card p-6"><h2 className="mb-5 font-tech text-[10px] tracking-[0.25em]">GESTIONAR</h2><OrderControls id={o.id} status={o.status} paymentStatus={o.paymentStatus} /></section>
          <section className="card space-y-2 p-6 text-sm">
            <h2 className="mb-3 font-tech text-[10px] tracking-[0.25em]">CLIENTE</h2>
            <p>{o.customerName}</p><p className="text-white/60">{o.email}</p><p className="text-white/60">{o.phone}</p>
            {o.idNumber && <p className="text-white/60">Cédula/RUC: {o.idNumber}</p>}
            {o.notes && <p className="border-t border-white/10 pt-2 text-white/60">Notas: {o.notes}</p>}
            {o.paymentRef && <p className="text-xs text-white/40">Ref. pago: {o.paymentRef}</p>}
            <p className="pt-2 text-xs text-white/40">{o.user ? "Cliente registrado" : "Compra como invitado"}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
