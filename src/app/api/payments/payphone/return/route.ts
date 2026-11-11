import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { confirmPayphone } from "@/lib/payments";
import { markPaid, sendOrderEmail, successUrl } from "@/lib/orders";

export async function GET(req: Request) {
  const u = new URL(req.url); const id = u.searchParams.get("id") ?? ""; const number = u.searchParams.get("clientTransactionId") ?? "";
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order) return NextResponse.redirect(new URL("/checkout?error=pago", req.url));
  if (await confirmPayphone(id, number)) { await markPaid(number, id); await sendOrderEmail(order.id).catch(() => {}); }
  return NextResponse.redirect(new URL(successUrl(order), req.url));
}
