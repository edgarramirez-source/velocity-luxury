"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, MapPin, Package, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/store/ui";

const ITEMS = [
  { href: "/cuenta", label: "Perfil", icon: User },
  { href: "/cuenta/pedidos", label: "Mis pedidos", icon: Package },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: MapPin },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: Heart },
];

export function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname(); const router = useRouter(); const toast = useUI((s) => s.toast);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); toast({ title: "Sesión cerrada", tone: "info" }); router.push("/"); router.refresh(); }
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Mi cuenta">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const on = href === "/cuenta" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} aria-current={on ? "page" : undefined} className={cn("flex shrink-0 items-center gap-3 border-l-2 px-4 py-3 text-sm transition", on ? "border-giallo bg-white/[0.04] text-white" : "border-transparent text-white/55 hover:text-white")}><Icon size={16} />{label}</Link>;
      })}
      {isAdmin && <Link href="/admin" className="flex shrink-0 items-center gap-3 border-l-2 border-transparent px-4 py-3 text-sm text-giallo hover:bg-white/[0.04]"><LayoutDashboard size={16} />Panel admin</Link>}
      <button onClick={logout} className="flex shrink-0 items-center gap-3 border-l-2 border-transparent px-4 py-3 text-left text-sm text-white/55 hover:text-red-400"><LogOut size={16} />Cerrar sesión</button>
    </nav>
  );
}
