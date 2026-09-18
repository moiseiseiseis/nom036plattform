"""Ensamblado de texto narrativo a partir de plantillas y hallazgos."""

from .models import Hallazgo, ResultadoCriterio
from .scoring import ETIQUETA_POR_BUCKET


def ensamblar_narrativa_criterio(plantilla_apertura: str, hallazgos: list[Hallazgo]) -> str:
    """Plantilla de apertura del criterio seguida de las recomendaciones de
    sus ítems con nivel bajo. Si no hay hallazgos, la narrativa es solo la
    apertura."""
    if not hallazgos:
        return plantilla_apertura
    cuerpo = " ".join(h.texto_recomendacion for h in hallazgos)
    return f"{plantilla_apertura} {cuerpo}"


def construir_cierre_parcial(
    resultados: list[ResultadoCriterio],
    total_criterios: int,
    bucket_global: str,
    porcentaje_global: float,
) -> str:
    """Cierre de "Áreas de oportunidad" para una evaluación con menos
    criterios respondidos que los que integra el instrumento — evita la
    sobregeneralización de aplicar una conclusión "en general, la empresa..."
    a partir de datos parciales (retroalimentación de la validación piloto,
    `retroalimentacion/reporte.txt`, hallazgo 1).

    Sustituye por completo la plantilla fija de `plantilla_bucket` para el
    cierre global mientras la evaluación sea parcial; el texto "informe
    completo" por bucket solo se usa cuando ya están los `total_criterios`
    respondidos (ver `evaluar_global`)."""
    n_evaluados = len(resultados)
    faltantes = total_criterios - n_evaluados
    clasificacion = ETIQUETA_POR_BUCKET.get(bucket_global, bucket_global)

    if n_evaluados == 1:
        r = resultados[0]
        alcance = (
            f"únicamente para el Criterio {r.numero} ({r.nombre}), de los "
            f"{total_criterios} que integran el instrumento"
        )
        este_estos = "este criterio"
    else:
        lista = ", ".join(f"Criterio {r.numero} ({r.nombre})" for r in resultados)
        alcance = (
            f"únicamente para {n_evaluados} de los {total_criterios} criterios que "
            f"integran el instrumento ({lista})"
        )
        este_estos = "estos criterios"

    falta_faltan = "falta" if faltantes == 1 else "faltan"
    criterio_criterios = "criterio" if faltantes == 1 else "criterios"

    return (
        f"Este informe presenta resultados {alcance}. Con base en {este_estos}, el nivel de "
        f"cumplimiento alcanzado es {clasificacion} ({porcentaje_global:.1f}%). Dado que aún "
        f"{falta_faltan} {faltantes} {criterio_criterios} por evaluar, no es posible emitir una "
        f"conclusión general sobre el cumplimiento de la empresa con la NOM-036-1-STPS-2018. "
        f"Conviene completar la autoevaluación en los criterios restantes antes de definir un "
        f"plan de acción integral."
    )
