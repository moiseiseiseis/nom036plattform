"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";

const TIPO_DOCX = "wordprocessingml";

/** Descarga con indicador de progreso: un enlace normal no da ninguna señal
 * mientras se genera el informe, que tarda más si el servicio estaba dormido. */
export function BotonDescarga({
  href,
  nombreRespaldo,
  className,
  children,
}: {
  href: string;
  nombreRespaldo: string;
  className: string;
  children: React.ReactNode;
}) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  async function descargar() {
    setCargando(true);
    setError(false);
    try {
      const respuesta = await fetch(href);
      // Con la sesión vencida, el proxy redirige al login y llega HTML con status 200.
      if (!respuesta.ok || !respuesta.headers.get("content-type")?.includes(TIPO_DOCX)) {
        setError(true);
        return;
      }
      const nombre =
        respuesta.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/)?.[1] ??
        nombreRespaldo;
      const url = URL.createObjectURL(await respuesta.blob());
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = nombre;
      enlace.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={descargar}
        disabled={cargando}
        className={`inline-flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70 ${className}`}
      >
        {cargando && <Spinner />}
        {cargando ? "Generando informe…" : children}
      </button>
      {error && (
        <span role="alert" className="text-xs text-red-700">
          No se pudo generar. Intenta de nuevo.
        </span>
      )}
    </span>
  );
}
