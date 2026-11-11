import { NextResponse } from "next/server";
import { findValidCoupon } from "@/lib/coupons";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json().catch(() => ({}));
  if (!code) return NextResponse.json({ error: "Ingresa un código." }, { status: 400 });
  const { coupon, error } = await findValidCoupon(String(code), Number(subtotal) || 0);
  if (!coupon) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ coupon: { code: coupon.code, type: coupon.type, value: coupon.value, minSubtotal: coupon.minSubtotal, description: coupon.description } });
}
