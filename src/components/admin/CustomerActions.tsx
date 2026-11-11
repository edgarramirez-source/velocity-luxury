"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useUI } from "@/store/ui";

export function CustomerActions({ id, name, role, self }: { id: string; name: string; role: string; self: boolean }) {
  const router = useRouter(); const toast = useUI((s) => s.toast);
  if (self) return <span className="text-xs text-white/30">Tu cuenta</span>;
  return (
    <div className="flex items-center justify-end gap-2">
      <select value={role} aria-label={`Rol de ${name}`} onChange={async (e) => {
        const r = await fetch(`/api/admin/customers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: e.target.value }) });
        const j = await r.json(); if (r.ok) { toast({ title: "Rol actualizado", tone: "success" }); router.refresh(); } else toast({ title: "Error", description: j.error, tone: "error" });
      }} className="border border-white/15 bg-ink px-2 py-1.5 text-xs"><option value="CUSTOMER">Cliente</option><option value="ADMIN">Administrador</option></select>
      <button onClick={async () => {
        if (!confirm(`¿Eliminar la cuenta de ${name}? Sus pedidos se conservarán.`)) return;
        const r = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" }); if (r.ok) { toast({ title: "Cliente eliminado", tone: "info" }); router.refresh(); }
      }} className="p-2 text-white/40 hover:text-red-400" aria-label={`Eliminar ${name}`}><Trash2 size={15} /></button>
    </div>
  );
}
