import type { Order, OrderItem } from "@prisma/client";
import { cn, formatDate, formatPrice, STATUS_LABEL } from "@/lib/utils";
import { SHIPPING_METHODS } from "@/lib/shipping";

const FLOW = ["PENDIENTE", "CONFIRMADO", "PREPARANDO", "ENVIADO", "ENTREGADO"];
const PAY_NAME: Record<string, string> = { demo: "Tarjeta (demo)", transfer: "Transferencia bancaria", cod: "Contra entrega", stripe: "Stripe", paypal: "PayPal", payphone: "PayPhone" };

export function StatusBadge({ status }: { status: string }) {
  const color = status === "CANCELADO" || status === "FALLIDO" ? "bg-red-500/15 text-red-300 border-red-500/30" : status === "ENTREGADO" || status === "PAGADO" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : status === "PENDIENTE" ? "bg-white/5 text-white/70 border-white/15" : "bg-giallo/10 text-giallo border-giallo/30";
  return <span className={cn("badge border", color)}>{STATUS_LABEL[status] ?? status}</span>;
}

export function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELADO") return <p className="text-sm text-red-300">Este pedido fue cancelado.</p>;
  const idx = FLOW.indexOf(status);
  return (
    <ol className="grid grid-cols-5 gap-2">
      {FLOW.map((s, i) => (
        <li key={s}><div className={cn("h-1", i <= idx ? "bg-giallo" : "bg-white/10")} /><p className={cn("mt-2 font-tech text-[8px] tracking-[0.15em] uppercase", i <= idx ? "text-white" : "text-white/30")}>{STATUS_LABEL[s]}</p></li>
      ))}
    </ol>
  );
}

export function OrderSummary({ order }: { order: Order & { items: OrderItem[] } }) {
  const ship = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3"><StatusBadge status={order.status} /><StatusBadge status={order.paymentStatus} /><span className="text-sm text-white/50">{formatDate(order.createdAt)}</span></div>
      <OrderTimeline status={order.status} />
      <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {order.items.map((i) => (
          <li key={i.id} className="flex items-center gap-4 py-4">
            <img src={i.image} alt="" className="h-20 w-16 object-cover" />
            <div className="flex-1 text-sm"><p className="font-semibold">{i.name}</p><p className="text-white/50">Talla {i.size} · {i.color} · × {i.quantity}</p></div>
            <p className="text-sm">{formatPrice(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1 text-sm text-white/70">
          <p className="label">Entrega</p>
          <p>{order.customerName} · {order.phone}</p><p>{order.line1}{order.line2 ? `, ${order.line2}` : ""}</p><p>{order.city}, {order.province} {order.postalCode}</p>
          <p className="pt-2 text-white/50">{ship?.name} · {ship?.eta}</p><p className="text-white/50">Pago: {PAY_NAME[order.paymentMethod] ?? order.paymentMethod}</p>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-giallo"><dt>Descuento {order.couponCode && `(${order.couponCode})`}</dt><dd>−{formatPrice(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-white/60">Envío</dt><dd>{order.shippingCost ? formatPrice(order.shippingCost) : "Gratis"}</dd></div>
          <div className="flex justify-between border-t border-white/10 pt-3"><dt className="font-tech text-[10px] tracking-[0.2em]">TOTAL</dt><dd className="font-display text-2xl font-bold">{formatPrice(order.total)}</dd></div>
        </dl>
      </div>
      {order.paymentMethod === "transfer" && order.paymentStatus === "PENDIENTE" && (
        <div className="border border-giallo/30 bg-giallo/5 p-5 text-sm text-white/75">
          <p className="font-tech text-[10px] tracking-[0.2em] text-giallo">DATOS PARA TRANSFERENCIA</p>
          <p className="mt-3">Banco Pichincha · Cuenta corriente 2100123456 · VELOCITY LUXURY S.A. · RUC 1790012345001</p>
          <p className="mt-1">Envía el comprobante a pagos@velocityluxury.com indicando el pedido <b>{order.number}</b>.</p>
        </div>
      )}
    </div>
  );
}
