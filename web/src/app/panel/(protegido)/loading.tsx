import { Spinner } from "@/components/Spinner";

export default function CargandoPanel() {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-20 text-gray-500">
      <Spinner className="h-8 w-8 text-blue-700" />
      <p>Cargando…</p>
    </div>
  );
}
