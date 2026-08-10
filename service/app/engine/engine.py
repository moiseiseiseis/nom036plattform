"""Orquestación del motor de cálculo y recomendaciones para un criterio y
para el cierre global de una evaluación."""

from .models import RespuestaItem, ResultadoCriterio, ResultadoGlobal
from .narrativa import ensamblar_narrativa_criterio
from .recomendaciones import (
    RecomendacionesPorItemNivel,
    UMBRAL_HALLAZGO_DEFAULT,
    construir_temas,
    identificar_hallazgos,
)
from .scoring import calcular_global, calcular_porcentaje, calcular_puntaje, clasificar_bucket


def evaluar_criterio(
    criterio_id: str,
    numero: int,
    nombre: str,
    respuestas: list[RespuestaItem],
    recomendaciones: RecomendacionesPorItemNivel,
    plantilla_apertura: str,
    umbral_hallazgo: int = UMBRAL_HALLAZGO_DEFAULT,
) -> ResultadoCriterio:
    puntaje, puntaje_maximo = calcular_puntaje([r.nivel for r in respuestas])
    porcentaje = calcular_porcentaje(puntaje, puntaje_maximo)
    bucket = clasificar_bucket(porcentaje)
    hallazgos = identificar_hallazgos(respuestas, recomendaciones, umbral_hallazgo)
    narrativa = ensamblar_narrativa_criterio(plantilla_apertura, hallazgos)
    return ResultadoCriterio(
        criterio_id=criterio_id,
        numero=numero,
        nombre=nombre,
        puntaje=puntaje,
        puntaje_maximo=puntaje_maximo,
        porcentaje=porcentaje,
        bucket=bucket,
        narrativa=narrativa,
        hallazgos=hallazgos,
    )


def evaluar_global(
    resultados_criterios: list[ResultadoCriterio], plantilla_cierre: str
) -> ResultadoGlobal:
    puntaje, puntaje_maximo, porcentaje, bucket = calcular_global(
        [(r.puntaje, r.puntaje_maximo) for r in resultados_criterios]
    )
    obligatorios, optativos = construir_temas([r.hallazgos for r in resultados_criterios])
    return ResultadoGlobal(
        puntaje=puntaje,
        puntaje_maximo=puntaje_maximo,
        porcentaje=porcentaje,
        bucket=bucket,
        cierre=plantilla_cierre,
        temas_obligatorios=obligatorios,
        temas_optativos=optativos,
    )
