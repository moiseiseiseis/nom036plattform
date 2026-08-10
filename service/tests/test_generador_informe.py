"""Prueba de extremo a extremo del generador de informes (Etapa 4), con
datos sintéticos que reproducen el Criterio 1 del caso JASANA (17/40,
Regular) — no requiere conexión a base de datos: ejercita motor de cálculo
+ gráfica + plantilla docxtpl + tablas, igual que lo haría una evaluación
real.
"""

import io

import pytest
from docx import Document

from app.engine.models import RespuestaItem
from app.reportes.generador import generar_informe_desde_datos
from app.reportes.models import DatosCriterio, DatosEvaluacion

NIVELES_CRITERIO_1 = [2, 1, 2, 2, 2, 1, 2, 2, 1, 2]  # suma 17/40, igual que JASANA


def _datos_evaluacion_jasana() -> DatosEvaluacion:
    respuestas = [
        RespuestaItem(item_id=f"item-{n}", numero=n, nivel=nivel, es_obligatorio=n % 2 == 1)
        for n, nivel in enumerate(NIVELES_CRITERIO_1, start=1)
    ]
    recomendaciones = {
        (r.item_id, r.nivel): f"[PLACEHOLDER] Recomendación ítem {r.numero} nivel {r.nivel}."
        for r in respuestas
    }
    plantillas_apertura = {
        bucket: f"[PLACEHOLDER] Apertura criterio 1, bucket {bucket}."
        for bucket in ("inexistente", "minimo", "regular", "aceptable", "optimo")
    }
    criterio = DatosCriterio(
        id="criterio-1",
        numero=1,
        nombre="Identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos",
        respuestas=respuestas,
        recomendaciones=recomendaciones,
        plantillas_apertura=plantillas_apertura,
    )
    plantillas_cierre_global = {
        bucket: f"[PLACEHOLDER] Cierre global, bucket {bucket}."
        for bucket in ("inexistente", "minimo", "regular", "aceptable", "optimo")
    }
    return DatosEvaluacion(
        evaluacion_id="evaluacion-test",
        token_publico="test-token",
        estado="completado",
        empresa_nombre="Empresa de Prueba",
        empresa_ubicacion="Guadalajara, Jalisco",
        empresa_giro="Textil y confección",
        empresa_num_trabajadores=35,
        empresa_turnos="Un turno",
        empresa_descripcion_mmh="Levantamiento y transporte de rollos de tela.",
        criterios=[criterio],
        plantillas_cierre_global=plantillas_cierre_global,
    )


def test_generar_informe_produce_docx_valido_y_con_contenido_correcto():
    contenido = generar_informe_desde_datos(_datos_evaluacion_jasana())

    assert contenido[:2] == b"PK"  # firma de archivo ZIP (.docx es un zip)

    documento = Document(io.BytesIO(contenido))
    texto_completo = "\n".join(p.text for p in documento.paragraphs)

    assert "Empresa de Prueba" in texto_completo
    assert "Guadalajara, Jalisco" in texto_completo
    assert "Criterio 1.-" in texto_completo
    # Los 3 ítems con nivel <= 1 (umbral de hallazgo) deben aparecer en la narrativa.
    assert "ítem 2 nivel 1" in texto_completo
    assert "ítem 6 nivel 1" in texto_completo
    assert "ítem 9 nivel 1" in texto_completo

    assert len(documento.tables) == 2
    tabla_puntajes = documento.tables[0]
    assert tabla_puntajes.rows[1].cells[1].text == "17/40"

    tabla_porcentajes = documento.tables[1]
    assert tabla_porcentajes.rows[1].cells[1].text == "42.5%"
    assert tabla_porcentajes.rows[1].cells[2].text == "Regular"

    assert len(documento.inline_shapes) == 1  # la gráfica de radar


def test_generar_informe_sin_criterios_lanza_error():
    datos = _datos_evaluacion_jasana()
    datos_sin_criterios = DatosEvaluacion(
        evaluacion_id=datos.evaluacion_id,
        token_publico=datos.token_publico,
        estado=datos.estado,
        empresa_nombre=datos.empresa_nombre,
        empresa_ubicacion=datos.empresa_ubicacion,
        empresa_giro=datos.empresa_giro,
        empresa_num_trabajadores=datos.empresa_num_trabajadores,
        empresa_turnos=datos.empresa_turnos,
        empresa_descripcion_mmh=datos.empresa_descripcion_mmh,
        criterios=[],
        plantillas_cierre_global=datos.plantillas_cierre_global,
    )
    with pytest.raises(ValueError):
        generar_informe_desde_datos(datos_sin_criterios)
