import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/account/AuthShell";
import { ForgotForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "¿Olvidaste tu contraseña?" };
export default function Page() {
  return <AuthShell eyebrow="Recuperación" title="¿Olvidaste tu contraseña?" subtitle="Te enviaremos un enlace seguro para crear una nueva."><Suspense><ForgotForm /></Suspense></AuthShell>;
}
