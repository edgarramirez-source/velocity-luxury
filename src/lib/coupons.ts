import { prisma } from "./db";

export async function findValidCoupon(code: string | undefined | null, subtotal: number) {
  if (!code) return { coupon: null, error: null as string | null };
  const c = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!c || !c.active) return { coupon: null, error: "El código no existe o no está activo." };
  if (c.expiresAt && c.expiresAt < new Date()) return { coupon: null, error: "El código ha expirado." };
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return { coupon: null, error: "El código alcanzó su límite de usos." };
  if (subtotal < c.minSubtotal) return { coupon: null, error: `Este código requiere un subtotal mínimo de $${c.minSubtotal.toFixed(2)}.` };
  return { coupon: c, error: null };
}
