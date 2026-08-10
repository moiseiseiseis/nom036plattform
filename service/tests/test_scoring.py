import pytest

from app.engine.scoring import calcular_global, calcular_porcentaje, calcular_puntaje, clasificar_bucket


def test_calcular_puntaje_suma_y_maximo():
    puntaje, puntaje_maximo = calcular_puntaje([2, 1, 2, 2, 2, 1, 2, 2, 1, 2])
    assert puntaje == 17
    assert puntaje_maximo == 40


def test_calcular_puntaje_lista_vacia_lanza_error():
    with pytest.raises(ValueError):
        calcular_puntaje([])


def test_calcular_porcentaje():
    assert calcular_porcentaje(17, 40) == pytest.approx(42.5)
    assert calcular_porcentaje(0, 40) == 0
    assert calcular_porcentaje(40, 40) == 100


def test_calcular_porcentaje_maximo_invalido():
    with pytest.raises(ValueError):
        calcular_porcentaje(1, 0)


@pytest.mark.parametrize(
    "porcentaje,bucket_esperado",
    [
        (0, "inexistente"),
        (19.9, "inexistente"),
        (20, "minimo"),
        (22.5, "minimo"),
        (25, "minimo"),
        (39.9, "minimo"),
        (40, "regular"),
        (42.5, "regular"),
        (59.9, "regular"),
        (60, "aceptable"),
        (70, "aceptable"),
        (79.9, "aceptable"),
        (80, "optimo"),
        (100, "optimo"),
    ],
)
def test_clasificar_bucket(porcentaje, bucket_esperado):
    assert clasificar_bucket(porcentaje) == bucket_esperado


def test_clasificar_bucket_fuera_de_rango():
    with pytest.raises(ValueError):
        clasificar_bucket(-1)
    with pytest.raises(ValueError):
        clasificar_bucket(101)


def test_calcular_global():
    puntaje, puntaje_maximo, porcentaje, bucket = calcular_global(
        [(17, 40), (28, 40), (9, 40), (9, 40), (10, 40)]
    )
    assert puntaje == 73
    assert puntaje_maximo == 200
    assert porcentaje == pytest.approx(36.5)
    assert bucket == "minimo"
