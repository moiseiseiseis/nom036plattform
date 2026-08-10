"use client";

import { useActionState } from "react";
import Link from "next/link";
import { crearEvaluacionAction, type CrearEvaluacionState } from "./actions";

const ESTADO_INICIAL: CrearEvaluacionState = { error: null, token: null };

export default function NuevaEvaluacionPage() {
  const [state, formAction, pending] = useActionState(crearEvaluacionAction, ESTADO_INICIAL);

  const enlace =
    state.token && typeof window !== "undefined"
      ? `${window.location.origin}/evaluar/${state.token}`
      : null;

  if (enlace) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Evaluación creada</h1>
        <p className="text-gray-600">
          Comparte este enlace único con la empresa para que responda la autoevaluación:
        </p>
        <input
          readOnly
          value={enlace}
          onFocus={(e) => e.currentTarget.select()}
          className="rounded-md border border-black/15 px-3 py-2 font-mono text-sm"
        />
        <div className="flex gap-4">
          <Link href="/panel" className="text-sm underline">
            Volver al listado
          </Link>
          <Link href="/panel/nueva" className="text-sm underline">
            Crear otra evaluación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Nueva evaluación</h1>
      <form action={formAction} className="flex max-w-md flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nombre de la empresa</span>
          <input
            name="nombre_empresa"
            required
            className="rounded-md border border-black/15 px-3 py-2"
            placeholder="Ej. Textiles del Bajío S.A. de C.V."
          />
        </label>
        <p className="text-xs text-gray-500">
          El resto de los datos generales los llena la empresa al responder el cuestionario.
        </p>
        {state.error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Creando…" : "Generar enlace"}
        </button>
      </form>
    </div>
  );
}
