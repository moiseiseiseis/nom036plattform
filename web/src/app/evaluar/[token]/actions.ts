"use server";

import { redirect } from "next/navigation";
import { guardarEvaluacion } from "@/lib/nom036/evaluaciones";

export interface EnviarEvaluacionState {
  error: string | null;
}

export async function enviarEvaluacion(
  token: string,
  itemIds: string[],
  _prevState: EnviarEvaluacionState,
  formData: FormData
): Promise<EnviarEvaluacionState> {
  const ubicacion = String(formData.get("ubicacion") ?? "").trim();
  const giro = String(formData.get("giro") ?? "").trim();
  const numTrabajadoresRaw = String(formData.get("num_trabajadores") ?? "").trim();
  const turnos = String(formData.get("turnos") ?? "").trim();
  const descripcionMmh = String(formData.get("descripcion_mmh") ?? "").trim();
  const numTrabajadores = Number(numTrabajadoresRaw);

  if (
    !ubicacion ||
    !giro ||
    !turnos ||
    !descripcionMmh ||
    !Number.isInteger(numTrabajadores) ||
    numTrabajadores <= 0
  ) {
    return { error: "Completa todos los campos de datos generales con valores válidos." };
  }

  const respuestas: { item_id: string; nivel: number }[] = [];
  for (const itemId of itemIds) {
    const nivelRaw = formData.get(`nivel_${itemId}`);
    const nivel = nivelRaw === null ? NaN : Number(nivelRaw);
    if (!Number.isInteger(nivel) || nivel < 0 || nivel > 4) {
      return { error: "Responde los 10 ítems del cuestionario antes de enviar." };
    }
    respuestas.push({ item_id: itemId, nivel });
  }

  const resultado = await guardarEvaluacion(
    token,
    { ubicacion, giro, num_trabajadores: numTrabajadores, turnos, descripcion_mmh: descripcionMmh },
    respuestas
  );

  if (!resultado.ok) {
    return { error: resultado.error };
  }

  redirect(`/evaluar/${token}/gracias`);
}
