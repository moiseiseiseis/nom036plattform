"""Ensamblado de texto narrativo a partir de plantillas y hallazgos."""

from .models import Hallazgo


def ensamblar_narrativa_criterio(plantilla_apertura: str, hallazgos: list[Hallazgo]) -> str:
    """Plantilla de apertura del criterio seguida de las recomendaciones de
    sus ítems con nivel bajo. Si no hay hallazgos, la narrativa es solo la
    apertura."""
    if not hallazgos:
        return plantilla_apertura
    cuerpo = " ".join(h.texto_recomendacion for h in hallazgos)
    return f"{plantilla_apertura} {cuerpo}"
