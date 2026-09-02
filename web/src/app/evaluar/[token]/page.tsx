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
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
          Autoevaluación
        </p>
        <h1 className="text-2xl font-semibold">NOM-036-1-STPS-2018</h1>
        <p className="text-gray-600">
          Responde con la información real de tu empresa. Para cada afirmación, elige el
          nivel que mejor describe la situación actual, del 0 (Nada) al 4 (Óptimo).
        </p>
      </header>
      <EvaluacionForm token={token} empresa={evaluacion.empresa} items={evaluacion.items_criterio1} />
    </main>
  );
}
