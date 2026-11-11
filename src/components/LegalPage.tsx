import { PageHero } from "./catalog/CatalogView";

export function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated?: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <div className="container-x max-w-3xl">
        {updated && <p className="font-tech text-[9px] tracking-[0.25em] text-white/40">ÚLTIMA ACTUALIZACIÓN: {updated.toUpperCase()}</p>}
        <article className="prose-lux mt-6">{children}</article>
      </div>
    </>
  );
}
