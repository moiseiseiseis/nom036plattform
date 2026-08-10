import pytest

from app.engine.models import RespuestaItem
from app.engine.recomendaciones import construir_temas, identificar_hallazgos, seleccionar_recomendacion


@pytest.fixture
def recomendaciones():
    return {
        ("item-1", 0): "Rec item 1 nivel 0",
        ("item-1", 2): "Rec item 1 nivel 2",
        ("item-2", 1): "Rec item 2 nivel 1",
        ("item-3", 3): "Rec item 3 nivel 3",
    }


def test_seleccionar_recomendacion(recomendaciones):
    assert seleccionar_recomendacion(recomendaciones, "item-1", 2) == "Rec item 1 nivel 2"


def test_seleccionar_recomendacion_inexistente_lanza_error(recomendaciones):
    with pytest.raises(KeyError):
        seleccionar_recomendacion(recomendaciones, "item-1", 4)


def test_identificar_hallazgos_respeta_umbral(recomendaciones):
    respuestas = [
        RespuestaItem(item_id="item-1", numero=1, nivel=0, es_obligatorio=True),
        RespuestaItem(item_id="item-2", numero=2, nivel=1, es_obligatorio=False),
        RespuestaItem(item_id="item-3", numero=3, nivel=3, es_obligatorio=True),
    ]
    hallazgos = identificar_hallazgos(respuestas, recomendaciones, umbral=1)
    assert [h.item_id for h in hallazgos] == ["item-1", "item-2"]
    assert hallazgos[0].texto_recomendacion == "Rec item 1 nivel 0"


def test_identificar_hallazgos_orden_por_numero(recomendaciones):
    respuestas = [
        RespuestaItem(item_id="item-2", numero=2, nivel=1, es_obligatorio=False),
        RespuestaItem(item_id="item-1", numero=1, nivel=0, es_obligatorio=True),
    ]
    hallazgos = identificar_hallazgos(respuestas, recomendaciones, umbral=1)
    assert [h.numero for h in hallazgos] == [1, 2]


def test_construir_temas_separa_obligatorios_y_optativos():
    from app.engine.models import Hallazgo

    hallazgos_criterio_1 = [
        Hallazgo(item_id="a", numero=1, nivel=0, es_obligatorio=True, texto_recomendacion="Tema A"),
        Hallazgo(item_id="b", numero=2, nivel=1, es_obligatorio=False, texto_recomendacion="Tema B"),
    ]
    hallazgos_criterio_2 = [
        Hallazgo(item_id="c", numero=1, nivel=0, es_obligatorio=True, texto_recomendacion="Tema C"),
    ]
    obligatorios, optativos = construir_temas([hallazgos_criterio_1, hallazgos_criterio_2])
    assert obligatorios == ["Tema A", "Tema C"]
    assert optativos == ["Tema B"]


def test_construir_temas_sin_duplicados():
    from app.engine.models import Hallazgo

    repetido = Hallazgo(item_id="a", numero=1, nivel=0, es_obligatorio=True, texto_recomendacion="Tema repetido")
    obligatorios, _ = construir_temas([[repetido], [repetido]])
    assert obligatorios == ["Tema repetido"]
