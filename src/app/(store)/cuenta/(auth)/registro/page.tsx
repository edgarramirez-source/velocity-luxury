import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/account/AuthShell";
import { RegisterForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Crea tu cuenta" };
export default function Page() {
  return <AuthShell eyebrow="Club Velocity" title="Crea tu cuenta" subtitle="Acceso anticipado a lanzamientos y seguimiento de pedidos."><Suspense><RegisterForm /></Suspense></AuthShell>;
}
