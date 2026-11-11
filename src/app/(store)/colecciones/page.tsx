import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/catalog/CatalogView";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Colecciones" };
export const dynamic = "force-dynamic";

export default async function Colecciones() {
  const cols = await prisma.collection.findMany({ orderBy: [{ exclusive: "desc" }, { createdAt: "asc" }], include: { _count: { select: { products: { where: { active: true } } } } } });
  return (
    <>
      <PageHero eyebrow="Colecciones" title="Cada una, un carácter" subtitle="Cuatro identidades nacidas del mismo garaje. Elige la tuya." />
      <div className="container-x space-y-6">
        {cols.map((c, i) => (
          <Reveal key={c.id}>
            <Link href={`/colecciones/${c.slug}`} className="group relative grid overflow-hidden border border-white/[0.06] bg-carbon md:grid-cols-2">
              <div className={`relative aspect-[16/9] overflow-hidden ${i % 2 ? "md:order-2" : ""}`}>
                <img src={c.image} alt={`Colección ${c.name}`} loading={i < 2 ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-1000 ease-race group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-14">
                <p className="eyebrow">{c.exclusive ? "Edición exclusiva" : `Colección 0${i}`} · {c._count.products} piezas</p>
                <h2 className="h-display mt-4 text-5xl sm:text-7xl">{c.name}</h2>
                <p className="mt-2 font-tech text-[10px] tracking-[0.3em] text-white/50">{c.tagline.toUpperCase()}</p>
                <p className="mt-6 max-w-md text-white/60 leading-relaxed">{c.description}</p>
                <span className="mt-8 inline-flex items-center gap-3 font-tech text-[10px] tracking-[0.25em] text-giallo">VER COLECCIÓN <ArrowRight size={14} className="transition group-hover:translate-x-2" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
