"use client";

import { useActionState } from "react";
import type { Empresa, Item } from "@/lib/nom036/types";
import { enviarEvaluacion, type EnviarEvaluacionState } from "./actions";

const NIVELES = [
  { valor: 0, etiqueta: "Nada", color: "bg-red-500 peer-checked:ring-red-500" },
  { valor: 1, etiqueta: "Mínimo", color: "bg-orange-400 peer-checked:ring-orange-400" },
  { valor: 2, etiqueta: "Regular", color: "bg-yellow-400 peer-checked:ring-yellow-400" },
  { valor: 3, etiqueta: "Aceptable", color: "bg-green-500 peer-checked:ring-green-500" },
  { valor: 4, etiqueta: "Óptimo", color: "bg-sky-500 peer-checked:ring-sky-500" },
] as const;

const ESTADO_INICIAL: EnviarEvaluacionState = { error: null };

export function EvaluacionForm({
  token,
  empresa,
  items,
}: {
  token: string;
  empresa: Empresa;
  items: Item[];
}) {
  const accion = enviarEvaluacion.bind(null, token, items.map((item) => item.id));
  const [state, formAction, pending] = useActionState(accion, ESTADO_INICIAL);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <fieldset className="flex flex-col gap-4 rounded-lg border border-black/10 p-4 sm:p-6">
        <legend className="px-1 text-lg font-semibold">Datos generales de la empresa</legend>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Empresa</span>
          <span className="font-medium">{empresa.nombre}</span>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Ubicación</span>
          <input
            name="ubicacion"
            required
            defaultValue={empresa.ubicacion ?? ""}
            className="rounded-md border border-black/15 px-3 py-2"
            placeholder="Ciudad, estado"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Giro</span>
          <input
            name="giro"
            required
            defaultValue={empresa.giro ?? ""}
            className="rounded-md border border-black/15 px-3 py-2"
            placeholder="Ej. Textil y confección"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Número de trabajadores</span>
          <input
            name="num_trabajadores"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={empresa.num_trabajadores ?? ""}
            className="rounded-md border border-black/15 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Turnos</span>
          <input
            name="turnos"
            required
            defaultValue={empresa.turnos ?? ""}
            className="rounded-md border border-black/15 px-3 py-2"
            placeholder="Ej. Un turno, dos turnos rotativos..."
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Actividades de manejo manual de cargas (MMC)
          </span>
          <textarea
            name="descripcion_mmh"
            required
            rows={3}
            defaultValue={empresa.descripcion_mmh ?? ""}
            className="rounded-md border border-black/15 px-3 py-2"
            placeholder="Describe brevemente qué se levanta, transporta o manipula manualmente"
          />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-6 rounded-lg border border-black/10 p-4 sm:p-6">
        <legend className="px-1 text-lg font-semibold">
          Criterio 1 — Identificación y clasificación de los puestos de trabajo
          ocupacionalmente expuestos
        </legend>

        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3">
            <p className="font-medium">
              {item.numero}. {item.texto_pregunta}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {NIVELES.map((nivel) => (
                <label key={nivel.valor} className="relative flex flex-col items-center gap-1">
                  <input
                    type="radio"
                    name={`nivel_${item.id}`}
                    value={nivel.valor}
                    required
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-10 w-full items-center justify-center rounded-md text-sm font-semibold text-white ring-offset-2 peer-checked:ring-2 peer-focus-visible:ring-2 ${nivel.color}`}
                  >
                    {nivel.valor}
                  </span>
                  <span className="text-center text-xs text-gray-500">{nivel.etiqueta}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      {state.error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Enviando…" : "Enviar autoevaluación"}
      </button>
    </form>
  );
}
