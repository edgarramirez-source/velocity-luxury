import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/ui";
import { Coupons } from "@/components/admin/Coupons";

export const dynamic = "force-dynamic";
export const metadata = { title: "Descuentos" };
export default async function Page() {
  const list = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return (<div><AdminHeader title="Descuentos y promociones" subtitle="Códigos aplicables en carrito y checkout." /><Coupons list={list.map((c) => ({ ...c, expiresAt: c.expiresAt?.toISOString() ?? null, createdAt: undefined }))} /></div>);
}
