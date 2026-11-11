"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, ExternalLink, LogOut, Mail, Menu, Package, ShoppingCart, Tag, Users, X } from "lucide-react";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Estadísticas", icon: BarChart3 },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/descuentos", label: "Descuentos", icon: Tag },
  { href: "/admin/mensajes", label: "Mensajes", icon: Mail },
];

export function AdminNav({ name, unread, pending }: { name: string; unread: number; pending: number }) {
  const pathname = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Administración">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const on = href === "/admin" ? pathname === href : pathname.startsWith(href);
        const count = href === "/admin/mensajes" ? unread : href === "/admin/pedidos" ? pending : 0;
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={on ? "page" : undefined} className={cn("flex items-center gap-3 border-l-2 px-4 py-3 text-sm transition", on ? "border-giallo bg-white/[0.05] text-white" : "border-transparent text-white/55 hover:bg-white/[0.03] hover:text-white")}>
            <Icon size={17} />{label}{count > 0 && <span className="ml-auto rounded-full bg-giallo px-2 text-[10px] font-bold text-black">{count}</span>}
          </Link>
        );
      })}
    </nav>
  );
  const footer = (
    <div className="space-y-1 border-t border-white/10 pt-4">
      <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/55 hover:text-giallo"><ExternalLink size={16} />Ver tienda</Link>
      <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/55 hover:text-red-400"><LogOut size={16} />Cerrar sesión</button>
      <p className="px-4 pt-2 text-xs text-white/30">{name}</p>
    </div>
  );
  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-carbon px-4 py-3 lg:hidden">
        <Logo /><button onClick={() => setOpen(!open)} aria-label="Menú de administración" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="fade-in border-b border-white/10 bg-carbon p-4 lg:hidden">{nav}<div className="mt-4">{footer}</div></div>}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-white/[0.06] bg-carbon p-5 lg:flex">
        <div><div className="mb-2 px-2"><Logo /></div><p className="mb-8 px-2 font-tech text-[8px] tracking-[0.4em] text-white/30">PANEL ADMINISTRATIVO</p>{nav}</div>
        {footer}
      </aside>
    </>
  );
}
