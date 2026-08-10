"use server";

import { revalidatePath } from "next/cache";
import { marcarRevisado } from "@/lib/nom036/panel";

export async function marcarRevisadoAction(evaluacionId: string): Promise<void> {
  const resultado = await marcarRevisado(evaluacionId);
  if (resultado.ok) {
    revalidatePath(`/panel/evaluaciones/${evaluacionId}`);
    revalidatePath("/panel");
  }
}
