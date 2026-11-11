import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

const PUBLIC_ACCOUNT = ["/cuenta/login", "/cuenta/registro", "/cuenta/recuperar", "/cuenta/restablecer"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isAccount = pathname.startsWith("/cuenta") && !PUBLIC_ACCOUNT.some((p) => pathname.startsWith(p));

  if (isAdminArea) {
    if (!session || session.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      const url = req.nextUrl.clone(); url.pathname = session ? "/" : "/cuenta/login"; url.search = session ? "" : `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }
  if (isAccount && !session) {
    const url = req.nextUrl.clone(); url.pathname = "/cuenta/login"; url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  if (session && PUBLIC_ACCOUNT.slice(0, 2).some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone(); url.pathname = "/cuenta"; url.search = ""; return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/cuenta/:path*"] };
