import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SHIPPING_METHODS, FREE_SHIPPING_FROM } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
export const metadata: Metadata = { title: "Información de envíos" };
export default function Page() {
  return (
    <LegalPage eyebrow="Ayuda" title="Envíos">
      <p>Enviamos a todo Ecuador con transportistas especializados y seguimiento en tiempo real. Los pedidos confirmados antes de las 14:00 se despachan el mismo día hábil.</p>
      <div className="not-prose my-10 grid gap-3 sm:grid-cols-3">
        {SHIPPING_METHODS.map((m) => (
          <div key={m.id} className="card p-6"><p className="font-tech text-[10px] tracking-[0.2em] text-giallo">{m.name.toUpperCase()}</p><p className="mt-3 font-display text-4xl font-bold text-white">{m.price ? formatPrice(m.price) : "Gratis"}</p><p className="mt-1 text-sm text-white/55">{m.eta}</p></div>
        ))}
      </div>
      <h2>Envío gratis</h2><p>El envío estándar es gratuito en pedidos desde {formatPrice(FREE_SHIPPING_FROM)} después de descuentos. También puedes usar el código ENVIOGRATIS cuando esté activo.</p>
      <h2>Cobertura</h2><ul><li>Quito y Guayaquil: Express 24 h disponible.</li><li>Capitales de provincia: 2 a 4 días hábiles.</li><li>Zonas rurales y Galápagos: 4 a 8 días hábiles.</li></ul>
      <h2>Seguimiento</h2><p>Recibirás un correo cada vez que tu pedido cambie de estado. También puedes consultarlo en Mi cuenta → Mis pedidos.</p>
      <h2>Empaque</h2><p>Todas las prendas viajan en nuestra caja negra rígida con papel de seda amarillo. Las ediciones exclusivas incluyen caja de presentación numerada.</p>
    </LegalPage>
  );
}
