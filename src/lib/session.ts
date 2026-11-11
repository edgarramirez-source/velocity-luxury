// Utilidades JWT compatibles con Edge (middleware) y Node.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "vl_session";
export interface SessionPayload { sub: string; role: "CUSTOMER" | "ADMIN"; name: string; email: string }

function key() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET debe tener al menos 32 caracteres");
  return new TextEncoder().encode(s);
}
export async function signSession(p: SessionPayload) {
  return new SignJWT({ ...p }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
}
export async function verifySession(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, key()); return payload as unknown as SessionPayload; } catch { return null; }
}
