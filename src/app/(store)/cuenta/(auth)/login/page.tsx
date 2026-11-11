import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/account/AuthShell";
import { LoginForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Inicia sesión" };
export default function Page() {
  return <AuthShell eyebrow="Acceso" title="Inicia sesión" subtitle="Accede a tus pedidos, favoritos y direcciones."><Suspense><LoginForm /></Suspense></AuthShell>;
}
