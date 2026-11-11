import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: { default: "Panel administrativo", template: "%s · Admin VELOCITY" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await requireAdmin();
  const [unread, pending] = await Promise.all([prisma.contactMessage.count({ where: { read: false } }), prisma.order.count({ where: { status: "PENDIENTE" } })]);
  return (
    <div className="min-h-screen bg-ink lg:flex">
      <AdminNav name={u.name} unread={unread} pending={pending} />
      <main id="contenido" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
    </div>
  );
}
