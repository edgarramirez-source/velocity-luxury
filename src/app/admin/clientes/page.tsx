import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/utils";
import { AdminHeader, Th } from "@/components/admin/ui";
import { CustomerActions } from "@/components/admin/CustomerActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clientes" };

export default async function Clientes({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const me = await requireAdmin(); const { q } = await searchParams;
  const users = await prisma.user.findMany({ where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}, orderBy: { createdAt: "desc" }, include: { orders: { where: { status: { not: "CANCELADO" } }, select: { total: true, createdAt: true } }, _count: { select: { favorites: true, addresses: true } } } });
  const subs = await prisma.subscriber.count();
  return (
    <div>
      <AdminHeader title="Clientes" subtitle={`${users.length} cuentas · ${subs} suscriptores al newsletter`} />
      <div className="card">
        <form className="border-b border-white/[0.06] p-4"><input name="q" defaultValue={q} placeholder="Buscar por nombre o correo..." className="input max-w-md py-2" aria-label="Buscar clientes" /></form>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="border-b border-white/[0.06]"><tr><Th>Cliente</Th><Th>Registro</Th><Th>Pedidos</Th><Th>Total gastado</Th><Th>Último pedido</Th><Th>Favoritos</Th><Th className="text-right">Rol / acciones</Th></tr></thead>
          <tbody>{users.map((u) => { const spent = u.orders.reduce((s, o) => s + o.total, 0); const last = u.orders.sort((a, b) => +b.createdAt - +a.createdAt)[0]; return (
            <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
              <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-semibold">{u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span><div><p className="font-semibold">{u.name}{u.role === "ADMIN" && <span className="badge ml-2 bg-giallo/15 py-0.5 text-giallo">Admin</span>}</p><p className="text-xs text-white/40">{u.email}{u.phone ? ` · ${u.phone}` : ""}</p></div></div></td>
              <td className="px-4 py-3 text-white/50">{formatDate(u.createdAt)}</td>
              <td className="px-4 py-3">{u.orders.length}</td>
              <td className="px-4 py-3">{formatPrice(spent)}</td>
              <td className="px-4 py-3 text-white/50">{last ? formatDate(last.createdAt) : "—"}</td>
              <td className="px-4 py-3 text-white/60">{u._count.favorites}</td>
              <td className="px-4 py-3"><CustomerActions id={u.id} name={u.name} role={u.role} self={u.id === me.id} /></td>
            </tr>
          ); })}</tbody>
        </table>{users.length === 0 && <p className="p-10 text-center text-white/50">Sin resultados.</p>}</div>
      </div>
    </div>
  );
}
