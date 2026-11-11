export function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow">Admin</p><h1 className="h-display mt-2 text-5xl">{title}</h1>{subtitle && <p className="mt-2 text-sm text-white/50">{subtitle}</p>}</div>
      {action}
    </div>
  );
}
export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left font-tech text-[9px] font-normal tracking-[0.2em] text-white/40 uppercase ${className}`}>{children}</th>;
}
