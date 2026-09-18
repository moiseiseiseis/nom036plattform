"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eliminarEvaluacion, marcarRevisado } from "@/lib/nom036/panel";

export async function marcarRevisadoAction(evaluacionId: string): Promise<void> {
  const resultado = await marcarRevisado(evaluacionId);
  if (resultado.ok) {
    revalidatePath(`/panel/evaluaciones/${evaluacionId}`);
    revalidatePath("/panel");
  }
}

export async function eliminarEvaluacionAction(evaluacionId: string): Promise<void> {
  const resultado = await eliminarEvaluacion(evaluacionId);
  if (!resultado.ok) {
    throw new Error(resultado.error);
  }
  revalidatePath("/panel");
  redirect("/panel");
}
