import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, href, linkLabel = "Ver todo" }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h-display mt-3 text-5xl sm:text-6xl">{title}</h2>
      </div>
      {href && <Link href={href} className="group hidden items-center gap-2 font-tech text-[10px] tracking-[0.25em] uppercase text-white/70 hover:text-giallo sm:flex">{linkLabel}<ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>}
    </div>
  );
}
