import { ABOUT_IMAGE } from "@/lib/media";

export function AuthShell({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="container-x grid min-h-[75vh] items-stretch gap-0 py-12 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={ABOUT_IMAGE} alt="" className="zoom-out absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute bottom-10 left-10"><p className="eyebrow">Club Velocity</p><p className="h-display mt-3 text-5xl">Born to<br />stand out</p></div>
      </div>
      <div className="flex items-center border border-white/[0.06] bg-carbon/60 px-6 py-14 sm:px-14">
        <div className="mx-auto w-full max-w-md">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="h-display mt-3 text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 text-sm text-white/55">{subtitle}</p>}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
