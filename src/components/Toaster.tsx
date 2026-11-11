"use client";
import Link from "next/link";
import { Check, Info, X, AlertTriangle } from "lucide-react";
import { useUI } from "@/store/ui";
import { thumb } from "@/lib/media";

export function Toaster() {
  const { toasts, dismiss } = useUI();
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div key={t.id} className="toast-in pointer-events-auto relative flex gap-4 overflow-hidden border border-white/10 bg-graphite/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className={`absolute inset-y-0 left-0 w-1 ${t.tone === "error" ? "bg-red-500" : "bg-giallo"}`} />
          {t.image ? <img src={thumb(t.image)} alt="" className="h-16 w-14 object-cover" /> :
            <div className={`grid h-9 w-9 shrink-0 place-items-center ${t.tone === "error" ? "bg-red-500/15 text-red-400" : "bg-giallo/15 text-giallo"}`}>{t.tone === "error" ? <AlertTriangle size={16} /> : t.tone === "info" ? <Info size={16} /> : <Check size={16} />}</div>}
          <div className="min-w-0 flex-1">
            <p className="font-tech text-[10px] tracking-[0.2em] uppercase text-white">{t.title}</p>
            {t.description && <p className="mt-1 text-sm text-white/60">{t.description}</p>}
            {t.action && <Link href={t.action.href} onClick={() => dismiss(t.id)} className="mt-2 inline-block font-tech text-[9px] tracking-[0.25em] uppercase text-giallo hover:underline">{t.action.label} →</Link>}
          </div>
          <button onClick={() => dismiss(t.id)} className="self-start text-white/40 hover:text-white" aria-label="Cerrar notificación"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}
