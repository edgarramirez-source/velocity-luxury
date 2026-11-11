"use client";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";

/** Barras verticales de una sola serie con tooltip por barra. */
export function RevenueChart({ data }: { data: { label: string; value: number; orders: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 900, H = 380, pad = 34, bw = (W - pad) / data.length;
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" role="img" aria-label="Ingresos por día en los últimos 30 días">
        {ticks.map((t) => { const y = H - (t / max) * (H - 10); return <g key={t}><line x1={pad} x2={W} y1={y} y2={y} stroke="rgba(255,255,255,.07)" /><text x={0} y={y + 3} fill="rgba(255,255,255,.4)" fontSize="13">{t >= 1000 ? `${Math.round(t / 100) / 10}k` : t}</text></g>; })}
        {data.map((d, i) => {
          const h = Math.max(d.value ? 3 : 0, (d.value / max) * (H - 10)); const x = pad + i * bw + 1;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad + i * bw} y={0} width={bw} height={H} fill="transparent" />
              <path d={`M${x},${H} V${H - h + 3} q0,-3 3,-3 h${bw - 8} q3,0 3,3 V${H} Z`} fill="#FFD400" opacity={hover === null || hover === i ? 1 : 0.35} />
              {i % 5 === 0 && <text x={x + bw / 2} y={H + 16} textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="13">{d.label}</text>}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-0 border border-white/10 bg-ink/95 px-3 py-2 text-xs shadow-xl" style={{ left: `clamp(0px, calc(${((hover + 0.5) / data.length) * 100}% - 60px), calc(100% - 130px))` }}>
          <p className="text-white/50">{data[hover].label}</p><p className="font-semibold text-white">{formatPrice(data[hover].value)}</p><p className="text-white/50">{data[hover].orders} pedidos</p>
        </div>
      )}
    </div>
  );
}

