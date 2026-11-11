/** Barras horizontales con etiqueta directa (sin color como única codificación). */
export function HBarList({ data, unit = "" }: { data: { label: string; value: number; sub?: string; image?: string }[]; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-4">
      {data.map((d) => (
        <li key={d.label} className="flex items-center gap-3" title={`${d.label}: ${d.value}{unit}`}>
          {d.image && <img src={d.image} alt="" className="h-11 w-9 object-cover" />}
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-3 text-sm"><span className="truncate text-white/80">{d.label}</span><span className="shrink-0 text-white">{d.value}{unit}</span></div>
            <div className="mt-1.5 h-1.5 bg-white/[0.06]"><div className="h-full rounded-r-[4px] bg-giallo" style={{ width: `${(d.value / max) * 100}%` }} /></div>
            {d.sub && <p className="mt-1 text-[11px] text-white/40">{d.sub}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
