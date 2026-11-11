import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { capturePaypal } from "@/lib/payments";
import { markPaid, sendOrderEmail, successUrl } from "@/lib/orders";

export async function GET(req: Request) {
  const u = new URL(req.url); const number = u.searchParams.get("order") ?? ""; const token = u.searchParams.get("token") ?? "";
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order || order.paymentRef !== token) return NextResponse.redirect(new URL("/checkout?error=pago", req.url));
  if (await capturePaypal(token)) { await markPaid(number); await sendOrderEmail(order.id).catch(() => {}); }
  return NextResponse.redirect(new URL(successUrl(order), req.url));
}
