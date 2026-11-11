"use client";
import { createElement, useEffect, useState } from "react";
import { RotateCw } from "lucide-react";

/** Visor 360° interactivo (arrastrar para girar, pellizcar/rueda para zoom). */
export function Viewer360({ src, alt, poster }: { src: string; alt: string; poster?: string }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { import("@google/model-viewer").then(() => setReady(true)).catch(() => setFailed(true)); }, []);
  if (failed) return <div className="grid h-full place-items-center p-6 text-center text-sm text-white/50">No se pudo cargar la vista 360°.</div>;
  return (
    <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_center,#2a2a2d_0%,#0c0c0e_70%)]">
      {ready && createElement("model-viewer", {
        src, alt, poster, "camera-controls": true, "auto-rotate": true, "auto-rotate-delay": 0, "rotation-per-second": "25deg",
        "interaction-prompt": "auto", "shadow-intensity": "1", exposure: "1.1", "environment-image": "neutral", "touch-action": "pan-y",
        style: { width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" },
        onError: () => setFailed(true),
      })}
      <p className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-black/60 px-3 py-1.5 font-tech text-[9px] tracking-[0.2em] text-white/80 backdrop-blur"><RotateCw size={12} className="text-giallo" />ARRASTRA PARA GIRAR 360°</p>
    </div>
  );
}
