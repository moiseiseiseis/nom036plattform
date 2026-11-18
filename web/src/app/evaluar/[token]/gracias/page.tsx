import { redirect } from "next/navigation";
import { getEvaluacionPorToken } from "@/lib/nom036/evaluaciones";
import { BotonDescarga } from "@/components/BotonDescarga";
import { Confeti } from "../Confeti";
import { LimpiarBorrador } from "../LimpiarBorrador";

export default async function GraciasPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const evaluacion = await getEvaluacionPorToken(token);

  if (!evaluacion) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-semibold">Enlace no válido</h1>
      </main>
    );
  }

  if (evaluacion.estado === "pendiente") {
    redirect(`/evaluar/${token}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <LimpiarBorrador token={token} />
      <Confeti />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-green-700"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold">¡Gracias por completar la autoevaluación!</h1>
      <p className="text-gray-600">
        Las respuestas de <strong>{evaluacion.empresa.nombre}</strong> quedaron registradas
        correctamente. El equipo del Dr. Sergio Valenzuela revisará la información y se
        pondrá en contacto para la entrega del informe de prediagnóstico.
      </p>
      <div className="mt-2 flex w-full flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5">
        <p className="font-semibold">Informe preliminar</p>
        <p className="text-sm text-gray-600">
          Generado automáticamente con las respuestas, antes de la revisión del equipo. El
          informe oficial es el que se comparte una vez revisado.
        </p>
        <BotonDescarga
          href={`/evaluar/${token}/informe`}
          nombreRespaldo="Informe-prediagnostico-empresarial-PRELIMINAR.docx"
          className="mt-1 min-h-12 rounded-xl bg-blue-700 px-6 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Descargar informe preliminar
        </BotonDescarga>
        <p className="text-xs text-gray-500">
          Puede tardar hasta un minuto en generarse.
        </p>
      </div>
    </main>
  );
}
