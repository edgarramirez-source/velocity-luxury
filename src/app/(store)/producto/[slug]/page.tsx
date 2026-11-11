import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toDTO } from "@/lib/products";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await prisma.product.findUnique({ where: { slug: (await params).slug } });
  if (!p) return { title: "Producto no encontrado" };
  return { title: p.name, description: p.description, openGraph: { images: [JSON.parse(p.images)[0]] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await prisma.product.findUnique({ where: { slug }, include: { category: true, collection: true } });
  if (!row || !row.active) notFound();
  const p = toDTO(row);
  const related = await prisma.product.findMany({ where: { active: true, id: { not: row.id }, OR: [{ categoryId: row.categoryId }, ...(row.collectionId ? [{ collectionId: row.collectionId }] : [])] }, take: 4, orderBy: { soldCount: "desc" }, include: { category: true, collection: true } });
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, image: p.images, brand: { "@type": "Brand", name: "VELOCITY LUXURY" }, offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return (
    <div className="container-x pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail p={p} />
      {related.length > 0 && (
        <section className="pt-32">
          <SectionHeading eyebrow="Completa el look" title="También te puede gustar" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={toDTO(r)} />)}</div>
        </section>
      )}
    </div>
  );
}
