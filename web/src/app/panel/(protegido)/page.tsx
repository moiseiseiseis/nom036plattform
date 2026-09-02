import Link from "next/link";
import { obtenerResumenInformeSeguro, type ResumenInforme } from "@/lib/informes";
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

const BUCKET_ETIQUETAS: Record<string, string> = {
  inexistente: "Inexistente",
  minimo: "Mínimo",
  regular: "Regular",
  aceptable: "Aceptable",
  optimo: "Óptimo",
};

const COLOR_BUCKET: Record<string, string> = {
  inexistente: "text-red-700",
  minimo: "text-orange-700",
  regular: "text-yellow-700",
  aceptable: "text-emerald-700",
  optimo: "text-blue-700",
};

export default async function ListadoEvaluacionesPage() {
  const evaluaciones = await listarEvaluaciones();

  const resumenes = new Map<string, ResumenInforme | null>(
    await Promise.all(
      evaluaciones
        .filter((ev) => ev.estado !== "pendiente")
        .map(async (ev) => [ev.id, await obtenerResumenInformeSeguro(ev.id)] as const)
    )
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Evaluaciones</h1>
        <Link
          href="/panel/nueva"
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
        >
          + Nueva evaluación
        </Link>
      </div>

      {evaluaciones.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Todavía no hay evaluaciones. Crea la primera.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-gray-500">
                <th className="py-3 pr-4 pl-6">Empresa</th>
                <th className="py-3 pr-4">Estado</th>
                <th className="py-3 pr-4">Resultado global</th>
                <th className="py-3 pr-4">Fecha</th>
                <th className="py-3 pr-6" />
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map((ev) => {
                const resumen = resumenes.get(ev.id);
                return (
                  <tr key={ev.id} className="border-b border-black/5 transition-colors last:border-0 hover:bg-gray-50">
                    <td className="py-3 pr-4 pl-6 font-medium">{ev.empresa_nombre}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${COLOR_ESTADO[ev.estado] ?? ""}`}
                      >
                        {ETIQUETA_ESTADO[ev.estado] ?? ev.estado}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {ev.estado === "pendiente" ? (
                        <span className="text-gray-400">Sin responder</span>
                      ) : resumen ? (
                        <span className={`font-medium ${COLOR_BUCKET[resumen.global.bucket] ?? ""}`}>
                          {resumen.global.porcentaje}% · {BUCKET_ETIQUETAS[resumen.global.bucket] ?? resumen.global.bucket}
                        </span>
                      ) : (
                        <span className="text-gray-400">No disponible</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(ev.fecha).toLocaleDateString("es-MX")}
                    </td>
                    <td className="py-3 pr-6 text-right">
                      <Link
                        href={`/panel/evaluaciones/${ev.id}`}
                        className="text-sm font-medium text-blue-700 hover:underline"
                      >
                        Ver detalle →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
