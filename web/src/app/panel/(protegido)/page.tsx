import Link from "next/link";
import { listarEvaluaciones } from "@/lib/nom036/panel";

const ETIQUETA_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  completado: "Completado",
  revisado: "Revisado",
};

const COLOR_ESTADO: Record<string, string> = {
  pendiente: "bg-gray-100 text-gray-700",
  completado: "bg-yellow-100 text-yellow-800",
  revisado: "bg-green-100 text-green-800",
};

export default async function ListadoEvaluacionesPage() {
  const evaluaciones = await listarEvaluaciones();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Evaluaciones</h1>
        <Link
          href="/panel/nueva"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          + Nueva evaluación
        </Link>
      </div>

      {evaluaciones.length === 0 ? (
        <p className="text-gray-600">Todavía no hay evaluaciones. Crea la primera.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-gray-500">
              <th className="py-2 pr-4">Empresa</th>
              <th className="py-2 pr-4">Estado</th>
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((ev) => (
              <tr key={ev.id} className="border-b border-black/5">
                <td className="py-3 pr-4 font-medium">{ev.empresa_nombre}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${COLOR_ESTADO[ev.estado] ?? ""}`}
                  >
                    {ETIQUETA_ESTADO[ev.estado] ?? ev.estado}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {new Date(ev.fecha).toLocaleDateString("es-MX")}
                </td>
                <td className="py-3 text-right">
                  <Link href={`/panel/evaluaciones/${ev.id}`} className="text-sm underline">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
