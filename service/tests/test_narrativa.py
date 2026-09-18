from app.engine.models import Hallazgo, ResultadoCriterio
from app.engine.narrativa import construir_cierre_parcial, ensamblar_narrativa_criterio


def test_ensamblar_narrativa_sin_hallazgos_devuelve_solo_apertura():
    assert ensamblar_narrativa_criterio("Apertura del criterio.", []) == "Apertura del criterio."


def test_ensamblar_narrativa_concatena_hallazgos_en_orden():
    hallazgos = [
        Hallazgo(item_id="a", numero=1, nivel=0, es_obligatorio=True, texto_recomendacion="Hallazgo uno."),
        Hallazgo(item_id="b", numero=2, nivel=1, es_obligatorio=False, texto_recomendacion="Hallazgo dos."),
    ]
    resultado = ensamblar_narrativa_criterio("Apertura.", hallazgos)
    assert resultado == "Apertura. Hallazgo uno. Hallazgo dos."


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
