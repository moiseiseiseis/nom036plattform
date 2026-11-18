export type EstadoEvaluacion = "pendiente" | "completado" | "revisado";

export interface Empresa {
  id: string;
  nombre: string;
  ubicacion: string | null;
  giro: string | null;
  num_trabajadores: number | null;
  turnos: string | null;
  descripcion_mmh: string | null;
}

export interface NivelItem {
  nivel: number;
  // Descripción del nivel que ve el autoevaluador — la recomendación del
  // informe vive en la misma fila de nom036.recomendacion pero no se expone
  // en el formulario público.
  descripcion: string | null;
}

export interface Item {
  id: string;
  numero: number;
  texto_pregunta: string;
  niveles: NivelItem[];
  // Ayuda del formulario (panel derecho / hoja en móvil). Nulos si el ítem
  // no tiene: entonces no se muestra ni el panel ni el botón.
  numeral_nom: string | null;
  ayuda_definicion: string | null;
  ayuda_preguntas_guia: string[] | null;
}

export interface CriterioConItems {
  numero: number;
  nombre: string;
  items: Item[];
}

export interface EvaluacionConDetalle {
  id: string;
  token_publico: string;
  estado: EstadoEvaluacion;
  empresa: Empresa;
  criterios: CriterioConItems[];
}

export interface DatosGeneralesInput {
  ubicacion: string;
  giro: string;
  num_trabajadores: number;
  turnos: string;
  descripcion_mmh: string;
}

export interface EvaluacionResumen {
  id: string;
  token_publico: string;
  estado: EstadoEvaluacion;
  fecha: string;
  empresa_nombre: string;
}
