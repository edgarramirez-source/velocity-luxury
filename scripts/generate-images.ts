/* Genera las imágenes de estudio (SVG) de productos, categorías, colecciones y hero. */
import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, COLLECTIONS, COLORS, PRODUCTS, type ColorKey, type Shape } from "../prisma/catalog";

const OUT = path.join(process.cwd(), "public", "images");
const Y = "#FFD400";

function hexToRgb(h: string) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgbToHex(r: number, g: number, b: number) { return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join(""); }
function mix(a: string, b: string, t: number) { const x = hexToRgb(a), y = hexToRgb(b); return rgbToHex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t); }
const lighten = (c: string, t: number) => mix(c, "#ffffff", t);
const darken = (c: string, t: number) => mix(c, "#000000", t);
function lum(c: string) { const [r, g, b] = hexToRgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }

const emblem = (x: number, y: number, s: number, fill: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-24,-16 L-9,-16 L0,6 L9,-16 L24,-16 L0,26 Z" fill="${fill}"/><path d="M-30,-16 L-27,-16 L-1,30 L-3,32 Z" fill="${fill}" opacity=".55"/></g>`;

interface GarmentDef { outline: string; parts?: string; details: (c: string, a: string, back: boolean) => string; emblemAt?: [number, number, number]; backPrint?: [number, number]; }

const stitch = (d: string, c: string, w = 1.6) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="5 5" opacity=".55"/>`;
const line = (d: string, c: string, w = 2, o = 0.6) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${o}" stroke-linecap="round" stroke-linejoin="round"/>`;
const fold = (d: string) => `<path d="${d}" fill="none" stroke="#000" stroke-width="14" opacity=".12" stroke-linecap="round" filter="url(#soft)"/>`;

const TEE = "M318,200 L262,214 L160,282 L206,392 L262,356 L262,842 Q400,856 538,842 L538,356 L594,392 L640,282 L538,214 L482,200 Q400,250 318,200 Z";
const LONG = "M318,200 L262,214 Q200,240 180,320 L140,760 L196,770 L262,420 L262,842 Q400,856 538,842 L538,420 L604,770 L660,760 L620,320 Q600,240 538,214 L482,200 Q400,250 318,200 Z";
const HOOD_BODY = "M300,222 L240,240 Q178,262 158,332 L112,708 L176,720 L242,424 L250,846 Q400,866 550,846 L558,424 L624,720 L688,708 L642,332 Q622,262 560,240 L500,222 Q400,268 300,222 Z";
const BOMBER = "M302,214 L236,232 Q170,258 152,340 L118,700 L182,712 L240,430 L244,820 Q400,836 556,820 L560,430 L618,712 L682,700 L648,340 Q630,258 564,232 L498,214 Q400,250 302,214 Z";
const PANTS = "M288,160 L512,160 L546,880 L428,880 L402,380 L398,380 L372,880 L254,880 Z";
const JOG = "M286,160 L514,160 L534,790 L540,872 L438,872 L436,800 L402,390 L398,390 L364,800 L362,872 L260,872 L266,790 Z";

function teeDetails(c: string, a: string, back: boolean) {
  const d = darken(c, 0.45), l = lighten(c, 0.25);
  return [
    back ? line("M318,200 Q400,224 482,200", d, 9, 0.8) : line("M318,200 Q400,252 482,200", d, 11, 0.85),
    line("M262,220 Q276,290 262,356", d, 2, 0.5), line("M538,220 Q524,290 538,356", d, 2, 0.5),
    stitch("M266,826 Q400,840 534,826", l), stitch("M176,290 L220,384", l), stitch("M624,290 L580,384", l),
    fold("M310,430 Q330,610 305,800"), fold("M495,460 Q472,630 500,810"), fold("M380,300 Q400,330 430,300"),
  ].join("");
}

const G: Record<Shape, GarmentDef> = {
  tee: { outline: TEE, details: teeDetails, emblemAt: [462, 320, 1], backPrint: [400, 380] },
  longsleeve: { outline: LONG, details: (c, a, b) => teeDetails(c, a, b) + line("M146,730 L200,740", darken(c, 0.4), 6, 0.6) + line("M654,730 L600,740", darken(c, 0.4), 6, 0.6) + (b ? "" : `<g opacity=".8">${line("M600,430 L612,520 L626,560", a, 3, 0.9)}${line("M606,600 L640,640", a, 3, 0.9)}</g>`), emblemAt: [462, 320, 1], backPrint: [400, 380] },
  polo: {
    outline: TEE, emblemAt: [470, 340, 0.9], backPrint: [400, 390],
    details: (c, a, back) => teeDetails(c, a, back) + (back ? line("M318,200 Q400,180 482,200 L478,222 Q400,204 322,222 Z", darken(c, 0.3), 3, 0.7) :
      `<path d="M318,200 L362,272 L400,232 Z M482,200 L438,272 L400,232 Z" fill="${lighten(c, 0.06)}" stroke="${darken(c, 0.4)}" stroke-width="2"/><path d="M388,236 L412,236 L412,336 L388,336 Z" fill="${darken(c, 0.08)}" stroke="${darken(c, 0.4)}" stroke-width="1.5"/>` +
      [258, 290, 322].map((y) => `<circle cx="400" cy="${y}" r="5" fill="${lighten(c, 0.5)}" stroke="${darken(c, 0.4)}"/>`).join("") + line("M326,214 L362,268", a, 2, 0.8)),
  },
  hoodie: {
    outline: HOOD_BODY, emblemAt: [400, 520, 1.5], backPrint: [400, 420],
    details: (c, a, back) => {
      const d = darken(c, 0.4), l = lighten(c, 0.2);
      return (back ? `<path d="M292,226 Q280,96 400,84 Q520,96 508,226 Q400,262 292,226 Z" fill="${darken(c, 0.06)}" stroke="${d}" stroke-width="2"/>${line("M400,86 L400,250", d, 2, 0.5)}`
        : `<path d="M292,226 Q282,118 400,104 Q518,118 508,226 Q470,252 400,256 Q330,252 292,226 Z" fill="${lighten(c, 0.05)}" stroke="${d}" stroke-width="2"/><path d="M326,228 Q330,152 400,142 Q470,152 474,228 Q440,246 400,248 Q360,246 326,228 Z" fill="${darken(c, 0.55)}"/>` +
          line("M372,250 Q368,300 366,370", lighten(c, 0.35), 4, 0.9) + line("M428,250 Q432,300 434,370", lighten(c, 0.35), 4, 0.9) +
          `<rect x="361" y="368" width="10" height="20" rx="2" fill="#C9CDD2"/><rect x="429" y="368" width="10" height="20" rx="2" fill="#C9CDD2"/>` +
          `<path d="M292,640 L508,640 L540,792 L260,792 Z" fill="${darken(c, 0.04)}" stroke="${d}" stroke-width="2" opacity=".9"/>` + stitch("M298,648 L502,648", l)) +
        `<path d="M112,708 L176,720 L172,754 L108,742 Z M688,708 L624,720 L628,754 L692,742 Z" fill="${darken(c, 0.15)}"/>` +
        `<path d="M250,846 Q400,866 550,846 L552,886 Q400,906 248,886 Z" fill="${darken(c, 0.15)}"/>` +
        Array.from({ length: 30 }, (_, i) => line(`M${256 + i * 10},${852 + Math.sin(i / 4) * 2} l0,34`, d, 1, 0.25)).join("") +
        fold("M300,420 Q320,560 296,640") + fold("M500,430 Q478,560 506,640") + fold("M200,420 Q190,560 170,690") + fold("M600,420 Q612,560 630,690");
    },
  },
  "zip-hoodie": {
    outline: HOOD_BODY, emblemAt: [468, 360, 0.9], backPrint: [400, 420],
    details: (c, a, back) => G.hoodie.details(c, a, back).replace(/<path d="M292,640[^>]*>/, "") + (back ? "" :
      `<path d="M400,256 L400,886" stroke="#B9BEC4" stroke-width="5"/><path d="M400,256 L400,886" stroke="#555" stroke-width="5" stroke-dasharray="2 3"/><rect x="393" y="420" width="14" height="34" rx="3" fill="#D9DDE2"/>` +
      line("M290,640 L270,780", darken(c, 0.5), 3, 0.8) + line("M510,640 L530,780", darken(c, 0.5), 3, 0.8)),
  },
  crewneck: {
    outline: HOOD_BODY, emblemAt: [400, 400, 1.3], backPrint: [400, 400],
    details: (c, a, back) => {
      const d = darken(c, 0.4);
      return line(back ? "M300,222 Q400,246 500,222" : "M300,222 Q400,270 500,222", darken(c, 0.25), 18, 0.9) +
        (back ? "" : `<path d="M390,252 L410,252 L400,270 Z" fill="${d}"/>`) +
        `<path d="M112,708 L176,720 L172,754 L108,742 Z M688,708 L624,720 L628,754 L692,742 Z" fill="${darken(c, 0.15)}"/>` +
        `<path d="M250,846 Q400,866 550,846 L552,886 Q400,906 248,886 Z" fill="${darken(c, 0.15)}"/>` +
        fold("M300,420 Q320,600 296,780") + fold("M500,430 Q478,600 506,780") + fold("M200,420 Q190,560 170,690") + fold("M600,420 Q612,560 630,690");
    },
  },
  jacket: {
    outline: HOOD_BODY, emblemAt: [470, 330, 0.85], backPrint: [400, 400],
    details: (c, a, back) => {
      const d = darken(c, 0.5);
      return `<path d="M306,226 L296,166 Q400,144 504,166 L494,226 Q400,262 306,226 Z" fill="${darken(c, 0.12)}" stroke="${d}" stroke-width="2"/>` +
        (back ? line("M400,250 L400,860", d, 2, 0.3) + line("M250,420 Q400,380 550,420", a, 5, 0.9)
          : `<path d="M400,150 L400,884" stroke="#9EA3A9" stroke-width="4"/><rect x="394" y="166" width="12" height="30" rx="3" fill="#D9DDE2"/>` +
            line("M296,420 L368,400", "#9EA3A9", 3, 0.9) + line("M300,610 L320,760", "#9EA3A9", 3, 0.9) + line("M500,610 L480,760", "#9EA3A9", 3, 0.9)) +
        line("M246,238 Q262,330 244,424", a, 5, 0.95) + line("M554,238 Q538,330 556,424", a, 5, 0.95) +
        `<path d="M112,708 L176,720 L172,754 L108,742 Z M688,708 L624,720 L628,754 L692,742 Z" fill="${darken(c, 0.2)}"/>` +
        line("M250,846 Q400,866 550,846", d, 6, 0.8) + fold("M320,460 Q340,620 316,800") + fold("M480,460 Q462,620 486,800") + fold("M200,420 Q190,560 170,690") + fold("M600,420 Q612,560 630,690");
    },
  },
  bomber: {
    outline: BOMBER, emblemAt: [470, 330, 0.85], backPrint: [400, 420],
    details: (c, a, back) => {
      const d = darken(c, 0.5), rib = darken(c, 0.25);
      const stripes = (y: number) => line(`M246,${y} Q400,${y + 16} 554,${y}`, a, 4, 0.95);
      return `<path d="M302,214 Q400,${back ? 232 : 258} 498,214 L492,236 Q400,${back ? 254 : 282} 308,236 Z" fill="${rib}"/>` +
        `<path d="M244,820 Q400,836 556,820 L556,872 Q400,888 244,872 Z" fill="${rib}"/>` + stripes(838) + stripes(852) +
        `<path d="M118,700 L182,712 L178,752 L114,740 Z M682,700 L618,712 L622,752 L686,740 Z" fill="${rib}"/>` +
        (back ? "" : `<path d="M400,250 L400,872" stroke="#A3A8AE" stroke-width="4"/>` + line("M292,540 L322,660", d, 3, 0.8) + line("M508,540 L478,660", d, 3, 0.8) +
          `<rect x="178" y="420" width="44" height="64" rx="4" fill="${darken(c, 0.1)}" stroke="${d}" stroke-width="2" transform="rotate(10 200 452)"/>`) +
        fold("M320,420 Q340,600 316,790") + fold("M480,420 Q460,600 486,790") + fold("M195,430 Q186,560 160,680") + fold("M605,430 Q614,560 640,680");
    },
  },
  puffer: {
    outline: BOMBER, emblemAt: [470, 340, 0.85], backPrint: [400, 470],
    details: (c, a, back) => {
      const d = darken(c, 0.45), l = lighten(c, 0.35);
      let s = `<path d="M296,226 L290,150 Q400,128 510,150 L504,226 Q400,262 296,226 Z" fill="${darken(c, 0.08)}" stroke="${d}" stroke-width="2"/>`;
      for (const y of [330, 420, 510, 600, 690, 780]) s += line(`M150,${y + 10} Q400,${y + 24} 650,${y + 10}`, d, 7, 0.45) + line(`M160,${y - 34} Q400,${y - 22} 640,${y - 34}`, l, 10, 0.12);
      if (!back) s += `<path d="M400,150 L400,868" stroke="#A3A8AE" stroke-width="4"/>`;
      return s + `<path d="M244,820 Q400,836 556,820 L556,868 Q400,884 244,868 Z" fill="${darken(c, 0.2)}"/>`;
    },
  },
  pants: {
    outline: PANTS, emblemAt: [480, 250, 0.6],
    details: (c) => {
      const d = darken(c, 0.45), l = lighten(c, 0.2);
      return `<path d="M288,160 L512,160 L513,198 L287,198 Z" fill="${darken(c, 0.12)}"/>` +
        [310, 360, 440, 490].map((x) => `<rect x="${x}" y="156" width="10" height="46" rx="2" fill="${darken(c, 0.2)}"/>`).join("") +
        `<circle cx="400" cy="180" r="7" fill="#C9CDD2"/>` + line("M400,198 L400,330 Q410,350 430,340", d, 2, 0.7) +
        line("M300,200 Q330,260 292,300", d, 2.5, 0.8) + line("M500,200 Q470,260 508,300", d, 2.5, 0.8) +
        line("M326,320 L316,876", l, 2, 0.35) + line("M474,320 L484,876", l, 2, 0.35) + stitch("M258,862 L372,862", l) + stitch("M428,862 L542,862", l) +
        fold("M350,500 Q340,620 360,700") + fold("M450,520 Q462,640 440,720");
    },
  },
  cargo: {
    outline: PANTS, emblemAt: [480, 250, 0.6],
    details: (c, a, back) => G.pants.details(c, a, back) +
      `<path d="M262,480 L326,480 L330,610 L258,610 Z M538,480 L474,480 L470,610 L542,610 Z" fill="${darken(c, 0.06)}" stroke="${darken(c, 0.45)}" stroke-width="2"/>` +
      line("M262,500 L326,500", darken(c, 0.45), 2, 0.7) + line("M538,500 L474,500", darken(c, 0.45), 2, 0.7) +
      `<rect x="256" y="826" width="118" height="14" fill="${a}" opacity=".9"/><rect x="426" y="826" width="118" height="14" fill="${a}" opacity=".9"/>`,
  },
  joggers: {
    outline: JOG, emblemAt: [478, 240, 0.6],
    details: (c, a) => {
      const d = darken(c, 0.4);
      return `<path d="M286,160 L514,160 L515,212 L285,212 Z" fill="${darken(c, 0.15)}"/>` +
        Array.from({ length: 22 }, (_, i) => line(`M${292 + i * 10},164 l0,44`, d, 1, 0.25)).join("") +
        line("M386,210 Q380,260 372,290", lighten(c, 0.4), 4, 0.9) + line("M414,210 Q420,260 428,290", lighten(c, 0.4), 4, 0.9) +
        `<path d="M266,800 L364,800 L362,872 L260,872 Z M534,800 L436,800 L438,872 L540,872 Z" fill="${darken(c, 0.18)}"/>` +
        line("M292,214 L270,796", a, 9, 0.9) + line("M508,214 L530,796", a, 9, 0.9) +
        line("M300,220 Q326,270 296,300", d, 2.5, 0.7) + line("M500,220 Q474,270 504,300", d, 2.5, 0.7) +
        fold("M340,450 Q330,600 350,760") + fold("M460,450 Q472,600 450,760") + fold("M300,700 Q330,720 360,700") + fold("M440,700 Q470,720 500,700");
    },
  },
  cap: {
    outline: "M230,560 Q226,356 410,328 Q594,340 608,542 Q520,520 410,522 Q300,528 230,560 Z", emblemAt: [450, 448, 1.4],
    parts: "brim",
    details: (c, a) => {
      const d = darken(c, 0.45);
      return line("M410,330 Q402,430 404,522", d, 2.5, 0.6) + line("M410,330 Q320,420 298,540", d, 2.5, 0.6) + line("M410,330 Q500,410 528,524", d, 2.5, 0.6) +
        `<ellipse cx="410" cy="330" rx="16" ry="8" fill="${darken(c, 0.15)}"/>` +
        [[330, 410], [520, 400]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${darken(c, 0.5)}"/>`).join("") +
        `<path d="M232,556 Q300,528 410,522 Q520,520 606,540 Q690,556 744,604 Q726,640 636,640 Q540,612 410,604 Q300,604 236,620 Z" fill="${darken(c, 0.1)}" stroke="${d}" stroke-width="2"/>` +
        `<path d="M250,600 Q400,580 600,600 Q680,610 728,616" fill="none" stroke="${darken(c, 0.5)}" stroke-width="10" opacity=".35"/>` +
        stitch("M262,590 Q420,568 620,594 Q690,606 726,612", lighten(c, 0.3));
    },
  },
  beanie: {
    outline: "M262,640 Q250,320 400,300 Q550,320 538,640 Z", emblemAt: [400, 632, 0],
    details: (c, a) => {
      const d = darken(c, 0.35);
      return Array.from({ length: 14 }, (_, i) => line(`M${284 + i * 18},${400 - Math.abs(7 - i) * 6} Q${280 + i * 18 + (i - 7) * 2},520 ${276 + i * 19},640`, d, 3, 0.35)).join("") +
        `<path d="M244,560 Q400,540 556,560 L560,700 Q400,716 240,700 Z" fill="${darken(c, 0.06)}" stroke="${darken(c, 0.4)}" stroke-width="2"/>` +
        Array.from({ length: 30 }, (_, i) => line(`M${252 + i * 10.2},${562 - Math.sin((i / 29) * Math.PI) * 12} L${250 + i * 10.4},${700 + Math.sin((i / 29) * Math.PI) * 10}`, d, 3, 0.4)).join("") +
        `<rect x="364" y="604" width="72" height="34" rx="4" fill="url(#metal)" stroke="#555"/>` + emblem(400, 621, 0.45, "#222");
    },
  },
  bag: {
    outline: "M250,470 Q250,420 300,415 L520,405 Q570,405 575,455 L585,620 Q585,668 540,670 L300,676 Q254,676 252,630 Z", emblemAt: [418, 580, 1],
    details: (c, a) => {
      const d = darken(c, 0.5);
      return `<path d="M268,446 Q190,250 400,196 Q610,170 560,420" fill="none" stroke="${a}" stroke-width="34" stroke-linecap="round"/>` +
        `<path d="M268,446 Q190,250 400,196 Q610,170 560,420" fill="none" stroke="#000" stroke-width="34" opacity=".18" stroke-dasharray="2 6"/>` +
        `<rect x="358" y="176" width="82" height="52" rx="8" fill="url(#metal)" stroke="#444" transform="rotate(-6 399 202)"/><rect x="380" y="190" width="38" height="20" rx="3" fill="#2a2a2a" transform="rotate(-6 399 202)"/>` +
        line("M276,470 Q420,452 560,450", "#A3A8AE", 4, 0.9) + `<rect x="540" y="440" width="12" height="30" rx="3" fill="#D9DDE2"/>` +
        `<path d="M290,520 L550,510 L556,640 L294,648 Z" fill="${darken(c, 0.06)}" stroke="${d}" stroke-width="2"/>` + stitch("M298,530 L544,520", lighten(c, 0.3));
    },
  },
  sunglasses: {
    outline: "M180,470 Q400,420 620,470 Q644,522 604,584 Q520,616 440,566 Q400,544 360,566 Q280,616 196,584 Q156,522 180,470 Z", emblemAt: [400, 470, 0],
    details: (c) =>
      `<path d="M196,486 Q400,446 604,486 Q620,526 592,568 Q520,592 446,552 Q400,532 354,552 Q280,592 208,568 Q180,526 196,486 Z" fill="url(#lens)"/>` +
      `<path d="M230,494 Q300,478 360,482 L320,560 Q260,572 222,556 Z" fill="#fff" opacity=".16"/>` +
      `<path d="M180,474 L120,500 L104,540" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/><path d="M620,474 L680,500 L696,540" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>` +
      line("M184,472 Q400,424 616,472", lighten(c, 0.4), 3, 0.7) + emblem(400, 468, 0.35, Y),
  },
  belt: {
    outline: "M100,600 L100,600 Z", emblemAt: [160, 602, 0],
    details: (c) =>
      `<path d="M170,600 Q300,500 430,590 Q560,680 700,560" fill="none" stroke="${darken(c, 0.35)}" stroke-width="78" stroke-linecap="round"/>` +
      `<path d="M170,600 Q300,500 430,590 Q560,680 700,560" fill="none" stroke="${c}" stroke-width="70" stroke-linecap="round"/>` +
      `<path d="M170,600 Q300,500 430,590 Q560,680 700,560" fill="none" stroke="${lighten(c, 0.35)}" stroke-width="56" stroke-dasharray="6 7" opacity=".35"/>` +
      `<path d="M170,600 Q300,500 430,590 Q560,680 700,560" fill="none" stroke="${c}" stroke-width="50"/>` +
      [560, 600, 640].map((x, i) => `<circle cx="${x}" cy="${652 - i * 26}" r="7" fill="#000" opacity=".6"/>`).join("") +
      `<rect x="96" y="540" width="140" height="124" rx="22" fill="url(#metal)" stroke="#3a3a3a" stroke-width="3"/><rect x="118" y="562" width="96" height="80" rx="12" fill="#1b1b1b"/>` + emblem(166, 600, 1.2, Y),
  },
  socks: {
    outline: "M330,230 L450,230 L450,620 Q450,690 510,712 L590,742 Q650,764 630,824 Q610,876 548,862 L400,820 Q330,798 330,730 Z", emblemAt: [390, 300, 0.9],
    details: (c, a) =>
      `<path d="M330,230 L450,230 L450,300 L330,300 Z" fill="${darken(c, 0.12)}"/>` + Array.from({ length: 12 }, (_, i) => line(`M${338 + i * 10},234 l0,62`, darken(c, 0.4), 1.5, 0.35)).join("") +
      `<rect x="330" y="318" width="120" height="12" fill="${a}"/><rect x="330" y="338" width="120" height="6" fill="${a}"/>` +
      `<path d="M330,700 Q330,790 400,820 L420,760 Q370,740 370,690 Z" fill="${a}" opacity=".85"/><path d="M590,742 Q650,764 630,824 Q610,876 548,862 L566,800 Z" fill="${a}" opacity=".85"/>`,
  },
};

function defs(color: string) {
  return `<defs>
  <radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#2a2a2d"/><stop offset=".45" stop-color="#121214"/><stop offset="1" stop-color="#040405"/></radialGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="fab" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="${lighten(color, 0.16)}"/><stop offset=".5" stop-color="${color}"/><stop offset="1" stop-color="${darken(color, 0.38)}"/></linearGradient>
  <radialGradient id="hl" cx="35%" cy="22%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="${lum(color) > 0.6 ? 0.18 : 0.14}"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f5f6"/><stop offset=".45" stop-color="#9da2a8"/><stop offset=".55" stop-color="#d7dadd"/><stop offset="1" stop-color="#6c7076"/></linearGradient>
  <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset=".35" stop-color="#c58b00"/><stop offset=".7" stop-color="#3a2400"/><stop offset="1" stop-color="#ffcf40"/></linearGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="blur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>`;
}

function studio(w: number, h: number, accentSide: "left" | "right" = "right") {
  const ax = accentSide === "right" ? w * 0.92 : w * 0.08;
  return `<rect width="${w}" height="${h}" fill="url(#bg)"/>
  <path d="M${w * 0.3},0 L${w * 0.7},0 L${w * 0.95},${h} L${w * 0.05},${h} Z" fill="url(#beam)"/>
  <ellipse cx="${ax}" cy="${h * 0.45}" rx="${w * 0.18}" ry="${h * 0.4}" fill="${Y}" opacity=".07" filter="url(#blur30)"/>
  <rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="#000" opacity=".35"/>
  <line x1="0" y1="${h * 0.86}" x2="${w}" y2="${h * 0.86}" stroke="#fff" stroke-opacity=".06"/>
  <rect x="${w * 0.06}" y="${h * 0.955}" width="${w * 0.12}" height="3" fill="${Y}"/>`;
}

function garmentSvg(shape: Shape, color: string, back = false) {
  const g = G[shape];
  const accent = lum(color) > 0.55 ? "#111113" : Y;
  const emblemFill = color.toUpperCase() === "#FFD400" ? "#111113" : lum(color) > 0.55 ? "#111113" : Y;
  const body = g.outline.length > 20 ? `
    <path d="${g.outline}" fill="url(#fab)"/>
    <rect width="800" height="1000" filter="url(#noise)" clip-path="url(#clip)" opacity=".10" style="mix-blend-mode:overlay"/>
    <path d="${g.outline}" fill="url(#hl)"/><path d="${g.outline}" fill="url(#sh)"/>` : "";
  let inner = g.details(color, accent, back);
  let mark = "";
  if (!back && g.emblemAt && g.emblemAt[2] > 0) mark = emblem(g.emblemAt[0], g.emblemAt[1], g.emblemAt[2], emblemFill);
  if (back && g.backPrint) {
    const [x, y] = g.backPrint;
    mark = `<g fill="${emblemFill}" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif">${emblem(x, y - 70, 1.6, emblemFill)}<text x="${x}" y="${y + 20}" font-size="46" font-weight="900" letter-spacing="10">VELOCITY</text><text x="${x}" y="${y + 56}" font-size="17" letter-spacing="9" opacity=".85">BORN TO STAND OUT</text></g>`;
  }
  const rim = g.outline.length > 20 ? `<path d="${g.outline}" fill="none" stroke="${Y}" stroke-width="3" opacity=".22" transform="translate(3 0)"/><path d="${g.outline}" fill="none" stroke="${darken(color, 0.6)}" stroke-width="2" opacity=".7"/>` : "";
  return `<clipPath id="clip"><path d="${g.outline}"/></clipPath>
  <ellipse cx="400" cy="912" rx="290" ry="26" fill="#000" opacity=".7" filter="url(#soft)"/>
  ${body}${inner}${mark}${rim}`;
}

function productSvg(shape: Shape, color: string, view: "front" | "back" | "detail") {
  const accessory = ["cap", "beanie", "bag", "sunglasses", "belt", "socks"].includes(shape);
  let content: string;
  if (view === "detail") {
    content = `<g transform="translate(400 500) scale(1.75) rotate(-8) translate(-400 ${accessory ? -500 : -360})">${garmentSvg(shape, color)}</g>`;
  } else content = `<g transform="translate(400 520) scale(${accessory ? 1.05 : 0.94}) translate(-400 -520)">${garmentSvg(shape, color, view === "back")}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">${defs(color)}${studio(800, 1000, view === "back" ? "left" : "right")}${content}</svg>`;
}

// ---------- Superdeportivo (diseño original) ----------
function car(color = "#151517", glow = Y) {
  const body = "M150,640 L170,602 L330,572 L560,520 Q700,430 860,425 L1000,432 Q1120,460 1240,520 L1420,548 L1452,580 L1454,640 L1380,652 Q1372,552 1270,552 Q1168,552 1160,652 L520,652 Q512,552 410,552 Q308,552 300,652 L160,652 Z";
  const wheel = (cx: number, r: number) => `<circle cx="${cx}" cy="650" r="${r}" fill="#070707"/><circle cx="${cx}" cy="650" r="${r * 0.7}" fill="url(#rim)"/>` +
    Array.from({ length: 5 }, (_, i) => { const a = (i * 72 * Math.PI) / 180; return `<path d="M${cx},650 L${cx + Math.cos(a) * r * 0.66},${650 + Math.sin(a) * r * 0.66}" stroke="#0a0a0a" stroke-width="${r * 0.16}" />`; }).join("") +
    `<circle cx="${cx}" cy="650" r="${r * 0.14}" fill="#222" stroke="#888"/><path d="M${cx - r * 0.55},${650 - r * 0.25} A${r * 0.6},${r * 0.6} 0 0 1 ${cx - r * 0.1},${650 - r * 0.6}" stroke="${glow}" stroke-width="${r * 0.12}" fill="none"/>`;
  return `<g>
    <path d="${body}" fill="url(#carbody)"/>
    <path d="${body}" fill="none" stroke="${glow}" stroke-opacity=".55" stroke-width="2.5"/>
    <path d="M590,520 Q710,447 860,442 L990,448 Q1070,470 1120,505 L600,522 Z" fill="url(#glass)"/>
    <path d="M640,512 Q720,462 800,452 L760,512 Z" fill="#fff" opacity=".07"/>
    <path d="M1060,540 L1190,530 L1156,612 L1090,614 Z" fill="#050505"/><path d="M1070,546 L1180,538" stroke="${glow}" stroke-opacity=".5"/>
    <path d="M330,574 L560,528" stroke="#fff" stroke-opacity=".35" stroke-width="2"/><path d="M1000,452 L1240,528 L1418,552" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
    <path d="M610,528 L690,642" stroke="#000" stroke-opacity=".6" stroke-width="2"/><path d="M520,610 L1160,610" stroke="#fff" stroke-opacity=".08" stroke-width="3"/>
    <path d="M176,606 L304,584 L296,598 L194,616 Z" fill="#fff"/><path d="M176,606 L304,584" stroke="${glow}" stroke-width="3"/>
    <ellipse cx="200" cy="606" rx="120" ry="22" fill="#fff" opacity=".25" filter="url(#blur30)"/>
    <path d="M1404,556 L1452,584 L1450,594 L1400,566 Z" fill="#ff3b30"/><ellipse cx="1430" cy="575" rx="60" ry="14" fill="#ff3b30" opacity=".35" filter="url(#blur30)"/>
    <path d="M1300,520 L1470,528 L1470,540 L1300,534 Z" fill="${color}" stroke="${glow}" stroke-opacity=".4"/>
    ${wheel(410, 92)}${wheel(1270, 96)}
  </g>`;
}
function carDefs(color: string) {
  return `<linearGradient id="carbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lighten(color, 0.22)}"/><stop offset=".45" stop-color="${color}"/><stop offset="1" stop-color="${darken(color, 0.6)}"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b3f45"/><stop offset=".5" stop-color="#0b0c0e"/><stop offset="1" stop-color="#1b1d21"/></linearGradient>
  <radialGradient id="rim"><stop offset="0" stop-color="#5a5e64"/><stop offset=".8" stop-color="#1c1d20"/><stop offset="1" stop-color="#9aa0a6"/></radialGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <mask id="reflect"><rect x="0" y="650" width="1600" height="300" fill="url(#fade)"/></mask>`;
}

function collectionSvg(shape: Shape, garmentColor: string, carColor: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">${defs(garmentColor).replace("</defs>", carDefs(carColor) + "</defs>")}
  ${studio(1600, 900, "left")}
  ${Array.from({ length: 9 }, (_, i) => `<line x1="${200 + i * 150}" y1="0" x2="${-200 + i * 260}" y2="900" stroke="#fff" stroke-opacity=".025"/>`).join("")}
  <g transform="translate(-40 40) scale(.95)">${car(carColor)}<g mask="url(#reflect)"><g transform="translate(0 1300) scale(1 -1)">${car(carColor)}</g></g></g>
  <g transform="translate(980 60) scale(.72)">${garmentSvg(shape, garmentColor)}</g>
  </svg>`;
}

function figure(hoodie: string, pants: string) {
  return `<g>
    <ellipse cx="1080" cy="990" rx="170" ry="18" fill="#000" opacity=".8" filter="url(#soft)"/>
    <path d="M1018,640 L1142,640 L1152,958 L1102,962 L1083,704 L1077,704 L1058,962 L1008,958 Z" fill="${pants}"/>
    <path d="M1020,650 L1012,950" stroke="${Y}" stroke-width="6" opacity=".9"/><path d="M1140,650 L1148,950" stroke="${Y}" stroke-width="6" opacity=".9"/>
    <path d="M1010,930 L1060,930 L1058,962 L1008,958 Z M1100,930 L1150,930 L1152,958 L1102,962 Z" fill="${darken(pants, 0.3)}"/>
    <path d="M1004,956 L1062,956 L1066,988 L986,988 Q988,964 1004,956 Z" fill="#ececec"/><path d="M1098,956 L1156,956 Q1172,964 1174,988 L1094,988 Z" fill="#ececec"/>
    <path d="M988,980 L1066,980 M1094,980 L1174,980" stroke="${Y}" stroke-width="4"/>
    <path d="M1000,372 Q1080,346 1160,372 Q1192,384 1198,430 L1214,642 L1186,652 L1174,476 L1162,664 L998,664 L986,476 L974,652 L946,642 L962,430 Q968,384 1000,372 Z" fill="url(#fab)"/>
    <path d="M1000,372 Q1080,346 1160,372 Q1192,384 1198,430 L1214,642 L1186,652 L1174,476 L1162,664 L998,664 L986,476 L974,652 L946,642 L962,430 Q968,384 1000,372 Z" fill="url(#hl)"/>
    <path d="M1010,560 L1150,560 L1162,640 L998,640 Z" fill="#000" opacity=".25"/>
    <path d="M1030,350 Q1020,262 1080,252 Q1140,262 1130,350 Q1080,374 1030,350 Z" fill="${darken(hoodie, 0.1)}"/>
    <ellipse cx="1080" cy="318" rx="30" ry="40" fill="#1a120c"/>
    <ellipse cx="960" cy="664" rx="14" ry="20" fill="#3a2a1e"/><ellipse cx="1200" cy="664" rx="14" ry="20" fill="#3a2a1e"/>
    ${emblem(1080, 440, 1.2, Y)}
    <path d="M1000,372 Q1080,346 1160,372 Q1192,384 1198,430 L1214,642" fill="none" stroke="${Y}" stroke-width="3" opacity=".6"/>
    <path d="M1030,350 Q1020,262 1080,252 Q1140,262 1130,350" fill="none" stroke="${Y}" stroke-width="2.5" opacity=".55"/>
  </g>`;
}

function heroSvg() {
  const W = 1920, H = 1080;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${defs("#1d1d20").replace("</defs>", carDefs("#141416") + `<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a1c"/><stop offset="1" stop-color="#000"/></linearGradient></defs>`)}
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${Array.from({ length: 7 }, (_, i) => `<path d="M${560 + i * 200},0 L${620 + i * 205},0 L${980 + i * 120},300 L${960 + i * 118},300 Z" fill="#fff" opacity="${0.03 + (i % 2) * 0.02}"/>`).join("")}
  ${Array.from({ length: 5 }, (_, i) => `<rect x="${700 + i * 260}" y="${70 + i * 12}" width="180" height="4" fill="#fff" opacity=".35"/><ellipse cx="${790 + i * 260}" cy="${72 + i * 12}" rx="140" ry="16" fill="#fff" opacity=".08" filter="url(#blur30)"/>`).join("")}
  <rect y="760" width="${W}" height="320" fill="url(#floor)"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="${1160}" y1="760" x2="${-600 + i * 330}" y2="${H}" stroke="#fff" stroke-opacity=".03"/>`).join("")}
  <ellipse cx="1380" cy="560" rx="560" ry="300" fill="${Y}" opacity=".09" filter="url(#blur30)"/>
  <g transform="translate(560 90) scale(.98)">${car("#141416")}<g mask="url(#reflect)"><g transform="translate(0 1300) scale(1 -1)">${car("#141416")}</g></g></g>
  <ellipse cx="1080" cy="560" rx="200" ry="420" fill="#fff" opacity=".06" filter="url(#blur30)"/>
  <g transform="translate(1230 990) scale(1.3) translate(-1080 -990)">${figure("#1d1d20", "#121214")}</g>
  <rect width="${W}" height="${H}" fill="url(#vign)"/>
  <defs><radialGradient id="vign" cx="60%" cy="45%" r="80%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient></defs>
  </svg>`;
}

function write(rel: string, svg: string) { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, svg.replace(/\n\s+/g, "\n")); }

let count = 0;
for (const p of PRODUCTS) {
  p.colors.forEach((ck, i) => { write(`products/${p.slug}-${ck}.svg`, productSvg(p.shape, COLORS[ck].hex, "front")); count++; if (i === 0) { write(`products/${p.slug}-${["cap", "beanie", "bag", "sunglasses", "belt", "socks"].includes(p.shape) ? "detail" : "back"}.svg`, productSvg(p.shape, COLORS[ck].hex, ["cap", "beanie", "bag", "sunglasses", "belt", "socks"].includes(p.shape) ? "detail" : "back")); count++; } });
}
for (const c of CATEGORIES) { write(`categories/${c.slug}.svg`, productSvg(c.shape, COLORS[c.color as ColorKey].hex, "front")); count++; }
const carColors: Record<string, string> = { "nero-corsa": "#141416", "giallo-furia": "#E8C100", "carbon-stealth": "#3A3D42", "apex-atelier": "#0c0c0d" };
for (const c of COLLECTIONS) { write(`collections/${c.slug}.svg`, collectionSvg(c.shape, COLORS[c.color as ColorKey].hex, carColors[c.slug])); count++; }
write("hero.svg", heroSvg());
write("about.svg", collectionSvg("jacket", "#111113", "#E8C100"));
console.log(`Imágenes generadas: ${count + 2}`);
