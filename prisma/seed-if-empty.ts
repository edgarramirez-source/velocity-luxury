/* Usado en el build de producción: carga los datos demo solo si la base está vacía (nunca borra datos reales). */
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
const prisma = new PrismaClient();
(async () => {
  const n = await prisma.product.count().catch(() => 0);
  await prisma.$disconnect();
  if (n > 0) { console.log(`Base con ${n} productos: no se cargan datos demo.`); return; }
  console.log("Base vacía: cargando datos de demostración...");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
})();
