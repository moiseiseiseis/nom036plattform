from dataclasses import dataclass

from app.engine.models import RespuestaItem
from app.engine.recomendaciones import RecomendacionesPorItemNivel


@dataclass(frozen=True)
class DatosCriterio:
    id: str
    numero: int
    nombre: str
    respuestas: list[RespuestaItem]
    recomendaciones: RecomendacionesPorItemNivel
    plantillas_apertura: dict[str, str]  # bucket -> texto


@dataclass(frozen=True)
class DatosEvaluacion:
    evaluacion_id: str
    token_publico: str
    estado: str
    empresa_nombre: str
    empresa_ubicacion: str | None
    empresa_giro: str | None
    empresa_num_trabajadores: int | None
    empresa_turnos: str | None
    empresa_descripcion_mmh: str | None
    criterios: list[DatosCriterio]
    total_criterios: int  # cuántos integra el instrumento en total, no solo los respondidos
    plantillas_apertura_global: dict[str, str]  # bucket -> texto
    plantillas_cierre_global: dict[str, str]  # bucket -> texto
