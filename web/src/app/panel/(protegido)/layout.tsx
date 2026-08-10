import Link from "next/link";
import { AutoLogout } from "@/components/AutoLogout";
import { cerrarSesion } from "./actions";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AutoLogout />
      <header className="border-b border-black/10 px-4 py-3">
        <nav className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/panel" className="font-semibold">
              Panel NOM-036
            </Link>
            <Link href="/panel/nueva" className="text-sm text-gray-600 hover:text-black">
              Nueva evaluación
            </Link>
          </div>
          <form action={cerrarSesion}>
            <button type="submit" className="text-sm text-gray-600 hover:text-black">
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-6">{children}</div>
    </div>
  );
}
