"use client";

import { useActionState } from "react";
import Link from "next/link";
import { crearEvaluacionAction, type CrearEvaluacionState } from "./actions";

const ESTADO_INICIAL: CrearEvaluacionState = { error: null, token: null };

const CAMPO =
  "rounded-lg border border-black/15 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";

export default function NuevaEvaluacionPage() {
  const [state, formAction, pending] = useActionState(crearEvaluacionAction, ESTADO_INICIAL);

  const enlace =
    state.token && typeof window !== "undefined"
      ? `${window.location.origin}/evaluar/${state.token}`
      : null;

  if (enlace) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Evaluación creada</h1>
        <p className="text-gray-600">
          Comparte este enlace único con la empresa para que responda la autoevaluación:
        </p>
        <input
          readOnly
          value={enlace}
          onFocus={(e) => e.currentTarget.select()}
          className={`${CAMPO} font-mono text-sm`}
        />
        <div className="flex gap-4">
          <Link href="/panel" className="text-sm font-medium text-blue-700 hover:underline">
            Volver al listado
          </Link>
          <Link
            href="/panel/nueva"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Crear otra evaluación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Nueva evaluación</h1>
      <form
        action={formAction}
        className="flex max-w-md flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nombre de la empresa</span>
          <input
            name="nombre_empresa"
            required
            className={CAMPO}
            placeholder="Ej. Textiles del Bajío S.A. de C.V."
          />
        </label>
        <p className="text-xs text-gray-500">
          El resto de los datos generales los llena la empresa al responder el cuestionario.
        </p>
        {state.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-black px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? "Creando…" : "Generar enlace"}
        </button>
      </form>
    </div>
  );
}
