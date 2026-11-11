import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Addresses } from "@/components/account/Addresses";

export const metadata: Metadata = { title: "Direcciones" };
export default async function Page() {
  const u = await requireUser("/cuenta/direcciones");
  const list = await prisma.address.findMany({ where: { userId: u.id }, orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] });
  return <Addresses initial={list.map(({ createdAt: _c, userId: _u, ...a }) => a)} />;
}
