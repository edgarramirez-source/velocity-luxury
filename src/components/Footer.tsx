import Link from "next/link";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";
import { Newsletter } from "./Newsletter";

const COLS = [
  { title: "Tienda", links: [["Hombres", "/tienda?genero=HOMBRE"], ["Mujeres", "/tienda?genero=MUJER"], ["Colecciones", "/colecciones"], ["Ofertas", "/ofertas"], ["Novedades", "/tienda?orden=novedades"]] },
  { title: "Ayuda", links: [["Preguntas frecuentes", "/faq"], ["Información de envíos", "/envios"], ["Devoluciones", "/devoluciones"], ["Contacto", "/contacto"], ["Mi cuenta", "/cuenta"]] },
  { title: "Marca", links: [["Sobre nosotros", "/nosotros"], ["Términos y condiciones", "/terminos"], ["Política de privacidad", "/privacidad"]] },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/[0.06] bg-carbon">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-giallo to-transparent opacity-60" />
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-6 text-sm leading-relaxed text-white/50">Moda urbana de lujo con ADN de superdeportivo. Diseñada para quienes nacieron para destacar.</p>
          <p className="mt-6 font-tech text-[10px] tracking-[0.3em] text-giallo">BORN TO STAND OUT</p>
          <div className="mt-8"><Newsletter /></div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="font-tech text-[10px] tracking-[0.3em] uppercase text-white/40">{c.title}</h3>
            <ul className="mt-6 space-y-3.5">
              {c.links.map(([l, h]) => <li key={l}><Link href={h} className="text-sm text-white/70 transition hover:text-giallo">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} VELOCITY LUXURY. Todos los derechos reservados. Quito · Ecuador</p>
          <SocialIcons />
          <div className="flex items-center gap-2 text-[10px] font-tech tracking-widest text-white/40">
            {["VISA", "MASTERCARD", "PAYPAL", "PAYPHONE"].map((p) => <span key={p} className="border border-white/10 px-2 py-1">{p}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
