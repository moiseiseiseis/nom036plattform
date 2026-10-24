"use server";

import { redirect } from "next/navigation";
import { guardarEvaluacion } from "@/lib/nom036/evaluaciones";

export interface DatosGeneralesForm {
  calle: string;
  colonia: string;
  codigo_postal: string;
  municipio: string;
  estado: string;
  giro: string;
  num_trabajadores: string;
  turnos: string;
  descripcion_mmh: string;
}

export interface EnviarEvaluacionPayload {
  datos: DatosGeneralesForm;
  // item_id -> nivel 0-4
  respuestas: Record<string, number>;
}

export interface EnviarEvaluacionResultado {
  error: string;
}

const CAMPOS_DATOS: (keyof DatosGeneralesForm)[] = [
  "calle",
  "colonia",
  "codigo_postal",
  "municipio",
  "estado",
  "giro",
  "num_trabajadores",
  "turnos",
  "descripcion_mmh",
];

// El numeral 7.4 a) 2) de la NOM-036 pide el domicilio completo del centro de
// trabajo. Se captura estructurado en el formulario y se guarda compuesto en
// `empresa.ubicacion`, que es lo que ya leen el informe y el panel.
function componerDomicilio(d: DatosGeneralesForm): string {
  return `${d.calle}, Col. ${d.colonia}, C.P. ${d.codigo_postal}, ${d.municipio}, ${d.estado}`;
}

export async function enviarEvaluacion(
  token: string,
  itemIds: string[],
  payload: EnviarEvaluacionPayload
): Promise<EnviarEvaluacionResultado> {
  const datos = {} as DatosGeneralesForm;
  for (const campo of CAMPOS_DATOS) {
    datos[campo] = String(payload?.datos?.[campo] ?? "").trim();
  }

  const numTrabajadores = Number(datos.num_trabajadores);
  if (
    CAMPOS_DATOS.some((campo) => !datos[campo]) ||
    !/^\d{5}$/.test(datos.codigo_postal) ||
    !Number.isInteger(numTrabajadores) ||
    numTrabajadores <= 0
  ) {
    return { error: "Completa todos los datos generales con valores válidos." };
  }

  const respuestas: { item_id: string; nivel: number }[] = [];
  for (const itemId of itemIds) {
    const nivel = payload?.respuestas?.[itemId];
    if (!Number.isInteger(nivel) || nivel < 0 || nivel > 4) {
      return { error: "Responde todas las preguntas antes de enviar." };
    }
    respuestas.push({ item_id: itemId, nivel });
  }

  const resultado = await guardarEvaluacion(
    token,
    {
      ubicacion: componerDomicilio(datos),
      giro: datos.giro,
      num_trabajadores: numTrabajadores,
      turnos: datos.turnos,
      descripcion_mmh: datos.descripcion_mmh,
    },
    respuestas
  );

  if (!resultado.ok) {
    return { error: resultado.error };
  }

  redirect(`/evaluar/${token}/gracias`);
}
