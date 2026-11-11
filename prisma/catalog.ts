// Datos de demostración compartidos por el seed y el generador de imágenes.
export type Shape =
  | "tee" | "longsleeve" | "polo" | "hoodie" | "zip-hoodie" | "crewneck" | "jacket" | "bomber" | "puffer"
  | "pants" | "cargo" | "joggers" | "cap" | "beanie" | "bag" | "sunglasses" | "belt" | "socks";

export const COLORS = {
  nero: { name: "Nero", hex: "#111113" },
  giallo: { name: "Giallo", hex: "#FFD400" },
  grafito: { name: "Grafito", hex: "#3A3D42" },
  titanio: { name: "Titanio", hex: "#8C9096" },
  bianco: { name: "Bianco", hex: "#EEEEEA" },
  verde: { name: "Verde Corsa", hex: "#2F4F38" },
  blu: { name: "Blu Notte", hex: "#1B2540" },
  rosso: { name: "Rosso", hex: "#8E1B1B" },
  arena: { name: "Arena", hex: "#B9A88A" },
  arancio: { name: "Arancio", hex: "#E0681A" },
} as const;
export type ColorKey = keyof typeof COLORS;

export const CATEGORIES = [
  { slug: "camisetas", name: "Camisetas Premium", description: "Algodón pima y supima de gramaje pesado con cortes de precisión.", shape: "tee" as Shape, color: "nero" as ColorKey },
  { slug: "hoodies", name: "Hoodies y Sudaderas", description: "French terry de 480 g/m² con acabados cepillados a mano.", shape: "hoodie" as Shape, color: "grafito" as ColorKey },
  { slug: "chaquetas", name: "Chaquetas", description: "Siluetas técnicas inspiradas en los trajes de competición.", shape: "jacket" as Shape, color: "nero" as ColorKey },
  { slug: "pantalones", name: "Pantalones", description: "Sastrería urbana con tejidos elásticos de alto rendimiento.", shape: "pants" as Shape, color: "titanio" as ColorKey },
  { slug: "joggers", name: "Joggers", description: "Comodidad de pit lane con la presencia de una pasarela.", shape: "joggers" as Shape, color: "nero" as ColorKey },
  { slug: "gorras", name: "Gorras", description: "Coronas estructuradas con detalles bordados en 3D.", shape: "cap" as Shape, color: "giallo" as ColorKey },
  { slug: "accesorios", name: "Accesorios", description: "Piezas finales que completan la máquina.", shape: "bag" as Shape, color: "nero" as ColorKey },
  { slug: "exclusivas", name: "Colecciones Exclusivas", description: "Ediciones numeradas. Cuando se agotan, no vuelven.", shape: "bomber" as Shape, color: "giallo" as ColorKey },
];

export const COLLECTIONS = [
  { slug: "nero-corsa", name: "NERO CORSA", tagline: "La noche es tu circuito", description: "Negro absoluto, texturas mate y reflejos sutiles. Una colección pensada para quienes se mueven cuando la ciudad duerme.", exclusive: false, shape: "jacket" as Shape, color: "nero" as ColorKey },
  { slug: "giallo-furia", name: "GIALLO FURIA", tagline: "Imposible de ignorar", description: "Amarillo de alta visibilidad sobre bases oscuras. Energía pura convertida en prendas de presencia.", exclusive: false, shape: "hoodie" as Shape, color: "giallo" as ColorKey },
  { slug: "carbon-stealth", name: "CARBON STEALTH", tagline: "Ligero. Técnico. Silencioso.", description: "Tejidos técnicos con estructura de fibra, cortes aerodinámicos y paleta grafito-titanio.", exclusive: false, shape: "bomber" as Shape, color: "grafito" as ColorKey },
  { slug: "apex-atelier", name: "APEX ATELIER", tagline: "Edición numerada · 300 piezas", description: "Nuestra línea de taller: confección artesanal, materiales italianos y numeración individual en cada prenda.", exclusive: true, shape: "puffer" as Shape, color: "giallo" as ColorKey },
];

export interface SeedProduct {
  slug: string; name: string; category: string; collection?: string; gender: "HOMBRE" | "MUJER" | "UNISEX";
  price: number; compareAt?: number; isNew?: boolean; isExclusive?: boolean; soldCount: number; stock: number;
  sizes: string[]; colors: ColorKey[]; shape: Shape; description: string; details: string[]; daysAgo: number;
}

const ALL = ["XS", "S", "M", "L", "XL", "XXL"];
const ONE = ["ÚNICA"];

export const PRODUCTS: SeedProduct[] = [
  // CAMISETAS
  { slug: "camiseta-apex-heavy", name: "Camiseta Apex Heavy", category: "camisetas", collection: "nero-corsa", gender: "UNISEX", price: 95, isNew: true, soldCount: 312, stock: 120, sizes: ALL, colors: ["nero", "bianco", "grafito"], shape: "tee", description: "Camiseta de algodón supima de 280 g/m² con caída estructurada y emblema V bordado en el pecho. La base de cualquier garaje bien equipado.", details: ["100% algodón supima peinado", "Gramaje 280 g/m²", "Cuello reforzado de doble costura", "Emblema bordado en hilo metalizado", "Hecho en Portugal"], daysAgo: 4 },
  { slug: "camiseta-giallo-signal", name: "Camiseta Giallo Signal", category: "camisetas", collection: "giallo-furia", gender: "UNISEX", price: 89, compareAt: 119, soldCount: 268, stock: 80, sizes: ALL, colors: ["giallo", "nero"], shape: "tee", description: "Un amarillo que se ve a 300 km/h. Corte oversize con hombro caído y estampado posterior en alta densidad.", details: ["Algodón orgánico 260 g/m²", "Fit oversize", "Estampado posterior en alta densidad", "Lavado enzimático suave"], daysAgo: 40 },
  { slug: "camiseta-telemetry", name: "Camiseta Telemetry", category: "camisetas", collection: "carbon-stealth", gender: "HOMBRE", price: 99, soldCount: 145, stock: 64, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["grafito", "titanio"], shape: "tee", description: "Inspirada en las pantallas de telemetría: gráfica reflectante en la espalda y tejido con tacto seco.", details: ["Mezcla algodón/modal", "Gráfica reflectante 3M", "Corte regular", "Etiqueta impresa sin roce"], daysAgo: 75 },
  { slug: "camiseta-bianco-pista", name: "Camiseta Bianco Pista", category: "camisetas", gender: "MUJER", price: 85, isNew: true, soldCount: 98, stock: 70, sizes: ["XS", "S", "M", "L", "XL"], colors: ["bianco", "arena", "nero"], shape: "tee", description: "Corte entallado con hombros definidos y bajo recto. Limpia, precisa y perfecta bajo una chaqueta técnica.", details: ["Algodón pima 220 g/m²", "Fit entallado", "Costuras planas", "Pre-encogida"], daysAgo: 6 },
  { slug: "manga-larga-circuito", name: "Manga Larga Circuito", category: "camisetas", gender: "UNISEX", price: 115, soldCount: 121, stock: 55, sizes: ALL, colors: ["nero", "bianco"], shape: "longsleeve", description: "Manga larga de punto pesado con trazado de circuito estampado en la manga izquierda.", details: ["Algodón 260 g/m²", "Puños acanalados", "Estampado en manga", "Corte relajado"], daysAgo: 52 },
  { slug: "polo-paddock", name: "Polo Paddock", category: "camisetas", gender: "HOMBRE", price: 129, compareAt: 159, soldCount: 87, stock: 40, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["blu", "nero", "bianco"], shape: "polo", description: "Polo de piqué mercerizado con cuello de punto y botones de cuerno. Elegancia de paddock.", details: ["Piqué mercerizado", "Botones de cuerno natural", "Aberturas laterales", "Ribete amarillo interior"], daysAgo: 90 },

  // HOODIES
  { slug: "hoodie-v12-overdrive", name: "Hoodie V12 Overdrive", category: "hoodies", collection: "giallo-furia", gender: "UNISEX", price: 229, isNew: true, soldCount: 402, stock: 90, sizes: ALL, colors: ["nero", "giallo", "grafito"], shape: "hoodie", description: "Nuestro hoodie insignia. French terry de 480 g/m², capucha de doble capa y emblema V bordado en relieve.", details: ["French terry 480 g/m²", "Capucha de doble capa", "Bolsillo canguro con forro", "Cordones con punteras metálicas", "Hecho en Portugal"], daysAgo: 3 },
  { slug: "hoodie-stealth-zip", name: "Hoodie Stealth Zip", category: "hoodies", collection: "carbon-stealth", gender: "HOMBRE", price: 249, soldCount: 188, stock: 48, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["grafito", "nero"], shape: "zip-hoodie", description: "Cremallera bidireccional, paneles laterales técnicos y bolsillos ocultos con cierre.", details: ["Cremallera bidireccional", "Paneles laterales elásticos", "Bolsillos con cierre oculto", "Interior cepillado"], daysAgo: 30 },
  { slug: "sudadera-monocasco", name: "Sudadera Monocasco", category: "hoodies", gender: "MUJER", price: 189, compareAt: 239, soldCount: 156, stock: 36, sizes: ["XS", "S", "M", "L", "XL"], colors: ["arena", "bianco", "nero"], shape: "crewneck", description: "Cuello redondo cropped con estructura limpia. Pensada para combinarse con pantalón de talle alto.", details: ["Algodón cepillado 420 g/m²", "Fit cropped", "Bajo acanalado ancho", "Bordado tono sobre tono"], daysAgo: 65 },
  { slug: "hoodie-launch-control", name: "Hoodie Launch Control", category: "hoodies", collection: "nero-corsa", gender: "UNISEX", price: 219, soldCount: 233, stock: 60, sizes: ALL, colors: ["nero", "verde"], shape: "hoodie", description: "Gráfica posterior de cuenta regresiva y detalles reflectantes para la salida perfecta.", details: ["French terry 450 g/m²", "Detalles reflectantes", "Capucha estructurada", "Lavado de pigmento"], daysAgo: 120 },

  // CHAQUETAS
  { slug: "chaqueta-corsa-tech", name: "Chaqueta Corsa Tech", category: "chaquetas", collection: "nero-corsa", gender: "HOMBRE", price: 489, isNew: true, soldCount: 141, stock: 25, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["nero", "grafito"], shape: "jacket", description: "Chaqueta técnica con laminado impermeable, ribetes amarillos termosellados y cuello alto.", details: ["Laminado 3 capas 20K/20K", "Costuras termoselladas", "Cremallera YKK AquaGuard", "Ribete Giallo reflectante"], daysAgo: 8 },
  { slug: "bomber-carbon", name: "Bomber Carbon", category: "chaquetas", collection: "carbon-stealth", gender: "UNISEX", price: 429, compareAt: 520, soldCount: 119, stock: 30, sizes: ALL, colors: ["grafito", "nero", "verde"], shape: "bomber", description: "Bomber de nylon con textura de fibra de carbono y forro amarillo de alto contraste.", details: ["Nylon con textura carbono", "Forro Giallo satinado", "Bolsillo utilitario en manga", "Puños acanalados técnicos"], daysAgo: 70 },
  { slug: "chaqueta-paddock-mujer", name: "Chaqueta Paddock", category: "chaquetas", gender: "MUJER", price: 459, isNew: true, soldCount: 76, stock: 22, sizes: ["XS", "S", "M", "L", "XL"], colors: ["bianco", "nero"], shape: "jacket", description: "Silueta de cintura marcada con paneles de piel vegana y cremallera asimétrica.", details: ["Paneles de piel vegana", "Cremallera asimétrica", "Forro de satén", "Cintura ajustable"], daysAgo: 12 },
  { slug: "puffer-alpine-gt", name: "Puffer Alpine GT", category: "chaquetas", gender: "UNISEX", price: 590, soldCount: 64, stock: 18, sizes: ALL, colors: ["nero", "titanio"], shape: "puffer", description: "Plumón reciclado 700 fill en cámaras horizontales. Calor de motor en pleno invierno.", details: ["Plumón reciclado 700 fill", "Exterior ripstop repelente", "Capucha desmontable", "Bolsillos térmicos"], daysAgo: 150 },

  // PANTALONES
  { slug: "pantalon-gran-turismo", name: "Pantalón Gran Turismo", category: "pantalones", gender: "HOMBRE", price: 189, soldCount: 166, stock: 50, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["nero", "titanio", "blu"], shape: "pants", description: "Sastrería elástica de pierna cónica con cintura técnica ajustable. Del despacho al circuito.", details: ["Lana técnica elástica", "Cintura con ajuste lateral", "Pierna cónica", "Dobladillo sin costura visible"], daysAgo: 45 },
  { slug: "cargo-pitlane", name: "Cargo Pitlane", category: "pantalones", collection: "carbon-stealth", gender: "UNISEX", price: 209, compareAt: 249, soldCount: 139, stock: 44, sizes: ALL, colors: ["grafito", "arena", "nero"], shape: "cargo", description: "Cargo técnico con seis bolsillos y cintas de ajuste en tobillo inspiradas en el equipo de boxes.", details: ["Ripstop elástico", "Seis bolsillos funcionales", "Ajuste en tobillo", "Rodillas articuladas"], daysAgo: 80 },
  { slug: "pantalon-palazzo-giallo", name: "Pantalón Palazzo Línea", category: "pantalones", gender: "MUJER", price: 179, isNew: true, soldCount: 58, stock: 28, sizes: ["XS", "S", "M", "L", "XL"], colors: ["nero", "bianco"], shape: "pants", description: "Talle alto y pierna amplia con raya planchada permanente y vivo amarillo lateral.", details: ["Crepé fluido", "Talle alto", "Raya permanente", "Vivo lateral Giallo"], daysAgo: 10 },

  // JOGGERS
  { slug: "jogger-launch", name: "Jogger Launch", category: "joggers", collection: "giallo-furia", gender: "UNISEX", price: 159, soldCount: 287, stock: 95, sizes: ALL, colors: ["nero", "grafito", "giallo"], shape: "joggers", description: "French terry de 420 g/m² con franja lateral Giallo y puños acanalados.", details: ["French terry 420 g/m²", "Franja lateral contrastada", "Bolsillo trasero con cierre", "Cordón plano"], daysAgo: 25 },
  { slug: "jogger-tech-flow", name: "Jogger Tech Flow", category: "joggers", collection: "carbon-stealth", gender: "HOMBRE", price: 169, compareAt: 199, soldCount: 174, stock: 52, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["grafito", "nero"], shape: "joggers", description: "Tejido técnico de secado rápido con paneles de ventilación y corte aerodinámico.", details: ["Poliamida elástica", "Paneles de ventilación láser", "Bolsillos con cremallera", "Ultraligero"], daysAgo: 100 },
  { slug: "jogger-atelier-mujer", name: "Jogger Atelier", category: "joggers", gender: "MUJER", price: 149, isNew: true, soldCount: 91, stock: 40, sizes: ["XS", "S", "M", "L", "XL"], colors: ["arena", "nero", "bianco"], shape: "joggers", description: "Talle alto, pierna relajada y tacto de cachemira. Lujo para el día libre.", details: ["Mezcla algodón/cachemira", "Talle alto", "Cintura acanalada", "Bordado V tono sobre tono"], daysAgo: 7 },

  // GORRAS
  { slug: "gorra-v-emblem", name: "Gorra V Emblem", category: "gorras", gender: "UNISEX", price: 69, soldCount: 356, stock: 150, sizes: ONE, colors: ["nero", "giallo", "bianco"], shape: "cap", description: "Gorra de seis paneles con emblema V bordado en 3D y cierre de hebilla metálica.", details: ["Sarga de algodón", "Bordado 3D", "Hebilla metálica grabada", "Ajustable"], daysAgo: 35 },
  { slug: "gorra-carbon-trucker", name: "Gorra Carbon Trucker", category: "gorras", collection: "carbon-stealth", gender: "UNISEX", price: 75, compareAt: 89, soldCount: 141, stock: 60, sizes: ONE, colors: ["grafito", "nero"], shape: "cap", description: "Frontal con textura de carbono y malla técnica transpirable.", details: ["Frontal texturizado", "Malla técnica", "Visera curva", "Cierre snapback"], daysAgo: 60 },
  { slug: "gorro-alpine-knit", name: "Gorro Alpine Knit", category: "gorras", gender: "UNISEX", price: 59, isNew: true, soldCount: 77, stock: 80, sizes: ONE, colors: ["nero", "giallo", "titanio"], shape: "beanie", description: "Gorro de punto de lana merino con etiqueta metálica frontal.", details: ["Lana merino extrafina", "Punto acanalado", "Etiqueta metálica", "Doble vuelta"], daysAgo: 9 },

  // ACCESORIOS
  { slug: "bolso-pit-sling", name: "Bolso Pit Sling", category: "accesorios", gender: "UNISEX", price: 149, isNew: true, soldCount: 133, stock: 45, sizes: ONE, colors: ["nero", "giallo"], shape: "bag", description: "Bandolera técnica con correa de cinturón de seguridad y hebilla de liberación rápida.", details: ["Nylon balístico", "Correa tipo cinturón de seguridad", "Hebilla de liberación rápida", "Compartimento acolchado"], daysAgo: 5 },
  { slug: "gafas-aero-visor", name: "Gafas Aero Visor", category: "accesorios", gender: "UNISEX", price: 219, compareAt: 269, soldCount: 98, stock: 30, sizes: ONE, colors: ["nero", "titanio"], shape: "sunglasses", description: "Montura envolvente de titanio con lentes polarizadas espejadas en dorado.", details: ["Montura de titanio", "Lentes polarizadas UV400", "Espejado dorado", "Estuche rígido incluido"], daysAgo: 55 },
  { slug: "cinturon-buckle-v", name: "Cinturón Buckle V", category: "accesorios", gender: "HOMBRE", price: 129, soldCount: 72, stock: 40, sizes: ["S", "M", "L", "XL"], colors: ["nero", "arena"], shape: "belt", description: "Cuero italiano de curtido vegetal con hebilla V mecanizada en CNC.", details: ["Cuero italiano", "Hebilla mecanizada CNC", "Ancho 35 mm", "Cantos pintados a mano"], daysAgo: 85 },
  { slug: "calcetines-grid-pack", name: "Calcetines Grid (Pack 3)", category: "accesorios", gender: "UNISEX", price: 49, soldCount: 244, stock: 200, sizes: ["S", "M", "L"], colors: ["nero", "bianco", "giallo"], shape: "socks", description: "Pack de tres pares con talón y puntera reforzados y franja de parrilla de salida.", details: ["Algodón peinado", "Zonas reforzadas", "Pack de 3 pares", "Compresión ligera"], daysAgo: 20 },

  // EXCLUSIVAS (APEX ATELIER)
  { slug: "bomber-apex-numerada", name: "Bomber Apex Numerada", category: "exclusivas", collection: "apex-atelier", gender: "UNISEX", price: 890, isNew: true, isExclusive: true, soldCount: 112, stock: 12, sizes: ["S", "M", "L", "XL"], colors: ["giallo", "nero"], shape: "bomber", description: "Edición limitada a 300 piezas. Satén italiano, bordados a mano y placa numerada en el interior.", details: ["Satén italiano de seda", "Bordado a mano", "Placa numerada interior", "Caja de presentación", "Edición de 300 piezas"], daysAgo: 2 },
  { slug: "puffer-apex-giallo", name: "Puffer Apex Giallo", category: "exclusivas", collection: "apex-atelier", gender: "UNISEX", price: 990, isExclusive: true, soldCount: 58, stock: 8, sizes: ["S", "M", "L", "XL"], colors: ["giallo"], shape: "puffer", description: "El amarillo más intenso de nuestra historia sobre plumón de oca certificado. Numerada.", details: ["Plumón de oca certificado", "Acabado laca brillante", "Numeración individual", "Edición de 150 piezas"], daysAgo: 15 },
  { slug: "hoodie-apex-cashmere", name: "Hoodie Apex Cashmere", category: "exclusivas", collection: "apex-atelier", gender: "UNISEX", price: 690, isNew: true, isExclusive: true, soldCount: 64, stock: 15, sizes: ALL, colors: ["nero", "titanio"], shape: "hoodie", description: "Cachemira mongola de 12 hilos tejida en Italia. El hoodie más silencioso que existe.", details: ["100% cachemira mongola", "Tejido en Biella, Italia", "Cordones de seda", "Numerado a mano"], daysAgo: 1 },
  { slug: "chaqueta-apex-racing", name: "Chaqueta Apex Racing", category: "exclusivas", collection: "apex-atelier", gender: "HOMBRE", price: 790, compareAt: 950, isExclusive: true, soldCount: 41, stock: 6, sizes: ["M", "L", "XL"], colors: ["nero", "rosso"], shape: "jacket", description: "Chaqueta de piel de cordero con paneles acolchados tipo mono de competición.", details: ["Piel de cordero napa", "Paneles acolchados en hombros", "Herrajes de titanio", "Edición de 100 piezas"], daysAgo: 140 },
  { slug: "jogger-apex-atelier", name: "Jogger Apex Silk", category: "exclusivas", collection: "apex-atelier", gender: "MUJER", price: 420, isExclusive: true, soldCount: 33, stock: 10, sizes: ["XS", "S", "M", "L"], colors: ["nero", "arena"], shape: "joggers", description: "Seda lavada con franja de satén Giallo. Para noches que terminan al amanecer.", details: ["Seda lavada", "Franja de satén", "Cintura elástica forrada", "Edición limitada"], daysAgo: 18 },
];
