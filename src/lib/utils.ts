export function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" "); }
export const formatPrice = (n: number) => new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(n);
export const formatDate = (d: Date | string) => new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
export const discountPct = (price: number, compareAt?: number | null) => (compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0);
export function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
export function safeJson<T>(s: string | null | undefined, fallback: T): T { try { return s ? (JSON.parse(s) as T) : fallback; } catch { return fallback; } }

export const ORDER_STATUSES = ["PENDIENTE", "CONFIRMADO", "PREPARANDO", "ENVIADO", "ENTREGADO", "CANCELADO"] as const;
export const PAYMENT_STATUSES = ["PENDIENTE", "PAGADO", "FALLIDO", "REEMBOLSADO"] as const;
export const STATUS_LABEL: Record<string, string> = { PENDIENTE: "Pendiente", CONFIRMADO: "Confirmado", PREPARANDO: "En preparación", ENVIADO: "Enviado", ENTREGADO: "Entregado", CANCELADO: "Cancelado", PAGADO: "Pagado", FALLIDO: "Fallido", REEMBOLSADO: "Reembolsado" };
export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "ÚNICA"];
