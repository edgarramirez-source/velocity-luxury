"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div><p className="eyebrow">Error</p><h1 className="h-display mt-4 text-6xl">Algo salió mal</h1><p className="mt-3 text-white/55">Intenta nuevamente en unos segundos.</p><button onClick={reset} className="btn-primary mt-8">Reintentar</button></div>
    </main>
  );
}
