import { redirect } from "next/navigation";
import { getEvaluacionPorToken } from "@/lib/nom036/evaluaciones";

export default async function GraciasPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const evaluacion = await getEvaluacionPorToken(token);

  if (!evaluacion) {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Enlace no válido</h1>
      </main>
    );
  }

  if (evaluacion.estado === "pendiente") {
    redirect(`/evaluar/${token}`);
  }

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">¡Gracias por completar la autoevaluación!</h1>
      <p className="text-gray-600">
        Las respuestas de <strong>{evaluacion.empresa.nombre}</strong> quedaron registradas
        correctamente. El equipo del Dr. Sergio Valenzuela revisará la información y se
        pondrá en contacto para la entrega del informe de prediagnóstico.
      </p>
    </main>
  );
}
