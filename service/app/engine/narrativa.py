"""Ensamblado de texto narrativo a partir de plantillas y hallazgos."""

from .models import RespuestaItem, ResultadoCriterio, SegmentoNarrativa
from .scoring import ETIQUETA_POR_BUCKET

DescripcionesPorItemNivel = dict[tuple[str, int], str]

# Cuántas observaciones de cada tipo caben en el párrafo de un criterio. El
# informe JASANA de referencia menciona 1-3 elementos concretos por criterio;
# listar los 10 ítems convertiría el párrafo en un inventario.
MAX_FORTALEZAS = 2
MAX_CARENCIAS = 3
MAX_REFUERZOS = 2
NIVEL_FORTALEZA = 3
NIVEL_REFUERZO = 2


def como_continuacion(texto: str) -> str:
    """"No se registra…" → "no se registra…", para ir después de un conector.
    Respeta siglas al inicio (p. ej. "NOM-036…")."""
    if len(texto) > 1 and texto[0].isupper() and texto[1].islower():
        return texto[0].lower() + texto[1:]
    return texto


def _observaciones(
    descripciones: DescripcionesPorItemNivel,
    conector_inicial: str,
    seleccion: list[RespuestaItem],
) -> list[SegmentoNarrativa]:
    """Descripciones del nivel respondido en los ítems seleccionados, en orden
    de ítem, encadenadas con un conector inicial y "Asimismo,", "Además," después."""
    segmentos: list[SegmentoNarrativa] = []
    conectores = [conector_inicial, "Asimismo,", "Además,"]
    for r in sorted(seleccion, key=lambda r: r.numero):
        descripcion = descripciones.get((r.item_id, r.nivel))
        if not descripcion:
            continue
        conector = conectores[min(len(segmentos), len(conectores) - 1)]
        segmentos.append(SegmentoNarrativa(f"{conector} {como_continuacion(descripcion)}", "observacion"))
    return segmentos


def ensamblar_narrativa_criterio(
    plantilla_apertura: str,
    respuestas: list[RespuestaItem],
    descripciones: DescripcionesPorItemNivel,
    plantilla_implicacion: str = "",
    umbral_hallazgo: int = 1,
) -> list[SegmentoNarrativa]:
    """Párrafo de un criterio, al estilo del informe JASANA de referencia —
    diagnóstico, no lista de recomendaciones (esas van en "Áreas de
    oportunidad"):

    1. Apertura según la franja de cumplimiento.
    2. Lo favorable: descripciones de los ítems mejor calificados (nivel 3-4).
    3. Lo que falta: descripciones de los ítems con nivel de hallazgo (<= umbral),
       priorizando los más bajos, y el total si hay más de los que caben.
       Si no hay ninguno, los ítems de nivel 2 como "puntos por reforzar" — así
       las franjas altas también citan elementos concretos
       (`retroalimentacion/reporte.txt`, hallazgo 2) sin cambiar qué cuenta
       como hallazgo para las listas de temas.
    4. Implicación: por qué importa el nivel alcanzado en este criterio.

    Determinista: mismo conjunto de respuestas, mismo párrafo."""
    segmentos = [SegmentoNarrativa(plantilla_apertura, "plantilla")] if plantilla_apertura else []

    fortalezas = sorted(
        (r for r in respuestas if r.nivel >= NIVEL_FORTALEZA), key=lambda r: (-r.nivel, r.numero)
    )[:MAX_FORTALEZAS]
    segmentos += _observaciones(descripciones, "Entre los aspectos favorables,", fortalezas)
    hay_fortalezas = len(segmentos) > (1 if plantilla_apertura else 0)

    bajos = sorted((r for r in respuestas if r.nivel <= umbral_hallazgo), key=lambda r: (r.nivel, r.numero))
    if bajos:
        conector = "Por otro lado," if hay_fortalezas else "En particular,"
        segmentos += _observaciones(descripciones, conector, bajos[:MAX_CARENCIAS])
        if len(bajos) > MAX_CARENCIAS:
            segmentos.append(
                SegmentoNarrativa(
                    f"En total, {len(bajos)} de los {len(respuestas)} aspectos evaluados en este "
                    "criterio se encuentran en nivel Nada o Mínimo; las acciones correspondientes "
                    "se detallan en las Áreas de oportunidad.",
                    "plantilla",
                )
            )
    else:
        refuerzos = [r for r in respuestas if r.nivel == NIVEL_REFUERZO][:MAX_REFUERZOS]
        segmentos += _observaciones(descripciones, "Como puntos por reforzar,", refuerzos)

    if plantilla_implicacion:
        segmentos.append(SegmentoNarrativa(plantilla_implicacion, "plantilla"))
    return segmentos


def texto_narrativa(segmentos: list[SegmentoNarrativa]) -> str:
    return " ".join(s.texto for s in segmentos)


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
