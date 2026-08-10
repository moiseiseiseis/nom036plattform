"""Cálculo de puntajes y clasificación en buckets de cumplimiento.

La franja de 20 puntos por bucket es la hipótesis de trabajo registrada en
CLAUDE.md (sección 4), validada contra los 5 puntajes reales del caso JASANA.
El tratamiento exacto de los valores límite (ej. ¿20% es "minimo" o
"inexistente"?) sigue pendiente de confirmación por el Dr. Sergio.
"""

BUCKETS = ("inexistente", "minimo", "regular", "aceptable", "optimo")

NIVEL_MAXIMO = 4


def calcular_puntaje(niveles: list[int]) -> tuple[int, int]:
    """Suma de niveles y puntaje máximo posible para una lista de respuestas."""
    if not niveles:
        raise ValueError("niveles no puede estar vacío")
    return sum(niveles), len(niveles) * NIVEL_MAXIMO


def calcular_porcentaje(puntaje: int, puntaje_maximo: int) -> float:
    if puntaje_maximo <= 0:
        raise ValueError("puntaje_maximo debe ser mayor a 0")
    return (puntaje / puntaje_maximo) * 100


def clasificar_bucket(porcentaje: float) -> str:
    """Clasifica un porcentaje de cumplimiento en una franja de 20 puntos.

    Límite inferior cerrado, superior abierto, salvo el último tramo (100%
    inclusive): [0,20) inexistente, [20,40) minimo, [40,60) regular,
    [60,80) aceptable, [80,100] optimo.
    """
    if not 0 <= porcentaje <= 100:
        raise ValueError(f"porcentaje fuera de rango (0-100): {porcentaje}")
    if porcentaje < 20:
        return "inexistente"
    if porcentaje < 40:
        return "minimo"
    if porcentaje < 60:
        return "regular"
    if porcentaje < 80:
        return "aceptable"
    return "optimo"


def calcular_global(puntajes_criterios: list[tuple[int, int]]) -> tuple[int, int, float, str]:
    """Puntaje, puntaje máximo, porcentaje y bucket global a partir de los
    pares (puntaje, puntaje_maximo) de cada criterio evaluado."""
    if not puntajes_criterios:
        raise ValueError("puntajes_criterios no puede estar vacío")
    puntaje = sum(p for p, _ in puntajes_criterios)
    puntaje_maximo = sum(m for _, m in puntajes_criterios)
    porcentaje = calcular_porcentaje(puntaje, puntaje_maximo)
    bucket = clasificar_bucket(porcentaje)
    return puntaje, puntaje_maximo, porcentaje, bucket
