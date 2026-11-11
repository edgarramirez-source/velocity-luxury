import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/catalog/CatalogView";

export const metadata: Metadata = { title: "Preguntas frecuentes" };
const FAQ: [string, [string, React.ReactNode][]][] = [
  ["Pedidos y pagos", [
    ["¿Qué métodos de pago aceptan?", "Tarjetas de crédito y débito (vía PayPhone o Stripe), PayPal, transferencia bancaria y pago contra entrega en Quito y Guayaquil."],
    ["¿Es seguro comprar en VELOCITY LUXURY?", "Sí. Usamos conexiones cifradas y no almacenamos datos de tarjetas: los pagos son procesados directamente por pasarelas certificadas PCI-DSS."],
    ["¿Puedo modificar o cancelar mi pedido?", <>Puedes hacerlo mientras esté en estado “Pendiente” o “Confirmado”. Escríbenos desde <Link href="/contacto" className="text-giallo">contacto</Link> con tu número de pedido.</>],
    ["¿Necesito una cuenta para comprar?", "No, puedes comprar como invitado. Con una cuenta podrás seguir tus pedidos, guardar direcciones y favoritos."],
  ]],
  ["Envíos", [
    ["¿Cuánto tarda mi pedido?", "Envío estándar: 3 a 5 días hábiles. Express: 24 a 48 horas. Retiro en showroom: listo en 24 horas."],
    ["¿Cuánto cuesta el envío?", "Estándar $5.99 (gratis sobre $150), Express $14.99, retiro en showroom gratis."],
    ["¿Hacen envíos internacionales?", "Por ahora enviamos a todo Ecuador, incluido Galápagos. Pronto habilitaremos envíos internacionales."],
  ]],
  ["Productos y tallas", [
    ["¿Cómo elijo mi talla?", "Cada producto incluye una guía de tallas. Si estás entre dos tallas y buscas un fit oversize, elige la mayor."],
    ["¿Qué significa “Exclusivo”?", "Son piezas de ediciones limitadas y numeradas (como APEX ATELIER). Una vez agotadas no se reponen."],
    ["¿Cómo cuido mis prendas?", "Lava en frío del revés y sin secadora. Las piezas exclusivas requieren limpieza profesional."],
  ]],
  ["Cambios y devoluciones", [
    ["¿Puedo devolver un producto?", <>Sí, dispones de 30 días desde la entrega. Consulta la <Link href="/devoluciones" className="text-giallo">política de devoluciones</Link>.</>],
    ["¿Cuándo recibo mi reembolso?", "Entre 5 y 10 días hábiles después de que recibamos y revisemos la prenda."],
  ]],
];
export default function Faq() {
  return (
    <>
      <PageHero eyebrow="Ayuda" title="Preguntas frecuentes" />
      <div className="container-x max-w-4xl space-y-14">
        {FAQ.map(([cat, qs]) => (
          <section key={cat}>
            <h2 className="eyebrow mb-5">{cat}</h2>
            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {qs.map(([q, a]) => (
                <details key={q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold transition hover:text-giallo [&::-webkit-details-marker]:hidden">{q}<span className="text-2xl font-light text-giallo transition group-open:rotate-45">+</span></summary>
                  <div className="mt-3 max-w-2xl leading-relaxed text-white/60">{a}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="text-white/50">¿No encuentras tu respuesta? <Link href="/contacto" className="text-giallo hover:underline">Escríbenos</Link>.</p>
      </div>
    </>
  );
}
