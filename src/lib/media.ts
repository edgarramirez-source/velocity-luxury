import photos from "../../prisma/photos.json";

const P = photos as Record<string, string>;
const HF = "d8j0ntlcm91z4.cloudfront.net";

/** Imagen principal del hero y de "Sobre nosotros" (foto si existe, si no el render SVG). */
export const HERO_IMAGE = P["hero"] ?? "/images/hero.svg";
export const ABOUT_IMAGE = P["about"] ?? "/images/about.svg";
export const isPhoto = (src?: string) => !!src && !src.endsWith(".svg");
/** Versión ligera para tarjetas y miniaturas (el CDN de Higgsfield publica un _min.webp junto a cada PNG). */
export function thumb(src: string) {
  return src.includes(HF) && src.endsWith(".png") ? src.replace(/\.png$/, "_min.webp") : src;
}
