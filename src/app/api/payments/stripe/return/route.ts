import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyStripe } from "@/lib/payments";
import { markPaid, sendOrderEmail, successUrl } from "@/lib/orders";

export async function GET(req: Request) {
  const u = new URL(req.url); const number = u.searchParams.get("order") ?? ""; const sid = u.searchParams.get("session_id") ?? "";
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order || order.paymentRef !== sid) return NextResponse.redirect(new URL("/checkout?error=pago", req.url));
  if (await verifyStripe(sid)) { await markPaid(number); await sendOrderEmail(order.id).catch(() => {}); }
  return NextResponse.redirect(new URL(successUrl(order), req.url));
}
