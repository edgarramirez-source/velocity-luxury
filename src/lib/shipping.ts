export const FREE_SHIPPING_FROM = 150;
export const SHIPPING_METHODS = [
  { id: "standard", name: "Envío Estándar", eta: "3 a 5 días hábiles", price: 5.99 },
  { id: "express", name: "Envío Express", eta: "24 a 48 horas", price: 14.99 },
  { id: "pickup", name: "Retiro en Showroom Quito", eta: "Listo en 24 horas", price: 0 },
] as const;
export type ShippingId = (typeof SHIPPING_METHODS)[number]["id"];

export interface CouponLike { code: string; type: string; value: number; minSubtotal: number }
export function computeTotals(subtotal: number, shippingId: string, coupon?: CouponLike | null) {
  const method = SHIPPING_METHODS.find((m) => m.id === shippingId) ?? SHIPPING_METHODS[0];
  let shipping: number = method.price;
  if (method.id === "standard" && subtotal >= FREE_SHIPPING_FROM) shipping = 0;
  let discount = 0;
  if (coupon && subtotal >= coupon.minSubtotal) {
    if (coupon.type === "PERCENT") discount = Math.round(subtotal * (coupon.value / 100) * 100) / 100;
    else if (coupon.type === "FIXED") discount = Math.min(coupon.value, subtotal);
    else if (coupon.type === "FREESHIP" && method.id === "standard") shipping = 0;
  }
  const total = Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100);
  return { subtotal, shipping, discount, total, method };
}
