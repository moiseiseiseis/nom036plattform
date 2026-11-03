import { Spinner } from "./Spinner";

/** Indicador para lo que depende del servicio de informes, que en el plan
 * gratuito de Render se duerme sin tráfico y tarda 30-50 s en volver. `compacto`
 * es para una celda de tabla; sin él, una tarjeta con el aviso explicado.
 *
 * El aviso aparece con CSS (`.texto-inicial`, `.aviso-tardio`), no con un
 * temporizador de React: en una carga directa, el fallback de un Suspense
 * pendiente no se hidrata, así que un useEffect aquí nunca correría. */
export function CargaServicio({ texto, compacto = false }: { texto: string; compacto?: boolean }) {
  if (compacto) {
    return (
      <span role="status" className="inline-flex items-center gap-2 text-gray-500">
        <Spinner className="h-3.5 w-3.5 text-blue-700" />
        <span className="inline-grid">
          <span className="texto-inicial col-start-1 row-start-1">{texto}</span>
          <span className="aviso-tardio col-start-1 row-start-1">Despertando servicio…</span>
        </span>
      </span>
    );
  }

  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white p-10 text-center shadow-sm"
    >
      <Spinner className="h-8 w-8 text-blue-700" />
      <p className="font-medium">{texto}</p>
      <p className="aviso-tardio max-w-md text-sm text-gray-500">
        El servicio de informes estaba en pausa y está despertando. Puede tardar hasta un minuto la
        primera vez.
      </p>
    </div>
  );
}
