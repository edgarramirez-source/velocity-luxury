"use client";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

export function FavoriteButton({ productId, name, className = "", withLabel = false }: { productId: string; name: string; className?: string; withLabel?: boolean }) {
  const { favorites, setFav, toast } = useUI();
  const router = useRouter();
  const on = favorites.has(productId);
  async function toggle(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    setFav(productId, !on);
    const r = await fetch("/api/favorites", { method: on ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
    if (r.status === 401) {
      setFav(productId, false);
      toast({ title: "Inicia sesión", description: "Necesitas una cuenta para guardar favoritos.", tone: "info", action: { label: "Iniciar sesión", href: `/cuenta/login?next=${encodeURIComponent(location.pathname)}` } });
      return;
    }
    if (!r.ok) { setFav(productId, on); toast({ title: "Error", description: "No se pudo actualizar favoritos.", tone: "error" }); return; }
    toast({ title: on ? "Eliminado de favoritos" : "Añadido a favoritos", description: name, tone: "success", action: on ? undefined : { label: "Ver favoritos", href: "/cuenta/favoritos" } });
    router.refresh();
  }
  return (
    <button onClick={toggle} aria-pressed={on} aria-label={on ? `Quitar ${name} de favoritos` : `Añadir ${name} a favoritos`} className={cn("flex items-center gap-2 transition", className)}>
      <Heart size={18} className={cn("transition-all duration-300", on ? "fill-giallo text-giallo scale-110" : "text-white")} />
      {withLabel && <span className="font-tech text-[10px] tracking-[0.2em] uppercase">{on ? "En favoritos" : "Favoritos"}</span>}
    </button>
  );
}
