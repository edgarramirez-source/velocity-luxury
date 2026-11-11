import Link from "next/link";
import { ArrowRight, ChevronDown, Gem, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { toDTO } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Newsletter } from "@/components/Newsletter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, newest, best, collections, apex] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: { where: { active: true } } } } } }),
    prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 8, include: { category: true, collection: true } }),
    prisma.product.findMany({ where: { active: true }, orderBy: { soldCount: "desc" }, take: 4, include: { category: true, collection: true } }),
    prisma.collection.findMany({ where: { exclusive: false }, orderBy: { createdAt: "asc" } }),
    prisma.collection.findFirst({ where: { exclusive: true }, include: { products: { where: { active: true }, take: 3, include: { category: true, collection: true } } } }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden pb-24 pt-40 sm:items-center sm:pb-0">
        <div className="absolute inset-0">
          <img src="/images/hero.svg" alt="Modelo con hoodie Velocity frente a un superdeportivo en un garaje iluminado" className="zoom-out h-full w-full object-cover object-[70%_center]" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
          <div className="absolute inset-0 bg-ink/45 sm:hidden" />
          <div className="absolute inset-0 overflow-hidden"><div className="light-streak absolute top-[62%] h-px w-1/2 bg-gradient-to-r from-transparent via-giallo to-transparent" /></div>
          <div className="absolute inset-0 overflow-hidden"><div className="light-streak absolute top-[30%] h-px w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent [animation-delay:1.6s]" /></div>
        </div>
        <div className="container-x relative">
          <p className="eyebrow rise">Colección Otoño · Invierno 2026</p>
          <h1 className="h-display rise mt-6 text-[clamp(4.2rem,13vw,12rem)] italic [animation-delay:150ms]">
            Drive<br /><span className="text-transparent [-webkit-text-stroke:1.5px_#FFD400]">your</span> style
          </h1>
          <p className="rise mt-6 max-w-md text-lg text-white/70 [animation-delay:300ms]">No sigas tendencias. Crea tu propio camino.</p>
          <div className="rise mt-10 flex flex-wrap gap-4 [animation-delay:450ms]">
            <Link href="/tienda" className="btn-primary">Explorar colección <ArrowRight size={16} /></Link>
            <Link href="/colecciones/apex-atelier" className="btn-outline">Edición Apex Atelier</Link>
          </div>
          <dl className="rise mt-16 hidden max-w-2xl grid-cols-3 border-t border-white/10 pt-6 sm:grid [animation-delay:600ms]">
            {[["480", "g/m² French terry"], ["300", "piezas numeradas"], ["48h", "envío express"]].map(([v, l]) => (
              <div key={l}><dt className="sr-only">{l}</dt><dd className="font-display text-4xl font-bold text-white">{v}</dd><dd className="mt-1 font-tech text-[9px] tracking-[0.2em] uppercase text-white/45">{l}</dd></div>
            ))}
          </dl>
        </div>
        <a href="#categorias" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 hover:text-giallo sm:flex" aria-label="Desplazarse a categorías">
          <span className="font-tech text-[8px] tracking-[0.4em]">SCROLL</span><ChevronDown className="animate-bounce" size={18} />
        </a>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-white/[0.06] bg-carbon py-5" aria-hidden>
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-3xl font-extrabold uppercase italic">
          {Array.from({ length: 2 }).flatMap((_, k) => ["Born to stand out", "Drive your style", "Hecho para destacar", "Ediciones limitadas", "Lujo urbano"].map((t, i) => (
            <span key={`${k}-${i}`} className="flex items-center gap-12">{i % 2 ? <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.5)]">{t}</span> : <span>{t}</span>}<span className="text-giallo">◆</span></span>
          )))}
        </div>
      </div>

      {/* CATEGORÍAS */}
      <section id="categorias" className="container-x pt-28">
        <Reveal><SectionHeading eyebrow="Categorías" title="Elige tu máquina" href="/tienda" linkLabel="Toda la tienda" /></Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 4) * 90}>
              <Link href={`/tienda?categoria=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-graphite">
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-1000 ease-race group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <p className="font-tech text-[8px] tracking-[0.3em] text-giallo">{String(i + 1).padStart(2, "0")} · {c._count.products} PIEZAS</p>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-none sm:text-3xl">{c.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 font-tech text-[9px] tracking-[0.2em] text-white/60 transition group-hover:text-giallo">DESCUBRIR <ArrowRight size={12} className="transition group-hover:translate-x-1" /></span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-giallo transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NOVEDADES */}
      <section className="container-x pt-32">
        <Reveal><SectionHeading eyebrow="Recién salidos del taller" title="Novedades" href="/tienda?orden=novedades" /></Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {newest.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 90}><ProductCard p={toDTO(p)} /></Reveal>)}
        </div>
      </section>

      {/* APEX ATELIER */}
      {apex && (
        <section className="relative mt-32 overflow-hidden border-y border-white/[0.06] bg-carbon">
          <div className="grid-lines absolute inset-0 opacity-60" />
          <div className="container-x relative grid items-center gap-12 py-24 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">Colección exclusiva</p>
              <h2 className="h-display mt-4 text-6xl sm:text-8xl">{apex.name}</h2>
              <p className="mt-2 font-tech text-xs tracking-[0.3em] text-white/60">{apex.tagline.toUpperCase()}</p>
              <p className="mt-8 max-w-lg text-white/65 leading-relaxed">{apex.description}</p>
              <ul className="mt-8 grid max-w-md grid-cols-2 gap-4 text-sm">
                {["Confección artesanal", "Materiales italianos", "Numeración individual", "Caja de presentación"].map((t) => <li key={t} className="flex items-center gap-3 text-white/80"><span className="h-px w-6 bg-giallo" />{t}</li>)}
              </ul>
              <Link href={`/colecciones/${apex.slug}`} className="btn-primary mt-10">Descubrir la edición <ArrowRight size={16} /></Link>
            </Reveal>
            <Reveal delay={150}>
              <div className="relative">
                <img src={apex.image} alt={`Colección ${apex.name}`} loading="lazy" className="angled w-full" />
                <div className="absolute -bottom-6 -left-4 hidden border border-giallo/40 bg-ink/90 px-6 py-4 backdrop-blur sm:block">
                  <p className="font-tech text-[9px] tracking-[0.3em] text-white/50">QUEDAN</p>
                  <p className="font-display text-4xl font-bold text-giallo">{apex.products.reduce((s, p) => s + p.stock, 0)} <span className="text-base text-white/60">piezas</span></p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* COLECCIONES */}
      <section className="container-x pt-32">
        <Reveal><SectionHeading eyebrow="Colecciones" title="Tres caracteres" href="/colecciones" /></Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 120}>
              <Link href={`/colecciones/${c.slug}`} className="group relative block aspect-[16/11] overflow-hidden bg-graphite md:aspect-[3/4]">
                <img src={c.image} alt={`Colección ${c.name}`} loading="lazy" className="h-full w-full object-cover transition duration-1000 ease-race group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="h-display text-4xl">{c.name}</h3>
                  <p className="mt-2 text-sm text-white/60">{c.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MÁS VENDIDOS */}
      <section className="container-x pt-32">
        <Reveal><SectionHeading eyebrow="Pole position" title="Los más vendidos" href="/tienda?orden=popularidad" /></Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {best.map((p, i) => <Reveal key={p.id} delay={i * 90}><ProductCard p={toDTO(p)} /></Reveal>)}
        </div>
      </section>

      {/* VALORES */}
      <section className="container-x pt-32">
        <div className="grid gap-px overflow-hidden border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Gem, t: "Materiales premium", d: "Algodón supima, cachemira y tejidos técnicos de Italia y Portugal." },
            { i: Truck, t: "Envío express", d: "Entrega en 24–48 h en Quito y Guayaquil. Gratis sobre $150." },
            { i: RotateCcw, t: "Devoluciones 30 días", d: "Cambios y devoluciones sin complicaciones." },
            { i: ShieldCheck, t: "Pago seguro", d: "Transacciones cifradas con PayPhone, PayPal y Stripe." },
          ].map(({ i: Icon, t, d }, k) => (
            <Reveal key={t} delay={k * 80} className="bg-ink p-8">
              <Icon className="text-giallo" size={26} strokeWidth={1.4} />
              <h3 className="mt-6 font-tech text-[11px] tracking-[0.2em] uppercase">{t}</h3>
              <p className="mt-3 text-sm text-white/50 leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MANIFIESTO + NEWSLETTER */}
      <section className="container-x pt-32">
        <Reveal className="relative overflow-hidden border border-white/[0.06] bg-gradient-to-br from-graphite to-ink p-10 sm:p-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-giallo/10 blur-3xl" />
          <p className="eyebrow">Club Velocity</p>
          <h2 className="h-display mt-4 max-w-3xl text-5xl sm:text-7xl">Acceso anticipado a cada lanzamiento</h2>
          <p className="mt-6 max-w-xl text-white/60">Suscríbete y recibe primero las ediciones limitadas, eventos privados y beneficios exclusivos para miembros.</p>
          <div className="mt-10"><Newsletter large /></div>
        </Reveal>
      </section>
    </>
  );
}
