import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { apiAdmin } from "@/lib/auth";

const ALLOWED: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" };
const MAX = 5 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await apiAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "No se recibieron archivos" }, { status: 400 });
  const dir = path.join(process.cwd(), "uploads");
  if (!process.env.BLOB_READ_WRITE_TOKEN) await fs.mkdir(dir, { recursive: true });
  const urls: string[] = [];
  for (const f of files) {
    const ext = ALLOWED[f.type];
    if (!ext) return NextResponse.json({ error: `Formato no permitido: ${f.name}. Usa JPG, PNG, WEBP o AVIF.` }, { status: 400 });
    if (f.size > MAX) return NextResponse.json({ error: `${f.name} supera 5 MB.` }, { status: 400 });
    const buf = Buffer.from(await f.arrayBuffer());
    // Verificación de firma mágica para evitar archivos disfrazados
    const sig = buf.subarray(0, 12).toString("hex");
    const ok = sig.startsWith("ffd8ff") || sig.startsWith("89504e47") || (sig.startsWith("52494646") && buf.subarray(8, 12).toString() === "WEBP") || buf.subarray(4, 12).toString().startsWith("ftypavi");
    if (!ok) return NextResponse.json({ error: `${f.name} no es una imagen válida.` }, { status: 400 });
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Producción (Vercel): almacenamiento persistente en Vercel Blob
      const blob = await put(`productos/${name}`, buf, { access: "public", contentType: f.type });
      urls.push(blob.url);
    } else {
      await fs.writeFile(path.join(dir, name), buf);
      urls.push(`/api/uploads/${name}`);
    }
  }
  return NextResponse.json({ urls });
}
