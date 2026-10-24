from app.engine.models import RespuestaItem, ResultadoCriterio
from app.engine.narrativa import (
    como_continuacion,
    construir_cierre_parcial,
    ensamblar_narrativa_criterio,
    texto_narrativa,
)


def _respuestas(niveles: list[int]) -> list[RespuestaItem]:
    return [
        RespuestaItem(item_id=f"i{n}", numero=n, nivel=nivel, es_obligatorio=True)
        for n, nivel in enumerate(niveles, start=1)
    ]


def _descripciones(respuestas: list[RespuestaItem]) -> dict[tuple[str, int], str]:
    return {(r.item_id, r.nivel): f"Descripción {r.numero} nivel {r.nivel}." for r in respuestas}


def test_narrativa_sin_descripciones_es_apertura_e_implicacion():
    respuestas = _respuestas([2] * 10)
    segmentos = ensamblar_narrativa_criterio("Apertura.", respuestas, {}, "Implicación.")
    assert texto_narrativa(segmentos) == "Apertura. Implicación."


def test_narrativa_apertura_favorables_carencias_implicacion_en_ese_orden():
    respuestas = _respuestas([4, 0, 2, 3, 1, 2, 2, 2, 2, 2])
    segmentos = ensamblar_narrativa_criterio(
        "Apertura.", respuestas, _descripciones(respuestas), "Implicación."
    )
    assert texto_narrativa(segmentos) == (
        "Apertura. "
        "Entre los aspectos favorables, descripción 1 nivel 4. Asimismo, descripción 4 nivel 3. "
        "Por otro lado, descripción 2 nivel 0. Asimismo, descripción 5 nivel 1. "
        "Implicación."
    )
    assert [s.origen for s in segmentos] == [
        "plantilla", "observacion", "observacion", "observacion", "observacion", "plantilla",
    ]


def test_narrativa_limita_carencias_prioriza_las_mas_bajas_y_da_el_total():
    respuestas = _respuestas([1, 1, 0, 1, 0, 1, 2, 2, 2, 2])
    texto = texto_narrativa(
        ensamblar_narrativa_criterio("Apertura.", respuestas, _descripciones(respuestas))
    )
    # Los dos ítems en nivel 0 (3 y 5) más el primer ítem en nivel 1 (1), en orden de ítem.
    assert "En particular, descripción 1 nivel 1. Asimismo, descripción 3 nivel 0. " in texto
    assert "Además, descripción 5 nivel 0." in texto
    assert "descripción 2 nivel 1" not in texto
    assert "En total, 6 de los 10 aspectos evaluados en este criterio" in texto


def test_narrativa_sin_carencias_menciona_puntos_por_reforzar():
    respuestas = _respuestas([4, 4, 3, 2, 3, 2, 4, 2, 3, 3])
    texto = texto_narrativa(
        ensamblar_narrativa_criterio("Apertura.", respuestas, _descripciones(respuestas))
    )
    assert "Como puntos por reforzar, descripción 4 nivel 2. Asimismo, descripción 6 nivel 2." in texto
    assert "descripción 8 nivel 2" not in texto


def test_como_continuacion_respeta_siglas():
    assert como_continuacion("No se registra.") == "no se registra."
    assert como_continuacion("NOM-036 aplica.") == "NOM-036 aplica."


def _resultado_criterio(numero: int, nombre: str) -> ResultadoCriterio:
    return ResultadoCriterio(
        criterio_id=f"criterio-{numero}",
        numero=numero,
        nombre=nombre,
        puntaje=17,
        puntaje_maximo=40,
        porcentaje=42.5,
        bucket="regular",
        narrativa="",
        plantilla_apertura="",
    )


def test_construir_cierre_parcial_con_un_solo_criterio_evaluado():
    resultados = [_resultado_criterio(1, "Identificación y clasificación de los puestos")]
    texto = construir_cierre_parcial(resultados, total_criterios=5, bucket_global="regular", porcentaje_global=42.5)

    assert "únicamente para el Criterio 1 (Identificación y clasificación de los puestos)" in texto
    assert "de los 5 que integran el instrumento" in texto
    assert "Con base en este criterio, el nivel de cumplimiento alcanzado es Regular (42.5%)" in texto
    assert "aún faltan 4 criterios por evaluar" in texto


def test_construir_cierre_parcial_con_varios_criterios_evaluados_usa_plural():
    resultados = [
        _resultado_criterio(1, "Identificación y clasificación de los puestos"),
        _resultado_criterio(2, "Uso de equipos auxiliares"),
    ]
    texto = construir_cierre_parcial(resultados, total_criterios=5, bucket_global="minimo", porcentaje_global=30.0)

    assert "únicamente para 2 de los 5 criterios que integran el instrumento" in texto
    assert "Criterio 1 (Identificación y clasificación de los puestos), Criterio 2 (Uso de equipos auxiliares)" in texto
    assert "Con base en estos criterios, el nivel de cumplimiento alcanzado es Mínimo (30.0%)" in texto
    assert "aún faltan 3 criterios por evaluar" in texto


def test_construir_cierre_parcial_con_un_solo_criterio_faltante_usa_singular():
    resultados = [
        _resultado_criterio(n, f"Criterio {n}") for n in range(1, 5)
    ]
    texto = construir_cierre_parcial(resultados, total_criterios=5, bucket_global="aceptable", porcentaje_global=70.0)

    assert "aún falta 1 criterio por evaluar" in texto
