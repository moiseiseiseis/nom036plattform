"""Selección de recomendaciones e identificación de hallazgos.

Un "hallazgo" es un ítem cuyo nivel de respuesta está en o por debajo de un
umbral (hipótesis de trabajo: nivel <= 1, CLAUDE.md sección 4) y que por lo
tanto alimenta la narrativa de criterio y las listas de temas obligatorios y
optativos a nivel global.
"""

from .models import Hallazgo, RespuestaItem

UMBRAL_HALLAZGO_DEFAULT = 1

RecomendacionesPorItemNivel = dict[tuple[str, int], str]


def seleccionar_recomendacion(
    recomendaciones: RecomendacionesPorItemNivel, item_id: str, nivel: int
) -> str:
    clave = (item_id, nivel)
    if clave not in recomendaciones:
        raise KeyError(f"No hay recomendación para item_id={item_id} nivel={nivel}")
    return recomendaciones[clave]


def identificar_hallazgos(
    respuestas: list[RespuestaItem],
    recomendaciones: RecomendacionesPorItemNivel,
    umbral: int = UMBRAL_HALLAZGO_DEFAULT,
) -> list[Hallazgo]:
    hallazgos = [
        Hallazgo(
            item_id=r.item_id,
            numero=r.numero,
            nivel=r.nivel,
            es_obligatorio=r.es_obligatorio,
            texto_recomendacion=seleccionar_recomendacion(recomendaciones, r.item_id, r.nivel),
        )
        for r in sorted(respuestas, key=lambda r: r.numero)
        if r.nivel <= umbral
    ]
    return hallazgos


def construir_temas(hallazgos_por_criterio: list[list[Hallazgo]]) -> tuple[list[str], list[str]]:
    """Listas de temas obligatorios y optativos a partir de los hallazgos de
    todos los criterios, sin duplicados y preservando el orden de aparición."""
    obligatorios: list[str] = []
    optativos: list[str] = []
    for hallazgos in hallazgos_por_criterio:
        for h in hallazgos:
            destino = obligatorios if h.es_obligatorio else optativos
            if h.texto_recomendacion not in destino:
                destino.append(h.texto_recomendacion)
    return obligatorios, optativos
