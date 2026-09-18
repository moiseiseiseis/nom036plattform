"use client";

import { useTransition } from "react";

export function EliminarEvaluacionBoton({ eliminar }: { eliminar: () => Promise<void> }) {
  const [pendiente, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => {
        if (!confirm("¿Eliminar esta evaluación? Esta acción no se puede deshacer.")) return;
        startTransition(() => {
          eliminar();
        });
      }}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {pendiente ? "Eliminando…" : "Eliminar evaluación"}
    </button>
  );
}
