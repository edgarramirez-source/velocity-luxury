import fs from "node:fs/promises";
import path from "node:path";

const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif" };
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = path.basename((await params).name);
  const type = TYPES[path.extname(name).toLowerCase()];
  if (!type) return new Response("No encontrado", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(process.cwd(), "uploads", name));
    return new Response(new Uint8Array(buf), { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch { return new Response("No encontrado", { status: 404 }); }
}
