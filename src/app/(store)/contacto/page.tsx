import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/catalog/CatalogView";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";

export const metadata: Metadata = { title: "Contacto" };
export default function Contacto() {
  return (
    <>
      <PageHero eyebrow="Contacto" title="Hablemos" subtitle="Nuestro equipo de atención premium responde en menos de 24 horas hábiles." />
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          {[
            [Mail, "Correo", <a key="m" href="mailto:hola@velocityluxury.com" className="hover:text-giallo">hola@velocityluxury.com</a>],
            [Phone, "WhatsApp / Teléfono", <a key="p" href="tel:+593991234567" className="hover:text-giallo">+593 99 123 4567</a>],
            [MapPin, "Showroom", "Av. González Suárez N27-142, Quito, Ecuador"],
            [Clock, "Horario", "Lunes a sábado · 10:00 – 20:00"],
          ].map(([Icon, t, v]) => { const I = Icon as typeof Mail; return (
            <div key={t as string} className="flex gap-5"><span className="grid h-12 w-12 shrink-0 place-items-center border border-white/10 text-giallo"><I size={18} /></span><div><p className="font-tech text-[9px] tracking-[0.25em] text-white/40 uppercase">{t as string}</p><p className="mt-1.5 text-white/85">{v as React.ReactNode}</p></div></div>
          ); })}
          <div><p className="mb-3 font-tech text-[9px] tracking-[0.25em] text-white/40">REDES SOCIALES</p><SocialIcons /></div>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
