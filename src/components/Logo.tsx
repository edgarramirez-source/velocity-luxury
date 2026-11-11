import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M4 12h17l11 26 11-26h17L32 58z" fill="#FFD400" />
      <path d="M21 12h4l9 21-2 5z" fill="#000" opacity=".35" />
      <path d="M0 12h3l29 46-2 4z" fill="#fff" opacity=".85" />
    </svg>
  );
}
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="VELOCITY LUXURY — Inicio">
      <LogoMark className="h-8 w-8 transition-transform duration-500 group-hover:-skew-x-12" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-tech text-[15px] tracking-[0.32em] text-white">VELOCITY</span>
          <span className="mt-1 font-tech text-[7.5px] tracking-[0.78em] text-giallo">LUXURY</span>
        </span>
      )}
    </Link>
  );
}
