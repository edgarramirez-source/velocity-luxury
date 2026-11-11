import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/catalog/CatalogView";
import { Reveal } from "@/components/Reveal";
import { ABOUT_IMAGE } from "@/lib/media";

export const metadata: Metadata = { title: "Sobre nosotros", description: "Historia, filosofía y personalidad de VELOCITY LUXURY." };

export default function Nosotros() {
  return (
    <>
      <PageHero eyebrow="Sobre nosotros" title="Nacidos para destacar" subtitle="Una marca de lujo urbano forjada entre el rugido de los motores y la precisión de la sastrería." image={ABOUT_IMAGE} />
      <div className="container-x space-y-32">
        <section className="grid gap-12 lg:grid-cols-2">
          <Reveal><p className="eyebrow">Nuestra historia</p><h2 className="h-display mt-4 text-5xl sm:text-6xl">Del garaje a la pasarela</h2></Reveal>
          <Reveal delay={120} className="space-y-5 text-white/65 leading-relaxed">
            <p>VELOCITY LUXURY nació en 2021 en un pequeño taller de Quito, donde un grupo de diseñadores obsesionados con los superdeportivos italianos se hizo una pregunta: ¿por qué la ropa que vestimos no transmite la misma emoción que un motor a 9.000 revoluciones?</p>
            <p>Empezamos con una sola camiseta de algodón supima y un emblema en forma de V. Hoy diseñamos colecciones completas que combinan materiales europeos, confección artesanal y siluetas inspiradas en la aerodinámica.</p>
            <p>Cada pieza se prueba como un prototipo: forma, función y presencia. Si no acelera el pulso, no sale del taller.</p>
          </Reveal>
        </section>
        <section>
          <Reveal><p className="eyebrow">Filosofía</p><h2 className="h-display mt-4 text-5xl sm:text-6xl">Tres principios</h2></Reveal>
          <div className="mt-12 grid gap-px bg-white/[0.06] md:grid-cols-3">
            {[["01", "Precisión", "Patrones milimétricos y costuras reforzadas. El lujo vive en los detalles que casi nadie ve."], ["02", "Potencia", "Colores con carácter, siluetas firmes y una actitud que no pide permiso."], ["03", "Exclusividad", "Producciones limitadas y numeradas. Preferimos agotar antes que repetir."]].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 100} className="bg-ink p-10"><p className="font-display text-6xl font-bold text-giallo">{n}</p><h3 className="mt-6 font-tech text-sm tracking-[0.25em] uppercase">{t}</h3><p className="mt-4 text-white/55 leading-relaxed">{d}</p></Reveal>
            ))}
          </div>
        </section>
        <section className="grid gap-12 lg:grid-cols-2">
          <Reveal><p className="eyebrow">Personalidad</p><h2 className="h-display mt-4 text-5xl sm:text-6xl">Audaz. Elegante. Imparable.</h2></Reveal>
          <Reveal delay={120} className="space-y-5 text-white/65 leading-relaxed">
            <p>Somos la marca de quienes no siguen tendencias: las crean. Nuestro negro es profundo, nuestro amarillo es eléctrico y nuestro tono es seguro sin ser arrogante.</p>
            <p>Producimos de forma responsable con talleres certificados en Portugal, Italia y Ecuador, usamos algodón orgánico y plumón reciclado, y garantizamos condiciones laborales justas en toda la cadena.</p>
            <dl className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[["2021", "Fundación"], ["12K+", "Clientes"], ["3", "Talleres aliados"]].map(([v, l]) => <div key={l}><dt className="sr-only">{l}</dt><dd className="font-display text-4xl font-bold text-white">{v}</dd><dd className="text-xs text-white/45">{l}</dd></div>)}
            </dl>
          </Reveal>
        </section>
        <Reveal className="border border-white/[0.06] bg-carbon p-12 text-center">
          <p className="font-tech text-xs tracking-[0.4em] text-giallo">BORN TO STAND OUT</p>
          <h2 className="h-display mx-auto mt-4 max-w-3xl text-5xl sm:text-7xl">Tu próxima pieza icónica te espera</h2>
          <Link href="/tienda" className="btn-primary mt-10">Explorar colección <ArrowRight size={16} /></Link>
        </Reveal>
      </div>
    </>
  );
}
