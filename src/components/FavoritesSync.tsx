"use client";
import { useEffect } from "react";
import { useUI } from "@/store/ui";

export function FavoritesSync({ loggedIn }: { loggedIn: boolean }) {
  const setFavorites = useUI((s) => s.setFavorites);
  useEffect(() => {
    if (!loggedIn) { setFavorites([]); return; }
    fetch("/api/favorites").then((r) => (r.ok ? r.json() : { ids: [] })).then((j) => setFavorites(j.ids ?? []));
  }, [loggedIn, setFavorites]);
  return null;
}
