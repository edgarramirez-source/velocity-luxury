import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/account/AuthShell";
import { ResetForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Nueva contraseña" };
export default function Page() {
  return <AuthShell eyebrow="Seguridad" title="Nueva contraseña" subtitle="Elige una contraseña segura para tu cuenta."><Suspense><ResetForm /></Suspense></AuthShell>;
}
