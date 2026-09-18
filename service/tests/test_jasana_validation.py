"""Caso de validación contra los datos reales del informe JASANA
(references/REPORTE FINAL JASANA 07.03.26.docx): los 5 criterios puntuaron
17/40, 28/40, 9/40, 9/40 y 10/40, clasificados por el informe real como
Regular, Aceptable, Mínimo, Mínimo y Mínimo respectivamente. Ver CLAUDE.md,
sección 6 (Etapa 2).
"""

from app.engine.engine import evaluar_criterio, evaluar_global
from app.engine.models import RespuestaItem

# (nombre, niveles de sus 10 ítems) — los niveles son arbitrarios en su
# distribución interna, solo importa que sumen el puntaje real del criterio.
CRITERIOS_JASANA = [
    (1, "Identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos", [2, 1, 2, 2, 2, 1, 2, 2, 1, 2]),
    (2, "Uso de equipos auxiliares y condiciones ambientales", [3, 3, 3, 3, 3, 3, 3, 3, 3, 1]),
    (3, "Capacitación, adiestramiento y vigilancia a la salud", [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]),
    (4, "Difusión, registro y políticas en materia de Ergonomía", [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]),
    (5, "Medidas de prevención y control", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
]

PUNTAJES_ESPERADOS = [17, 28, 9, 9, 10]
BUCKETS_ESPERADOS = ["regular", "aceptable", "minimo", "minimo", "minimo"]


def _construir_respuestas_y_recomendaciones(criterio_numero: int, niveles: list[int]):
    respuestas = [
        RespuestaItem(
            item_id=f"c{criterio_numero}-i{numero}",
            numero=numero,
            nivel=nivel,
            es_obligatorio=numero % 2 == 1,
        )
        for numero, nivel in enumerate(niveles, start=1)
    ]
    recomendaciones = {
        (r.item_id, r.nivel): f"[PLACEHOLDER] Recomendación c{criterio_numero}-i{r.numero} nivel {r.nivel}"
        for r in respuestas
    }
    return respuestas, recomendaciones


def test_puntajes_y_buckets_por_criterio_coinciden_con_jasana():
    for (numero, nombre, niveles), puntaje_esperado, bucket_esperado in zip(
        CRITERIOS_JASANA, PUNTAJES_ESPERADOS, BUCKETS_ESPERADOS
    ):
        respuestas, recomendaciones = _construir_respuestas_y_recomendaciones(numero, niveles)
        resultado = evaluar_criterio(
            criterio_id=f"criterio-{numero}",
            numero=numero,
            nombre=nombre,
            respuestas=respuestas,
            recomendaciones=recomendaciones,
            plantilla_apertura=f"[PLACEHOLDER] Apertura criterio {numero}.",
        )
        assert resultado.puntaje == puntaje_esperado
        assert resultado.puntaje_maximo == 40
        assert resultado.bucket == bucket_esperado


def test_global_jasana():
    resultados = []
    for numero, nombre, niveles in CRITERIOS_JASANA:
        respuestas, recomendaciones = _construir_respuestas_y_recomendaciones(numero, niveles)
        resultados.append(
            evaluar_criterio(
                criterio_id=f"criterio-{numero}",
                numero=numero,
                nombre=nombre,
                respuestas=respuestas,
                recomendaciones=recomendaciones,
                plantilla_apertura=f"[PLACEHOLDER] Apertura criterio {numero}.",
            )
        )

    global_ = evaluar_global(resultados, plantilla_cierre="[PLACEHOLDER] Cierre global.", total_criterios=5)

    assert global_.puntaje == 73
    assert global_.puntaje_maximo == 200
    assert global_.porcentaje == 36.5
    assert global_.bucket == "minimo"
    # Los 5 criterios que integra el instrumento están respondidos: no es una evaluación
    # parcial, así que el cierre es la plantilla fija tal cual, sin acotar el alcance.
    assert global_.es_parcial is False
    assert global_.cierre == "[PLACEHOLDER] Cierre global."
    # Cada hallazgo (nivel <= 1) debe caer en obligatorios u optativos, sin perderse.
    total_hallazgos = sum(len(r.hallazgos) for r in resultados)
    assert len(global_.temas_obligatorios) + len(global_.temas_optativos) == total_hallazgos
