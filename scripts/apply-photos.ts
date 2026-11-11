/* Aplica fotos y modelos 3D de prisma/photos.json a una base existente sin re-sembrar (conserva pedidos y usuarios). */
import { PrismaClient } from "@prisma/client";
import photos from "../prisma/photos.json";
const prisma = new PrismaClient();
(async () => {
  let n = 0;
  for (const [k, url] of Object.entries(photos as Record<string, string>)) {
    if (!k.startsWith("model3d:")) continue;
    const r = await prisma.product.updateMany({ where: { slug: k.slice(8) }, data: { model3d: url } }); n += r.count;
  }
  console.log(`Modelos 3D aplicados: ${n}`); await prisma.$disconnect();
})();
