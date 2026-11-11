"use client";
import { create } from "zustand";

export interface Toast { id: number; title: string; description?: string; image?: string; tone?: "success" | "error" | "info"; action?: { label: string; href: string } }
interface UIState {
  toasts: Toast[]; toast: (t: Omit<Toast, "id">) => void; dismiss: (id: number) => void;
  searchOpen: boolean; setSearchOpen: (o: boolean) => void;
  favorites: Set<string>; favLoaded: boolean; setFavorites: (ids: string[]) => void; setFav: (id: string, on: boolean) => void;
}
let n = 0;
export const useUI = create<UIState>()((set, get) => ({
  toasts: [],
  toast: (t) => { const id = ++n; set({ toasts: [...get().toasts.slice(-2), { ...t, id }] }); setTimeout(() => get().dismiss(id), 4200); },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  searchOpen: false, setSearchOpen: (searchOpen) => set({ searchOpen }),
  favorites: new Set(), favLoaded: false,
  setFavorites: (ids) => set({ favorites: new Set(ids), favLoaded: true }),
  setFav: (id, on) => { const s = new Set(get().favorites); if (on) s.add(id); else s.delete(id); set({ favorites: s }); },
}));
