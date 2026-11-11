import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-center">
      <div>
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="h-display mt-4 text-7xl sm:text-9xl">Fuera de pista</h1>
        <p className="mx-auto mt-4 max-w-md text-white/55">La página que buscas no existe o fue movida.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4"><Link href="/" className="btn-primary">Volver al inicio</Link><Link href="/tienda" className="btn-outline">Ir a la tienda</Link></div>
      </div>
    </main>
  );
}
