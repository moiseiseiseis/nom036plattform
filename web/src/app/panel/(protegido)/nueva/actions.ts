"use server";

import { crearEvaluacion } from "@/lib/nom036/panel";

export interface CrearEvaluacionState {
  error: string | null;
  token: string | null;
}

export async function crearEvaluacionAction(
  _prevState: CrearEvaluacionState,
  formData: FormData
): Promise<CrearEvaluacionState> {
  const nombreEmpresa = String(formData.get("nombre_empresa") ?? "").trim();

  if (!nombreEmpresa) {
    return { error: "Ingresa el nombre de la empresa.", token: null };
  }

  const { token } = await crearEvaluacion(nombreEmpresa);
  return { error: null, token };
}
