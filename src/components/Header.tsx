"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import { cartCount, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/tienda?genero=HOMBRE", label: "Hombres", match: "HOMBRE" },
  { href: "/tienda?genero=MUJER", label: "Mujeres", match: "MUJER" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/contacto", label: "Contacto" },
];

export function Header({ user }: { user: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); const f = () => setScrolled(window.scrollY > 30); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => setMobile(false), [pathname, sp]);
  const count = mounted ? cartCount(items) : 0;
  const isActive = (n: (typeof NAV)[number]) => {
    if (n.match) return pathname === "/tienda" && sp.get("genero") === n.match;
    if (n.href === "/") return pathname === "/";
    return pathname.startsWith(n.href);
  };
  const transparent = pathname === "/" && !scrolled && !mobile;

  return (
    <>
      <div className="relative z-50 overflow-hidden bg-giallo py-2 text-center font-tech text-[9px] tracking-[0.3em] text-black">
        <span className="sm:hidden">ENVÍO GRATIS SOBRE $150</span><span className="hidden sm:inline">ENVÍO GRATIS EN PEDIDOS SOBRE $150 · CÓDIGO <b>BIENVENIDA20</b> EN TU PRIMERA COMPRA</span>
      </div>
      <header className={cn("sticky top-0 z-40 transition-all duration-500", transparent ? "bg-transparent" : "border-b border-white/[0.06] bg-ink/85 backdrop-blur-xl")}>
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden -ml-2 p-2 text-white" onClick={() => setMobile(!mobile)} aria-label={mobile ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobile}>
              {mobile ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Logo />
          </div>
          <nav className="hidden lg:flex items-center gap-9" aria-label="Principal">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className={cn("link-underline font-tech text-[10px] tracking-[0.25em] uppercase transition-colors", isActive(n) ? "text-giallo after:w-full" : "text-white/75 hover:text-white", n.label === "Ofertas" && !isActive(n) && "text-giallo/90")}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2.5 text-white/80 hover:text-giallo transition" aria-label="Buscar productos"><Search size={20} /></button>
            {user?.role === "ADMIN" && <Link href="/admin" className="hidden sm:block p-2.5 text-white/80 hover:text-giallo transition" aria-label="Panel administrativo" title="Panel administrativo"><LayoutDashboard size={20} /></Link>}
            <Link href="/cuenta/favoritos" className="hidden sm:block p-2.5 text-white/80 hover:text-giallo transition" aria-label="Favoritos"><Heart size={20} /></Link>
            <Link href={user ? "/cuenta" : "/cuenta/login"} className="flex items-center gap-2 p-2.5 text-white/80 hover:text-giallo transition" aria-label={user ? "Mi cuenta" : "Iniciar sesión"}>
              <User size={20} />{user && <span className="hidden xl:block font-tech text-[9px] tracking-[0.2em] uppercase">{user.name.split(" ")[0]}</span>}
            </Link>
            <button onClick={() => setOpen(true)} className="relative p-2.5 text-white/80 hover:text-giallo transition" aria-label={`Carrito, ${count} productos`}>
              <ShoppingBag size={20} />
              <span className={cn("absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-giallo px-1 text-[10px] font-bold text-black transition-transform", count ? "scale-100" : "scale-0")}>{count}</span>
            </button>
          </div>
        </div>
        {mobile && (
          <div className="lg:hidden fade-in border-t border-white/10 bg-ink/98 backdrop-blur-xl">
            <nav className="container-x flex flex-col py-4" aria-label="Móvil">
              {NAV.map((n, i) => (
                <Link key={n.label} href={n.href} style={{ animationDelay: `${i * 50}ms` }} className={cn("rise border-b border-white/5 py-4 font-display text-3xl font-bold uppercase", isActive(n) ? "text-giallo" : "text-white")}>{n.label}</Link>
              ))}
              <div className="flex gap-6 pt-5 font-tech text-[10px] tracking-[0.2em] uppercase text-white/60">
                <Link href="/cuenta/favoritos">Favoritos</Link><Link href="/tienda">Toda la tienda</Link>{user?.role === "ADMIN" && <Link href="/admin" className="text-giallo">Admin</Link>}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
