"""Orquestación del motor de cálculo y recomendaciones para un criterio y
para el cierre global de una evaluación."""

from .models import RespuestaItem, ResultadoCriterio, ResultadoGlobal
from .narrativa import (
    DescripcionesPorItemNivel,
    construir_cierre_parcial,
    ensamblar_narrativa_criterio,
    texto_narrativa,
)
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
    descripciones: DescripcionesPorItemNivel | None = None,
    plantilla_implicacion: str = "",
) -> ResultadoCriterio:
    puntaje, puntaje_maximo = calcular_puntaje([r.nivel for r in respuestas])
    porcentaje = calcular_porcentaje(puntaje, puntaje_maximo)
    bucket = clasificar_bucket(porcentaje)
    hallazgos = identificar_hallazgos(respuestas, recomendaciones, umbral_hallazgo)
    segmentos = ensamblar_narrativa_criterio(
        plantilla_apertura,
        respuestas,
        descripciones or {},
        plantilla_implicacion,
        umbral_hallazgo,
    )
    return ResultadoCriterio(
        criterio_id=criterio_id,
        numero=numero,
        nombre=nombre,
        puntaje=puntaje,
        puntaje_maximo=puntaje_maximo,
        porcentaje=porcentaje,
        bucket=bucket,
        narrativa=texto_narrativa(segmentos),
        plantilla_apertura=plantilla_apertura,
        hallazgos=hallazgos,
        segmentos=segmentos,
    )


def evaluar_global(
    resultados_criterios: list[ResultadoCriterio], plantilla_cierre: str, total_criterios: int
) -> ResultadoGlobal:
    """`total_criterios` es cuántos criterios integra el instrumento en total
    (catálogo completo), no cuántos trae `resultados_criterios` (los ya
    respondidos) — con menos de `total_criterios` respondidos, el cierre se
    reemplaza por un texto de alcance acotado en vez de usar `plantilla_cierre`
    (ver `construir_cierre_parcial`, retroalimentación de la validación
    piloto: no generalizar "el cumplimiento de la empresa" a partir de un
    subconjunto de criterios)."""
    puntaje, puntaje_maximo, porcentaje, bucket = calcular_global(
        [(r.puntaje, r.puntaje_maximo) for r in resultados_criterios]
    )
    obligatorios, optativos = construir_temas([r.hallazgos for r in resultados_criterios])
    es_parcial = len(resultados_criterios) < total_criterios
    cierre = (
        construir_cierre_parcial(resultados_criterios, total_criterios, bucket, porcentaje)
        if es_parcial
        else plantilla_cierre
    )
    return ResultadoGlobal(
        puntaje=puntaje,
        puntaje_maximo=puntaje_maximo,
        porcentaje=porcentaje,
        bucket=bucket,
        es_parcial=es_parcial,
        cierre=cierre,
        temas_obligatorios=obligatorios,
        temas_optativos=optativos,
    )
