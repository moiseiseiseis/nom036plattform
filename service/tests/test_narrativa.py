from app.engine.models import Hallazgo
from app.engine.narrativa import ensamblar_narrativa_criterio


def test_ensamblar_narrativa_sin_hallazgos_devuelve_solo_apertura():
    assert ensamblar_narrativa_criterio("Apertura del criterio.", []) == "Apertura del criterio."


def test_ensamblar_narrativa_concatena_hallazgos_en_orden():
    hallazgos = [
        Hallazgo(item_id="a", numero=1, nivel=0, es_obligatorio=True, texto_recomendacion="Hallazgo uno."),
        Hallazgo(item_id="b", numero=2, nivel=1, es_obligatorio=False, texto_recomendacion="Hallazgo dos."),
    ]
    resultado = ensamblar_narrativa_criterio("Apertura.", hallazgos)
    assert resultado == "Apertura. Hallazgo uno. Hallazgo dos."
