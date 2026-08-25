import pytest

from app.engine.models import ResultadoCriterio
from app.reportes.grafica import generar_grafica_radar


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
