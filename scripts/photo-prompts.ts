/* Genera los prompts de fotografía (Higgsfield) a partir del catálogo. */
import { COLLECTIONS, PRODUCTS, type ColorKey, type Shape } from "../prisma/catalog";

const EN: Record<ColorKey, string> = { nero: "black", giallo: "vivid neon yellow", grafito: "dark graphite gray", titanio: "titanium silver-gray", bianco: "off-white", verde: "dark racing green", blu: "midnight navy blue", rosso: "deep racing red", arena: "warm sand beige", arancio: "burnt orange" };
const G: Record<Shape, string> = {
  tee: "heavyweight short-sleeve crew-neck t-shirt", longsleeve: "heavyweight long-sleeve crew-neck t-shirt", polo: "mercerized piqué polo shirt with knitted collar",
  hoodie: "heavyweight French terry pullover hoodie with hood, kangaroo pocket and drawstrings with metal tips", "zip-hoodie": "technical full-zip hoodie with two-way zipper",
  crewneck: "cropped brushed-cotton crewneck sweatshirt", jacket: "technical racing-inspired jacket with high collar, center zipper and thin yellow piping on the shoulders",
  bomber: "nylon bomber jacket with ribbed collar, cuffs and hem with two thin yellow stripes", puffer: "quilted puffer down jacket with horizontal baffles and high collar",
  pants: "tailored high-performance trousers with sharp crease", cargo: "technical ripstop cargo pants with side cargo pockets and ankle straps", joggers: "premium French terry joggers with ribbed cuffs and a thin side stripe",
  cap: "structured six-panel baseball cap", beanie: "ribbed merino wool beanie with a small brushed metal tag", bag: "technical crossbody sling bag with seatbelt-webbing strap and quick-release metal buckle",
  sunglasses: "wraparound titanium shield sunglasses with gold mirrored lenses", belt: "Italian vegetable-tanned leather belt with a geometric V-shaped brushed metal buckle", socks: "three pairs of premium crew socks with yellow stripes, neatly arranged",
};
const ACC = ["cap", "beanie", "bag", "sunglasses", "belt", "socks"];
const OVERRIDE: Record<string, string> = {
  "chaqueta-apex-racing": "black lambskin nappa leather racing jacket with quilted shoulder panels and titanium hardware",
  "hoodie-apex-cashmere": "luxury cashmere hoodie with silk drawstrings",
  "bomber-apex-numerada": "Italian silk satin bomber jacket with hand embroidery and ribbed trims",
  "jogger-apex-atelier": "washed silk joggers with a satin yellow side stripe",
  "pantalon-palazzo-giallo": "high-waisted wide-leg palazzo trousers with a thin yellow side piping",
  "chaqueta-paddock-mujer": "women's fitted cropped jacket with vegan leather panels and an asymmetric zipper",
  "camiseta-bianco-pista": "women's fitted short-sleeve t-shirt",
};
const STYLE = "Deep black seamless studio background with a subtle charcoal gradient, dramatic soft top key light, thin warm yellow rim light along the edges, rich visible fabric texture. High-end luxury fashion e-commerce product photography, photorealistic, sharp focus, no text, no watermark, no brand names.";

export function productPrompts() {
  return PRODUCTS.filter((p) => p.slug !== "hoodie-v12-overdrive").map((p) => {
    const c = p.colors[0]; const garment = OVERRIDE[p.slug] ?? G[p.shape];
    const emblemColor = c === "giallo" || c === "bianco" || c === "arena" ? "black" : "yellow";
    const placement = ACC.includes(p.shape)
      ? `${p.shape === "socks" ? "" : `with a small minimalist geometric ${emblemColor} V-shaped chevron emblem, `}photographed as a hero product shot, centered`
      : `shown on an invisible ghost mannequin, centered, front view, with a small minimalist geometric ${emblemColor} V-shaped chevron emblem embroidered on the chest`;
    return { key: `product:${p.slug}`, aspect: "3:4", prompt: `Luxury fashion studio photograph of a ${EN[c]} ${garment}, ${placement}. ${p.isExclusive ? "Limited-edition atelier quality, impeccable craftsmanship. " : ""}${STYLE}` };
  });
}
const CAR = "a sleek low-slung angular Italian-style supercar of original design with no logos and no badges";
const COL: Record<string, string> = {
  "nero-corsa": `Cinematic luxury streetwear campaign photograph at night: a model wearing a black technical jacket and black trousers leans against ${CAR} in matte black, wet asphalt reflecting city lights, moody dark tones with subtle yellow accent light, wide shot.`,
  "giallo-furia": `Cinematic luxury streetwear campaign photograph: a model wearing a vivid neon yellow hoodie stands next to ${CAR} painted in glossy yellow, inside a dark minimalist concrete garage with dramatic light beams, wide shot.`,
  "carbon-stealth": `Cinematic luxury streetwear campaign photograph: a model wearing a dark graphite technical bomber jacket and cargo pants beside ${CAR} in carbon-fiber gray, inside an industrial tunnel with cold blue-gray light and a thin yellow light strip, wide shot.`,
  "apex-atelier": `Cinematic luxury fashion campaign photograph: a model wearing a glossy neon yellow quilted puffer jacket in an exclusive dark showroom next to ${CAR} in black, spotlight from above, gallery-like atmosphere, ultra premium, wide shot.`,
};
export function otherPrompts() {
  return [
    { key: "hero", aspect: "16:9", prompt: `Cinematic editorial luxury streetwear campaign photograph: a confident model wearing a black oversized premium hoodie with a small yellow V chevron emblem and black joggers, standing on the right side of the frame in a dark modern underground garage, behind them ${CAR} in matte black with thin yellow light reflections, light streaks, wet reflective concrete floor, dramatic yellow accent lighting, large empty dark negative space on the left half of the frame, moody, ultra realistic, no text.` },
    ...COLLECTIONS.map((c) => ({ key: `collection:${c.slug}`, aspect: "16:9", prompt: `${COL[c.slug]} Ultra realistic, editorial, no text, no watermark.` })),
    { key: "about", aspect: "16:9", prompt: `Luxury fashion atelier workshop at night: a tailor's table with a black jacket in progress, fabric swatches in black, graphite and neon yellow, measuring tape, sketches, warm and yellow accent lighting, ${CAR} partially visible through a glass wall in the background, cinematic, ultra realistic, no text.` },
  ];
}
if (process.argv[1]?.includes("photo-prompts")) console.log(JSON.stringify([...otherPrompts(), ...productPrompts()]));
