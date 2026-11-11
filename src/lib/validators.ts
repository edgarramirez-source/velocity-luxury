import { z } from "zod";

const password = z.string().min(8, "Mínimo 8 caracteres").regex(/[A-Z]/, "Debe incluir una mayúscula").regex(/[0-9]/, "Debe incluir un número");
export const registerSchema = z.object({ name: z.string().trim().min(2, "Ingresa tu nombre"), email: z.string().trim().toLowerCase().email("Correo inválido"), password });
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email("Correo inválido"), password: z.string().min(1, "Ingresa tu contraseña") });
export const forgotSchema = z.object({ email: z.string().trim().toLowerCase().email("Correo inválido") });
export const resetSchema = z.object({ token: z.string().min(10), password });
export const profileSchema = z.object({ name: z.string().trim().min(2), phone: z.string().trim().max(30).optional().or(z.literal("")) });
export const changePasswordSchema = z.object({ current: z.string().min(1), password });
export const addressSchema = z.object({
  label: z.string().trim().min(1).max(30), fullName: z.string().trim().min(2, "Nombre requerido"), phone: z.string().trim().min(7, "Teléfono inválido"),
  line1: z.string().trim().min(5, "Dirección requerida"), line2: z.string().trim().optional().or(z.literal("")), city: z.string().trim().min(2, "Ciudad requerida"),
  province: z.string().trim().min(2, "Provincia requerida"), postalCode: z.string().trim().optional().or(z.literal("")), country: z.string().trim().default("Ecuador"),
  isDefault: z.boolean().optional(),
});
export const checkoutSchema = z.object({
  customer: z.object({ name: z.string().trim().min(2, "Nombre requerido"), email: z.string().trim().toLowerCase().email("Correo inválido"), phone: z.string().trim().min(7, "Teléfono inválido"), idNumber: z.string().trim().optional().or(z.literal("")) }),
  address: z.object({ line1: z.string().trim().min(5, "Dirección requerida"), line2: z.string().trim().optional().or(z.literal("")), city: z.string().trim().min(2, "Ciudad requerida"), province: z.string().trim().min(2, "Provincia requerida"), postalCode: z.string().trim().optional().or(z.literal("")), notes: z.string().trim().max(500).optional().or(z.literal("")) }),
  shippingMethod: z.enum(["standard", "express", "pickup"]),
  paymentMethod: z.string().min(1),
  couponCode: z.string().trim().optional().or(z.literal("")),
  items: z.array(z.object({ productId: z.string(), size: z.string(), color: z.string(), quantity: z.number().int().min(1).max(20) })).min(1, "El carrito está vacío"),
  card: z.object({ number: z.string(), name: z.string(), exp: z.string(), cvc: z.string() }).optional(),
});
export const contactSchema = z.object({ name: z.string().trim().min(2, "Nombre requerido"), email: z.string().trim().email("Correo inválido"), subject: z.string().trim().min(3, "Asunto requerido"), message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(3000) });
export const productSchema = z.object({
  name: z.string().trim().min(2), slug: z.string().trim().optional().or(z.literal("")), description: z.string().trim().min(10, "Descripción muy corta"), details: z.string().optional().default(""),
  price: z.number().positive("Precio inválido"), compareAt: z.number().positive().nullable().optional(), gender: z.enum(["HOMBRE", "MUJER", "UNISEX"]),
  categoryId: z.string().min(1, "Selecciona una categoría"), collectionId: z.string().nullable().optional(), images: z.array(z.string().min(1)).min(1, "Agrega al menos una imagen"), model3d: z.string().trim().url("URL del modelo 3D inválida").nullable().optional().or(z.literal("")),
  sizes: z.array(z.string()).min(1, "Selecciona al menos una talla"), colors: z.array(z.object({ name: z.string().min(1), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/), image: z.string().optional() })).min(1, "Agrega al menos un color"),
  stock: z.number().int().min(0), isNew: z.boolean(), isExclusive: z.boolean(), active: z.boolean(),
});
export const couponSchema = z.object({
  code: z.string().trim().min(3).max(30).transform((s) => s.toUpperCase()), description: z.string().trim().optional().default(""), type: z.enum(["PERCENT", "FIXED", "FREESHIP"]),
  value: z.number().min(0), minSubtotal: z.number().min(0).default(0), usageLimit: z.number().int().positive().nullable().optional(), active: z.boolean().default(true), expiresAt: z.string().nullable().optional(),
});
export function firstError(e: z.ZodError) { return e.issues[0]?.message ?? "Datos inválidos"; }
