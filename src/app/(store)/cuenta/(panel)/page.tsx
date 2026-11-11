import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { ProfileForm, PasswordForm } from "@/components/account/ProfileForms";
import { StatusBadge } from "@/components/orders/OrderSummary";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function Perfil() {
  const u = await requireUser();
  const [orders, favs, addrs, last] = await Promise.all([
    prisma.order.aggregate({ where: { userId: u.id, status: { not: "CANCELADO" } }, _count: true, _sum: { total: true } }),
    prisma.favorite.count({ where: { userId: u.id } }), prisma.address.count({ where: { userId: u.id } }),
    prisma.order.findFirst({ where: { userId: u.id }, orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div className="space-y-10">
      <div className="grid gap-3 sm:grid-cols-4">
        {[["Pedidos", orders._count, "/cuenta/pedidos"], ["Total invertido", formatPrice(orders._sum.total ?? 0), "/cuenta/pedidos"], ["Favoritos", favs, "/cuenta/favoritos"], ["Direcciones", addrs, "/cuenta/direcciones"]].map(([l, v, h]) => (
          <Link key={l as string} href={h as string} className="card p-5 transition hover:border-giallo/40"><p className="font-tech text-[9px] tracking-[0.2em] text-white/40 uppercase">{l}</p><p className="mt-2 font-display text-3xl font-bold">{v}</p></Link>
        ))}
      </div>
      {last && (
        <Link href={`/cuenta/pedidos/${last.number}`} className="card flex flex-wrap items-center justify-between gap-4 p-5 transition hover:border-giallo/40">
          <div><p className="font-tech text-[9px] tracking-[0.2em] text-white/40">ÚLTIMO PEDIDO</p><p className="mt-1 font-semibold">{last.number} · {formatDate(last.createdAt)}</p></div>
          <div className="flex items-center gap-4"><StatusBadge status={last.status} /><span className="font-display text-xl font-bold">{formatPrice(last.total)}</span></div>
        </Link>
      )}
      <section className="card p-6 sm:p-8"><h2 className="font-tech text-xs tracking-[0.3em]">DATOS PERSONALES</h2><p className="mt-1 text-sm text-white/40">Miembro desde {formatDate(u.createdAt)}</p><div className="mt-6"><ProfileForm name={u.name} phone={u.phone ?? ""} email={u.email} /></div></section>
      <section className="card p-6 sm:p-8"><h2 className="font-tech text-xs tracking-[0.3em]">SEGURIDAD</h2><div className="mt-6"><PasswordForm /></div></section>
    </div>
  );
}
