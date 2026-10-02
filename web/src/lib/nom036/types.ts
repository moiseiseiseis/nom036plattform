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

export interface Item {
  id: string;
  numero: number;
  texto_pregunta: string;
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
