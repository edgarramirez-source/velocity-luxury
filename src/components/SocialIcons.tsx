export const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/", d: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" },
  { name: "TikTok", href: "https://tiktok.com/", d: "M16 3c.4 2.3 1.9 3.9 4 4.2v3.1a7.3 7.3 0 01-4-1.2v6.4A6.5 6.5 0 119.5 9v3.2a3.3 3.3 0 103.3 3.3V3z" },
  { name: "Facebook", href: "https://facebook.com/", d: "M14 8h3V4h-3a4 4 0 00-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" },
  { name: "YouTube", href: "https://youtube.com/", d: "M22 8.2a3 3 0 00-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 002 8.2 31 31 0 002 12a31 31 0 00.1 3.8 3 3 0 002.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 002.1-2.1A31 31 0 0022 12a31 31 0 000-3.8zM10 15.1V8.9l5.2 3.1z" },
];
export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {SOCIALS.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="grid h-10 w-10 place-items-center border border-white/10 text-white/60 transition hover:border-giallo hover:text-giallo">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d={s.d} /></svg>
        </a>
      ))}
    </div>
  );
}
