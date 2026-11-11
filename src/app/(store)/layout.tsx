import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { FavoritesSync } from "@/components/FavoritesSync";
import { getCurrentUser } from "@/lib/auth";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <>
      <Suspense fallback={<div className="h-[106px]" />}>
        <Header user={user ? { name: user.name, role: user.role } : null} />
      </Suspense>
      <main id="contenido">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <FavoritesSync loggedIn={!!user} />
    </>
  );
}
