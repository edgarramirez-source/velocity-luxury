import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES, COLLECTIONS, COLORS, PRODUCTS } from "./catalog";
import photosJson from "./photos.json";

const PHOTOS = photosJson as Record<string, string>;

const prisma = new PrismaClient();
const ACCESSORY = ["cap", "beanie", "bag", "sunglasses", "belt", "socks"];

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.orderItem.deleteMany(); await prisma.order.deleteMany(); await prisma.favorite.deleteMany();
  await prisma.address.deleteMany(); await prisma.passwordResetToken.deleteMany(); await prisma.user.deleteMany();
  await prisma.product.deleteMany(); await prisma.category.deleteMany(); await prisma.collection.deleteMany();
  await prisma.coupon.deleteMany(); await prisma.contactMessage.deleteMany(); await prisma.subscriber.deleteMany();

  const cats: Record<string, string> = {};
  for (const [i, c] of CATEGORIES.entries()) {
    const r = await prisma.category.create({ data: { slug: c.slug, name: c.name, description: c.description, image: (() => { const top = PRODUCTS.filter((x) => x.category === c.slug).sort((a, b) => b.soldCount - a.soldCount)[0]; return (top && PHOTOS[`product:${top.slug}`]) ?? `/images/categories/${c.slug}.svg`; })(), sortOrder: i } });
    cats[c.slug] = r.id;
  }
  const cols: Record<string, string> = {};
  for (const c of COLLECTIONS) {
    const r = await prisma.collection.create({ data: { slug: c.slug, name: c.name, tagline: c.tagline, description: c.description, exclusive: c.exclusive, image: PHOTOS[`collection:${c.slug}`] ?? `/images/collections/${c.slug}.svg` } });
    cols[c.slug] = r.id;
  }
  const products: import("@prisma/client").Product[] = [];
  for (const p of PRODUCTS) {
    const colorObjs = p.colors.map((k) => ({ name: COLORS[k].name, hex: COLORS[k].hex, image: `/images/products/${p.slug}-${k}.svg` }));
    const extra = `/images/products/${p.slug}-${ACCESSORY.includes(p.shape) ? "detail" : "back"}.svg`;
    const photo = PHOTOS[`product:${p.slug}`];
    if (photo) colorObjs[0].image = photo;
    const images = photo ? [photo, ...colorObjs.slice(1).map((c) => c.image)] : [colorObjs[0].image, extra, ...colorObjs.slice(1).map((c) => c.image)];
    const created = new Date(Date.now() - p.daysAgo * 86400000);
    products.push(await prisma.product.create({
      data: {
        slug: p.slug, name: p.name, description: p.description, details: p.details.join("\n"), price: p.price, compareAt: p.compareAt ?? null,
        gender: p.gender, images: JSON.stringify(images), sizes: JSON.stringify(p.sizes), colors: JSON.stringify(colorObjs),
        model3d: PHOTOS[`model3d:${p.slug}`] ?? null, stock: p.stock, isNew: !!p.isNew, isExclusive: !!p.isExclusive, soldCount: p.soldCount, categoryId: cats[p.category],
        collectionId: p.collection ? cols[p.collection] : null, createdAt: created,
      },
    }));
  }

  const admin = await prisma.user.create({ data: { email: "admin@velocityluxury.com", name: "Administrador Velocity", passwordHash: await bcrypt.hash("Admin123!", 10), role: "ADMIN" } });
  const customer = await prisma.user.create({
    data: {
      email: "cliente@velocityluxury.com", name: "Valentina Ríos", phone: "+593 99 123 4567", passwordHash: await bcrypt.hash("Cliente123!", 10),
      addresses: { create: [
        { label: "Casa", fullName: "Valentina Ríos", phone: "+593 99 123 4567", line1: "Av. República de El Salvador N34-127", line2: "Edificio Torre Azul, piso 8", city: "Quito", province: "Pichincha", postalCode: "170135", isDefault: true },
        { label: "Oficina", fullName: "Valentina Ríos", phone: "+593 99 123 4567", line1: "Av. 9 de Octubre 1911", city: "Guayaquil", province: "Guayas", postalCode: "090313" },
      ] },
    },
  });
  const names = ["Mateo Andrade", "Camila Torres", "Sebastián Vega", "Isabella Mora", "Nicolás Paredes", "Lucía Herrera", "Andrés Salazar", "Martina Cevallos"];
  const others = [];
  for (const [i, n] of names.entries()) {
    others.push(await prisma.user.create({ data: { email: `${n.split(" ")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}${i}@demo.com`, name: n, passwordHash: await bcrypt.hash("Demo1234!", 10), createdAt: new Date(Date.now() - (90 - i * 9) * 86400000) } }));
  }
  await prisma.favorite.createMany({ data: products.slice(0, 4).map((p) => ({ userId: customer.id, productId: p.id })) });

  await prisma.coupon.createMany({ data: [
    { code: "VELOCITY10", description: "10% de descuento en toda la tienda", type: "PERCENT", value: 10 },
    { code: "BIENVENIDA20", description: "20% en tu primera compra sobre $150", type: "PERCENT", value: 20, minSubtotal: 150, usageLimit: 500 },
    { code: "ENVIOGRATIS", description: "Envío estándar gratis", type: "FREESHIP", value: 0 },
    { code: "VIP50", description: "$50 de descuento en compras sobre $300", type: "FIXED", value: 50, minSubtotal: 300 },
  ] });

  // Pedidos de demostración para estadísticas
  const statuses = ["ENTREGADO", "ENTREGADO", "ENTREGADO", "ENVIADO", "PREPARANDO", "CONFIRMADO", "PENDIENTE", "CANCELADO"];
  const cities = [["Quito", "Pichincha"], ["Guayaquil", "Guayas"], ["Cuenca", "Azuay"], ["Manta", "Manabí"], ["Ambato", "Tungurahua"]];
  let seq = 1000;
  const rnd = (n: number) => Math.floor(Math.random() * n);
  for (let i = 0; i < 46; i++) {
    const u = i % 5 === 0 ? customer : others[rnd(others.length)];
    const lines = Array.from({ length: 1 + rnd(3) }, () => products[rnd(products.length)]);
    const items = lines.map((p) => { const colors = JSON.parse(p.colors); const sizes = JSON.parse(p.sizes); const c = colors[rnd(colors.length)];
      return { productId: p.id, name: p.name, image: c.image ?? JSON.parse(p.images)[0], price: p.price, size: sizes[rnd(sizes.length)], color: c.name, quantity: 1 + rnd(2) }; });
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingCost = subtotal >= 150 ? 0 : 5.99;
    const status = statuses[rnd(statuses.length)];
    const [city, province] = cities[rnd(cities.length)];
    const createdAt = new Date(Date.now() - rnd(60) * 86400000 - rnd(86400000));
    await prisma.order.create({ data: {
      number: `VL-${++seq}`, userId: u.id, email: u.email, customerName: u.name, phone: "+593 98 765 4321", line1: "Av. Amazonas N24-03", city, province,
      shippingMethod: "standard", shippingCost, subtotal, discount: 0, total: subtotal + shippingCost, paymentMethod: i % 3 === 0 ? "transfer" : "demo",
      paymentStatus: status === "CANCELADO" ? "FALLIDO" : status === "PENDIENTE" ? "PENDIENTE" : "PAGADO", status, createdAt,
      items: { create: items },
    } });
  }
  await prisma.contactMessage.create({ data: { name: "Daniel Pérez", email: "daniel@demo.com", subject: "Colaboración", message: "Hola, me interesa una colaboración para un evento de autos clásicos en Quito." } });
  console.log(`Seed completado: ${products.length} productos, admin=${admin.email}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
