"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUI } from "@/store/ui";
import { ORDER_STATUSES, PAYMENT_STATUSES, STATUS_LABEL } from "@/lib/utils";

export function OrderControls({ id, status, paymentStatus }: { id: string; status: string; paymentStatus: string }) {
  const router = useRouter(); const toast = useUI((s) => s.toast);
  const [s, setS] = useState(status); const [p, setP] = useState(paymentStatus); const [saving, setSaving] = useState(false);
  async function save() {
    if (s === "CANCELADO" && status !== "CANCELADO" && !confirm("Al cancelar se repondrá el inventario. ¿Continuar?")) return;
    setSaving(true);
    const r = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s, paymentStatus: p }) });
    setSaving(false);
    if (r.ok) { toast({ title: "Pedido actualizado", description: "Se notificó al cliente por correo.", tone: "success" }); router.refresh(); } else toast({ title: "Error", tone: "error" });
  }
  return (
    <div className="space-y-4">
      <div><label className="label" htmlFor="st">Estado del pedido</label><select id="st" value={s} onChange={(e) => setS(e.target.value)} className="input">{ORDER_STATUSES.map((x) => <option key={x} value={x} className="bg-ink">{STATUS_LABEL[x]}</option>)}</select></div>
      <div><label className="label" htmlFor="ps">Estado del pago</label><select id="ps" value={p} onChange={(e) => setP(e.target.value)} className="input">{PAYMENT_STATUSES.map((x) => <option key={x} value={x} className="bg-ink">{STATUS_LABEL[x]}</option>)}</select></div>
      <button onClick={save} disabled={saving || (s === status && p === paymentStatus)} className="btn-primary w-full">{saving ? "Guardando..." : "Actualizar pedido"}</button>
    </div>
  );
}

export function QuickStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter(); const toast = useUI((s) => s.toast);
  return (
    <select value={status} aria-label="Cambiar estado" onChange={async (e) => {
      const v = e.target.value; if (v === "CANCELADO" && !confirm("Al cancelar se repondrá el inventario. ¿Continuar?")) return;
      const r = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: v }) });
      if (r.ok) { toast({ title: `Estado: ${STATUS_LABEL[v]}`, tone: "success" }); router.refresh(); }
    }} className="border border-white/15 bg-ink px-2 py-1.5 text-xs outline-none focus:border-giallo">
      {ORDER_STATUSES.map((x) => <option key={x} value={x}>{STATUS_LABEL[x]}</option>)}
    </select>
  );
}
