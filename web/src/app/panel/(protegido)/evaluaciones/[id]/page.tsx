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

const ETIQUETA_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  completado: "Completado",
  revisado: "Revisado",
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
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/panel" className="text-sm underline">
          ← Volver al listado
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{evaluacion.empresa.nombre}</h1>
        <p className="text-sm text-gray-500">
          Estado: {ETIQUETA_ESTADO[evaluacion.estado] ?? evaluacion.estado} ·{" "}
          {new Date(evaluacion.fecha).toLocaleDateString("es-MX")}
        </p>
      </div>

      {evaluacion.estado === "pendiente" && (
        <div className="rounded-lg border border-black/10 p-4">
          <p className="text-sm text-gray-600">
            Esta empresa todavía no responde el cuestionario. Comparte este enlace:
          </p>
          <div className="mt-2">
            <CampoEnlace path={`/evaluar/${evaluacion.token_publico}`} />
          </div>
        </div>
      )}

      {tieneResultados && resumen === null && (
        <p className="text-sm text-red-700">
          No se pudo obtener el resultado calculado del servicio de informes.
        </p>
      )}

      {resumen && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Resultados</h2>
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
                  <td className="py-2">{BUCKET_ETIQUETAS[c.bucket] ?? c.bucket}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <p className="font-medium">
              Global: {resumen.global.puntaje}/{resumen.global.puntaje_maximo} (
              {resumen.global.porcentaje}%,{" "}
              {BUCKET_ETIQUETAS[resumen.global.bucket] ?? resumen.global.bucket})
            </p>
            <p className="mt-2 text-gray-600">{resumen.global.cierre}</p>
          </div>

          {resumen.global.temas_obligatorios.length > 0 && (
            <div>
              <h3 className="font-medium">Temas obligatorios</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {resumen.global.temas_obligatorios.map((tema, i) => (
                  <li key={i}>{tema}</li>
                ))}
              </ul>
            </div>
          )}

          {resumen.global.temas_optativos.length > 0 && (
            <div>
              <h3 className="font-medium">Temas optativos</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {resumen.global.temas_optativos.map((tema, i) => (
                  <li key={i}>{tema}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <a
              href={`/panel/api/informes/${evaluacion.id}`}
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Descargar informe (.docx)
            </a>
            {evaluacion.estado === "completado" && (
              <form action={marcarRevisadoAction.bind(null, evaluacion.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-black/15 px-4 py-2 text-sm font-semibold"
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
