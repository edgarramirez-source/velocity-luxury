import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
export const metadata: Metadata = { title: "Política de privacidad" };
export default function Page() {
  return (
    <LegalPage eyebrow="Legal" title="Privacidad" updated="1 de noviembre de 2026">
      <p>En VELOCITY LUXURY respetamos tu privacidad y tratamos tus datos personales conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP).</p>
      <h2>1. Responsable del tratamiento</h2><p>VELOCITY LUXURY S.A., con domicilio en Quito, Ecuador. Contacto: privacidad@velocityluxury.com.</p>
      <h2>2. Datos que recopilamos</h2><ul><li>Datos de identificación y contacto: nombre, correo, teléfono, cédula/RUC.</li><li>Datos de entrega: direcciones de envío.</li><li>Datos de compra: pedidos, productos y preferencias (favoritos).</li><li>Datos técnicos: cookies esenciales de sesión y carrito.</li></ul>
      <h2>3. Finalidades</h2><ul><li>Procesar y entregar tus pedidos.</li><li>Gestionar tu cuenta y atención al cliente.</li><li>Enviar comunicaciones comerciales si te suscribes (puedes darte de baja en cualquier momento).</li><li>Cumplir obligaciones tributarias y legales.</li></ul>
      <h2>4. Pagos</h2><p>No almacenamos datos de tarjetas. Los pagos se procesan a través de pasarelas certificadas (PayPhone, PayPal, Stripe) bajo sus propias políticas.</p>
      <h2>5. Conservación</h2><p>Conservamos tus datos mientras mantengas tu cuenta y durante los plazos legales aplicables a la facturación.</p>
      <h2>6. Tus derechos</h2><p>Puedes ejercer tus derechos de acceso, rectificación, eliminación, oposición y portabilidad escribiendo a privacidad@velocityluxury.com.</p>
      <h2>7. Seguridad</h2><p>Aplicamos cifrado en tránsito, contraseñas con hash seguro y controles de acceso restringido al panel administrativo.</p>
    </LegalPage>
  );
}
