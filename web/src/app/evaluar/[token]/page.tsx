import { getEvaluacionPorToken } from "@/lib/nom036/evaluaciones";
import { EvaluacionForm } from "./EvaluacionForm";

export default async function EvaluarPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const evaluacion = await getEvaluacionPorToken(token);

  if (!evaluacion) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Enlace no válido</h1>
          <p className="mt-2 text-gray-600">
            Este enlace de autoevaluación no existe o ya no está disponible. Verifica que lo
            copiaste completo, o solicita uno nuevo al equipo que te lo compartió.
          </p>
        </div>
      </main>
    );
  }

  if (evaluacion.estado !== "pendiente") {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Esta evaluación ya fue enviada</h1>
          <p className="mt-2 text-gray-600">
            <strong>{evaluacion.empresa.nombre}</strong> ya completó este cuestionario. Si crees
            que esto es un error, contacta al equipo que generó el enlace.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-6">
      <EvaluacionForm token={token} empresa={evaluacion.empresa} criterios={evaluacion.criterios} />
    </main>
  );
}
