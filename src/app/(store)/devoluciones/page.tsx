import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
export const metadata: Metadata = { title: "Política de devoluciones" };
export default function Page() {
  return (
    <LegalPage eyebrow="Ayuda" title="Devoluciones" updated="1 de noviembre de 2026">
      <p>Queremos que ames cada pieza. Si no es así, tienes <b className="text-white">30 días</b> desde la entrega para solicitar un cambio o devolución.</p>
      <h2>Condiciones</h2><ul><li>Prendas sin uso, sin lavar y con etiquetas originales.</li><li>Empaque original en buen estado.</li><li>Ropa interior, calcetines y gorras personalizadas no admiten devolución por higiene.</li><li>Las ediciones numeradas admiten cambio de talla sujeto a disponibilidad.</li></ul>
      <h2>Cómo solicitarla</h2><ul><li>Escríbenos desde <Link href="/contacto" className="text-giallo">contacto</Link> indicando tu número de pedido.</li><li>Te enviaremos una guía de envío prepagada (gratis para devoluciones dentro de Ecuador).</li><li>Al recibir y revisar la prenda, procesamos el cambio o reembolso.</li></ul>
      <h2>Reembolsos</h2><p>Se realizan al mismo método de pago en un plazo de 5 a 10 días hábiles. Para pagos contra entrega o transferencia, reembolsamos por transferencia bancaria.</p>
      <h2>Productos defectuosos</h2><p>Si recibes un producto con defectos de fabricación, lo reemplazamos sin costo o reembolsamos el 100% incluido el envío.</p>
    </LegalPage>
  );
}
