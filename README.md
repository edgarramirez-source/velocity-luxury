# VELOCITY LUXURY — Tienda online de moda urbana de lujo

Tienda completa (frontend + backend) con estética de superdeportivo: catálogo con filtros, carrito, checkout, cuentas de usuario y panel administrativo.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma + PostgreSQL · JWT (jose) en cookie httpOnly · bcrypt · Zod · Zustand.

## Puesta en marcha

```bash
npm install
cp .env.example .env        # pon tu DATABASE_URL de PostgreSQL y un AUTH_SECRET de 32+ caracteres
npm run setup               # crea la base de datos y carga los datos de demostración
npm run dev                 # http://localhost:3000
```

Producción: `npm run build && npm start`.

### Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@velocityluxury.com | Admin123! |
| Cliente | cliente@velocityluxury.com | Cliente123! |

Códigos de descuento: `VELOCITY10` (10%), `BIENVENIDA20` (20% sobre $150), `ENVIOGRATIS`, `VIP50` ($50 sobre $300).
Tarjeta demo: `4242 4242 4242 4242` (aprobada) · `4000 0000 0000 0002` (rechazada).

## Funcionalidades

- **Tienda:** inicio con hero animado, categorías, novedades, colecciones, más vendidos, newsletter. Catálogo con búsqueda, filtros (categoría, género, precio, talla, color, novedades/exclusivos/ofertas), orden (precio, popularidad, novedades) y paginación. Ficha de producto con galería/zoom, selección de color (cambia la imagen), talla, cantidad, guía de tallas, favoritos y etiquetas NUEVO / EXCLUSIVO / OFERTA.
- **Carrito:** persistente, edición de talla/color/cantidad, sincronización de precio y stock con la base, cupones, estimación de envío.
- **Checkout en 4 pasos:** datos, dirección (o direcciones guardadas), envío, pago, confirmación. El servidor recalcula precios, valida stock/variantes/cupón y descuenta inventario en una transacción.
- **Usuarios:** registro, login, recuperación de contraseña por token (hash SHA-256, expira en 1 h), perfil, cambio de contraseña, historial de pedidos, direcciones y favoritos.
- **Admin (`/admin`, solo rol ADMIN):** estadísticas (ingresos, ticket promedio, ingresos diarios, más vendidos, stock bajo), CRUD de productos con subida de imágenes, precios, inventario, tallas y colores; pedidos con cambio de estado (cancelar repone stock y se notifica al cliente); clientes y roles; cupones; mensajes de contacto.
- **Páginas:** Sobre nosotros, Contacto (formulario guardado en BD), FAQ, Privacidad, Términos, Devoluciones, Envíos.

## Pagos

Configura las variables en `.env` y el método aparece automáticamente en el checkout:

| Pasarela | Variables | Flujo |
|---|---|---|
| Stripe | `STRIPE_SECRET_KEY` | Stripe Checkout → `/api/payments/stripe/return` verifica la sesión |
| PayPal | `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE` | Orders v2 → captura en `/api/payments/paypal/return` |
| PayPhone | `PAYPHONE_TOKEN`, `PAYPHONE_STORE_ID` | Botón de pago → confirmación en `/api/payments/payphone/return` |
| Demo / Transferencia / Contra entrega | `PAYMENT_DEMO_ENABLED` | Sin pasarela externa |

Antes de publicar, prueba cada pasarela con sus credenciales sandbox; las integraciones están implementadas según sus APIs públicas pero no se probaron contra cuentas reales.

## Correo

Sin `SMTP_*`, los correos (confirmación de pedido, cambio de estado, recuperación de contraseña) se imprimen en la consola del servidor y, en desarrollo, la pantalla de recuperación muestra el enlace directamente.

## Imágenes

Las imágenes de producto incluidas son renders de estudio vectoriales generados por `npm run images` (`scripts/generate-images.ts`). Sustitúyelas por fotografía real desde el panel admin (Productos → Editar → Subir imágenes). Las subidas se guardan en `/uploads` y se sirven desde `/api/uploads/*` (JPG/PNG/WEBP/AVIF, máx. 5 MB, con verificación de firma).

## Publicar en Vercel

1. Crea una base PostgreSQL gratuita en [Neon](https://neon.tech) y copia su *connection string*.
2. En Vercel: **Add New → Project** → importa este repositorio.
3. Variables de entorno: `DATABASE_URL` (Neon), `AUTH_SECRET` (cadena aleatoria de 32+ caracteres) y `NEXT_PUBLIC_SITE_URL` (la URL final, p. ej. `https://velocity-luxury.vercel.app`).
4. **Deploy.** El script `vercel-build` crea las tablas y, si la base está vacía, carga los datos de demostración automáticamente (nunca borra datos existentes).
5. Para subir imágenes desde el admin en producción: en el proyecto de Vercel, **Storage → Create → Blob** y conéctalo; Vercel añade `BLOB_READ_WRITE_TOKEN` solo. Sin él, las subidas usan el disco local (válido solo en un servidor propio).

Notas: el limitador de intentos de login es en memoria (con muchas instancias conviene Redis). Las fotos y modelos 3D enlazan al CDN de Higgsfield; para no depender de él, descárgalas y súbelas desde el admin.

## Vista 360°

Los productos con campo `model3d` (URL de un `.glb`) muestran el botón **VER EN 360°** con un visor interactivo (`@google/model-viewer`). Se edita en Admin → Productos → Editar.
