import { requireUser } from "@/lib/auth";
import { AccountNav } from "@/components/account/AccountNav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="container-x py-14">
      <p className="eyebrow">Mi cuenta</p>
      <h1 className="h-display mt-3 text-5xl sm:text-6xl">Hola, {user.name.split(" ")[0]}</h1>
      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside><AccountNav isAdmin={user.role === "ADMIN"} /></aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
