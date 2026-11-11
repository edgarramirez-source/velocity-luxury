"use client";
import { useRouter } from "next/navigation";
import { Check, Mail, Trash2 } from "lucide-react";

export function MessageActions({ id, read, email, subject }: { id: string; read: boolean; email: string; subject: string }) {
  const router = useRouter();
  return (
    <div className="flex gap-4 text-xs">
      <a href={`mailto:${email}?subject=${encodeURIComponent("Re: " + subject)}`} onClick={() => fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) }).then(() => router.refresh())} className="flex items-center gap-1 text-giallo hover:underline"><Mail size={13} />Responder</a>
      <button onClick={async () => { await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: !read }) }); router.refresh(); }} className="flex items-center gap-1 text-white/60 hover:text-white"><Check size={13} />{read ? "Marcar no leído" : "Marcar leído"}</button>
      <button onClick={async () => { if (!confirm("¿Eliminar mensaje?")) return; await fetch(`/api/admin/messages/${id}`, { method: "DELETE" }); router.refresh(); }} className="flex items-center gap-1 text-white/60 hover:text-red-400"><Trash2 size={13} />Eliminar</button>
    </div>
  );
}
