import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { SESSION_COOKIE, signSession, verifySession, type SessionPayload } from "./session";

export async function getSession() {
  const c = await cookies();
  return verifySession(c.get(SESSION_COOKIE)?.value);
}
export async function getCurrentUser() {
  const s = await getSession();
  if (!s) return null;
  return prisma.user.findUnique({ where: { id: s.sub }, select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true } });
}
export async function createSession(user: { id: string; role: string; name: string; email: string }) {
  const token = await signSession({ sub: user.id, role: user.role as SessionPayload["role"], name: user.name, email: user.email });
  const c = await cookies();
  c.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function destroySession() { (await cookies()).delete(SESSION_COOKIE); }

export async function requireUser(next = "/cuenta") {
  const u = await getCurrentUser();
  if (!u) redirect(`/cuenta/login?next=${encodeURIComponent(next)}`);
  return u;
}
export async function requireAdmin() {
  const u = await getCurrentUser();
  if (!u) redirect("/cuenta/login?next=/admin");
  if (u.role !== "ADMIN") redirect("/");
  return u;
}
/** Para route handlers: devuelve el usuario o null. */
export async function apiUser() { return getCurrentUser(); }
export async function apiAdmin() { const u = await getCurrentUser(); return u && u.role === "ADMIN" ? u : null; }
