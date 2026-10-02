import pytest

from app.engine.models import RespuestaItem, ResultadoCriterio
from app.reportes.grafica import generar_grafica_radar, generar_grafica_temas, generar_heatmap_items
from app.reportes.models import DatosCriterio


def _criterio_con_niveles(numero: int, niveles: list[int]) -> DatosCriterio:
    return DatosCriterio(
        id=f"criterio-{numero}",
        numero=numero,
        nombre=f"Criterio {numero}",
        respuestas=[
            RespuestaItem(item_id=f"item-{numero}-{n}", numero=n, nivel=nivel, es_obligatorio=True)
            for n, nivel in enumerate(niveles, start=1)
        ],
        recomendaciones={},
        plantillas_apertura={},
    )


def _resultado(numero: int, porcentaje: float) -> ResultadoCriterio:
    return ResultadoCriterio(
        criterio_id=f"criterio-{numero}",
        numero=numero,
        nombre=f"Criterio {numero}",
        puntaje=round(porcentaje * 0.4),
        puntaje_maximo=40,
        porcentaje=porcentaje,
        bucket="regular",
        narrativa="",
        plantilla_apertura="",
    )


def test_generar_grafica_radar_devuelve_png_valido():
    contenido = generar_grafica_radar([_resultado(1, 42.5)])
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_grafica_radar_con_varios_criterios():
    contenido = generar_grafica_radar([_resultado(1, 42.5), _resultado(2, 70), _resultado(3, 22.5)])
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_grafica_radar_sin_criterios_lanza_error():
    with pytest.raises(ValueError):
        generar_grafica_radar([])


def test_generar_grafica_temas_devuelve_png_valido():
    contenido = generar_grafica_temas(3, 2)
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_grafica_temas_solo_obligatorios():
    contenido = generar_grafica_temas(4, 0)
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_grafica_temas_solo_optativos():
    contenido = generar_grafica_temas(0, 2)
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_grafica_temas_sin_temas_lanza_error():
    with pytest.raises(ValueError):
        generar_grafica_temas(0, 0)


def test_generar_heatmap_items_con_un_criterio_devuelve_png_valido():
    criterio = _criterio_con_niveles(1, [2, 1, 2, 2, 2, 1, 2, 2, 1, 2])
    contenido = generar_heatmap_items([criterio])
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_heatmap_items_con_los_5_criterios_devuelve_png_valido():
    criterios = [_criterio_con_niveles(n, [n % 5] * 10) for n in range(1, 6)]
    contenido = generar_heatmap_items(criterios)
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_heatmap_items_ordena_filas_por_numero_de_criterio():
    # Pasados en desorden (3, 1) — la función debe ordenarlos antes de dibujar,
    # no solo confiar en el orden de la lista recibida.
    criterios = [_criterio_con_niveles(3, [0] * 10), _criterio_con_niveles(1, [4] * 10)]
    contenido = generar_heatmap_items(criterios)
    assert contenido[:8] == b"\x89PNG\r\n\x1a\n"


def test_generar_heatmap_items_sin_criterios_lanza_error():
    with pytest.raises(ValueError):
        generar_heatmap_items([])
