import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/ui";
import { MessageActions } from "@/components/admin/MessageActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mensajes" };
export default async function Page() {
  const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <AdminHeader title="Mensajes" subtitle="Recibidos desde el formulario de contacto." />
      {msgs.length === 0 ? <p className="card p-10 text-center text-white/50">No hay mensajes.</p> : (
        <ul className="space-y-3">{msgs.map((m) => (
          <li key={m.id} className={`card p-6 ${m.read ? "" : "border-l-2 border-l-giallo"}`}>
            <div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{m.subject}{!m.read && <span className="badge ml-2 bg-giallo text-black">Nuevo</span>}</p><p className="text-xs text-white/40">{formatDate(m.createdAt)}</p></div>
            <p className="mt-1 text-sm text-white/50">{m.name} · {m.email}</p>
            <p className="mt-4 whitespace-pre-line text-sm text-white/75">{m.message}</p>
            <div className="mt-5"><MessageActions id={m.id} read={m.read} email={m.email} subject={m.subject} /></div>
          </li>
        ))}</ul>
      )}
    </div>
  );
}
