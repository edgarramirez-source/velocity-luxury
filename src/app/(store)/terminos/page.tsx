import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
export const metadata: Metadata = { title: "Términos y condiciones" };
export default function Page() {
  return (
    <LegalPage eyebrow="Legal" title="Términos y condiciones" updated="1 de noviembre de 2026">
      <p>Al utilizar este sitio y realizar compras aceptas los siguientes términos. Te recomendamos leerlos con atención.</p>
      <h2>1. Productos y precios</h2><p>Los precios se expresan en dólares estadounidenses (USD) e incluyen IVA. Nos reservamos el derecho de modificar precios sin previo aviso; el precio aplicable es el vigente al confirmar el pedido.</p>
      <h2>2. Disponibilidad</h2><p>Todos los pedidos están sujetos a disponibilidad de inventario. Si un producto se agota tras tu compra, te contactaremos para ofrecerte una alternativa o el reembolso total.</p>
      <h2>3. Proceso de compra</h2><p>El contrato se perfecciona cuando recibes el correo de confirmación de tu pedido. Los pedidos con transferencia bancaria se confirman al validar el pago.</p>
      <h2>4. Códigos de descuento</h2><p>Los códigos no son acumulables, tienen condiciones de compra mínima y vigencia, y no pueden canjearse por dinero.</p>
      <h2>5. Ediciones limitadas</h2><p>Las piezas exclusivas y numeradas pueden tener límite de unidades por cliente. Nos reservamos el derecho de cancelar pedidos que infrinjan dicho límite.</p>
      <h2>6. Propiedad intelectual</h2><p>La marca VELOCITY LUXURY, su logotipo, fotografías y diseños son propiedad exclusiva de la empresa y no pueden utilizarse sin autorización.</p>
      <h2>7. Legislación aplicable</h2><p>Estos términos se rigen por las leyes de la República del Ecuador, incluida la Ley Orgánica de Defensa del Consumidor.</p>
    </LegalPage>
  );
}
