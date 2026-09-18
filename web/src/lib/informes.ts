import "server-only";

export interface ResumenCriterio {
  numero: number;
  nombre: string;
  puntaje: number;
  puntaje_maximo: number;
  porcentaje: number;
  bucket: string;
  narrativa: string;
}

export interface ResumenGlobal {
  puntaje: number;
  puntaje_maximo: number;
  porcentaje: number;
  bucket: string;
  cierre: string;
  temas_obligatorios: string[];
  temas_optativos: string[];
}

export interface ResumenInforme {
  evaluacion_id: string;
  empresa_nombre: string;
  criterios: ResumenCriterio[];
  global: ResumenGlobal;
}

function urlServicioPython(): string {
  const baseUrl = process.env.PYTHON_SERVICE_URL;
  if (!baseUrl) throw new Error("Falta configurar PYTHON_SERVICE_URL");
  return baseUrl;
}

export async function obtenerResumenInforme(evaluacionId: string): Promise<ResumenInforme | null> {
  const res = await fetch(`${urlServicioPython()}/informes/${evaluacionId}/resumen`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener el resumen del informe (status ${res.status})`);
  return res.json();
}

export async function descargarInformeDocx(
  evaluacionId: string,
  { revision = true }: { revision?: boolean } = {}
): Promise<Response> {
  return fetch(`${urlServicioPython()}/informes/${evaluacionId}?revision=${revision}`, {
    cache: "no-store",
  });
}

/** Igual que `obtenerResumenInforme`, pero nunca lanza — si el servicio de
 * informes no responde, se ve como "sin resultados" en vez de romper toda
 * la vista (útil en el listado del panel, donde se piden varios resúmenes
 * a la vez y uno solo no debería tumbar la página completa). */
export async function obtenerResumenInformeSeguro(
  evaluacionId: string
): Promise<ResumenInforme | null> {
  try {
    return await obtenerResumenInforme(evaluacionId);
  } catch {
    return null;
  }
}
