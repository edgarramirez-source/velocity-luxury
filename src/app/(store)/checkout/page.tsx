import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { availablePaymentMethods } from "@/lib/payments";
import { Checkout } from "@/components/checkout/Checkout";

export const metadata: Metadata = { title: "Finalizar compra" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const addresses = user ? await prisma.address.findMany({ where: { userId: user.id }, orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] }) : [];
  return (
    <div className="container-x py-14">
      <p className="eyebrow">Checkout seguro</p>
      <h1 className="h-display mt-3 mb-12 text-6xl">Finalizar compra</h1>
      <Suspense><Checkout user={user ? { name: user.name, email: user.email, phone: user.phone } : null} addresses={addresses.map((a) => ({ ...a, createdAt: undefined }))} methods={availablePaymentMethods()} /></Suspense>
    </div>
  );
}
