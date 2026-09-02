import Link from "next/link";
import { notFound } from "next/navigation";
import { CampoEnlace } from "@/components/CampoEnlace";
import { obtenerResumenInforme } from "@/lib/informes";
import { getEvaluacionDetallePanel } from "@/lib/nom036/panel";
import { marcarRevisadoAction } from "./actions";

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

export default async function DetalleEvaluacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evaluacion = await getEvaluacionDetallePanel(id);

  if (!evaluacion) {
    notFound();
  }

  const tieneResultados = evaluacion.estado === "completado" || evaluacion.estado === "revisado";
  const resumen = tieneResultados ? await obtenerResumenInforme(evaluacion.id) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/panel" className="text-sm text-blue-700 hover:underline">
          ← Volver al listado
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-xl font-semibold">{evaluacion.empresa.nombre}</h1>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${COLOR_ESTADO[evaluacion.estado] ?? ""}`}
          >
            {ETIQUETA_ESTADO[evaluacion.estado] ?? evaluacion.estado}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(evaluacion.fecha).toLocaleDateString("es-MX")}
        </p>
      </div>

      {evaluacion.estado === "pendiente" && (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Esta empresa todavía no responde el cuestionario. Comparte este enlace:
          </p>
          <div className="mt-2">
            <CampoEnlace path={`/evaluar/${evaluacion.token_publico}`} />
          </div>
        </div>
      )}

      {tieneResultados && resumen === null && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No se pudo obtener el resultado calculado del servicio de informes.
        </div>
      )}

      {resumen && (
        <div className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Resultados</h2>
            <p
              className={`mt-1 text-2xl font-semibold ${COLOR_BUCKET[resumen.global.bucket] ?? ""}`}
            >
              {resumen.global.porcentaje}% · {BUCKET_ETIQUETAS[resumen.global.bucket] ?? resumen.global.bucket}
            </p>
            <p className="text-sm text-gray-500">
              {resumen.global.puntaje}/{resumen.global.puntaje_maximo} puntos en total
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-gray-500">
                  <th className="py-2 pr-4">Criterio</th>
                  <th className="py-2 pr-4">Puntaje</th>
                  <th className="py-2 pr-4">%</th>
                  <th className="py-2">Clasificación</th>
                </tr>
              </thead>
              <tbody>
                {resumen.criterios.map((c) => (
                  <tr key={c.numero} className="border-b border-black/5">
                    <td className="py-2 pr-4">
                      {c.numero}. {c.nombre}
                    </td>
                    <td className="py-2 pr-4">
                      {c.puntaje}/{c.puntaje_maximo}
                    </td>
                    <td className="py-2 pr-4">{c.porcentaje}%</td>
                    <td className={`py-2 font-medium ${COLOR_BUCKET[c.bucket] ?? ""}`}>
                      {BUCKET_ETIQUETAS[c.bucket] ?? c.bucket}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
            {resumen.global.cierre}
          </div>

          {resumen.global.temas_obligatorios.length > 0 && (
            <div>
              <h3 className="font-medium">Temas obligatorios</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {resumen.global.temas_obligatorios.map((tema, i) => (
                  <li key={i}>{tema}</li>
                ))}
              </ul>
            </div>
          )}

          {resumen.global.temas_optativos.length > 0 && (
            <div>
              <h3 className="font-medium">Temas optativos</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {resumen.global.temas_optativos.map((tema, i) => (
                  <li key={i}>{tema}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 border-t border-black/5 pt-6">
            <a
              href={`/panel/api/informes/${evaluacion.id}`}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
            >
              Descargar informe (.docx)
            </a>
            {evaluacion.estado === "completado" && (
              <form action={marcarRevisadoAction.bind(null, evaluacion.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-black/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50"
                >
                  Marcar como revisado
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
