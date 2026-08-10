import io
from pathlib import Path

from docx import Document as DocxDocument
from docx.document import Document as DocxDocumentType
from docx.shared import Mm
from docxtpl import DocxTemplate, InlineImage

from app.db import get_connection
from app.engine.engine import evaluar_criterio, evaluar_global
from app.engine.models import ResultadoCriterio
from app.engine.scoring import calcular_global, calcular_porcentaje, calcular_puntaje, clasificar_bucket

from .grafica import generar_grafica_radar
from .models import DatosEvaluacion
from .repository import fetch_datos_evaluacion

PLANTILLA_BASE = Path(__file__).resolve().parent.parent / "templates" / "informe_base.docx"

MARCADOR_TABLA_PUNTAJES = "[[TABLA_PUNTAJES]]"
MARCADOR_TABLA_PORCENTAJES = "[[TABLA_PORCENTAJES]]"

BUCKET_ETIQUETAS = {
    "inexistente": "Inexistente",
    "minimo": "Mínimo",
    "regular": "Regular",
    "aceptable": "Aceptable",
    "optimo": "Óptimo",
}


def generar_informe(evaluacion_id: str) -> bytes:
    """Punto de entrada usado por la API: trae los datos de la evaluación de
    la base de datos y produce el `.docx` final."""
    with get_connection() as conn:
        datos = fetch_datos_evaluacion(conn, evaluacion_id)
    return generar_informe_desde_datos(datos)


def generar_informe_desde_datos(datos: DatosEvaluacion) -> bytes:
    """Lógica de ensamblado del informe a partir de datos ya resueltos, sin
    tocar la base de datos — es lo que permite probar el generador completo
    (motor + gráfica + plantilla + tablas) con datos sintéticos."""
    if not datos.criterios:
        raise ValueError("La evaluación no tiene respuestas registradas para ningún criterio")

    resultados: list[ResultadoCriterio] = []
    for dc in datos.criterios:
        puntaje, puntaje_maximo = calcular_puntaje([r.nivel for r in dc.respuestas])
        bucket = clasificar_bucket(calcular_porcentaje(puntaje, puntaje_maximo))
        resultados.append(
            evaluar_criterio(
                criterio_id=dc.id,
                numero=dc.numero,
                nombre=dc.nombre,
                respuestas=dc.respuestas,
                recomendaciones=dc.recomendaciones,
                plantilla_apertura=dc.plantillas_apertura.get(bucket, ""),
            )
        )

    _, _, _, bucket_global = calcular_global([(r.puntaje, r.puntaje_maximo) for r in resultados])
    resultado_global = evaluar_global(
        resultados, plantilla_cierre=datos.plantillas_cierre_global.get(bucket_global, "")
    )

    tpl = DocxTemplate(str(PLANTILLA_BASE))
    grafica_imagen = InlineImage(tpl, io.BytesIO(generar_grafica_radar(resultados)), width=Mm(140))

    tpl.render(
        {
            "empresa_nombre": datos.empresa_nombre,
            "empresa_ubicacion": datos.empresa_ubicacion or "no especificada",
            "empresa_giro": datos.empresa_giro or "no especificado",
            "empresa_num_trabajadores": (
                datos.empresa_num_trabajadores
                if datos.empresa_num_trabajadores is not None
                else "no especificado"
            ),
            "empresa_turnos": datos.empresa_turnos or "no especificados",
            "empresa_descripcion_mmh": datos.empresa_descripcion_mmh or "no especificadas",
            "grafica_radar": grafica_imagen,
            "criterios": [
                {"numero": r.numero, "nombre": r.nombre, "narrativa": r.narrativa} for r in resultados
            ],
            "resultado_global_cierre": resultado_global.cierre,
            "temas_obligatorios": resultado_global.temas_obligatorios,
            "temas_optativos": resultado_global.temas_optativos,
        }
    )

    buffer = io.BytesIO()
    tpl.save(buffer)
    buffer.seek(0)

    documento = DocxDocument(buffer)
    _reemplazar_marcador_con_tabla(documento, MARCADOR_TABLA_PUNTAJES, _construir_tabla_puntajes, resultados)
    _reemplazar_marcador_con_tabla(
        documento, MARCADOR_TABLA_PORCENTAJES, _construir_tabla_porcentajes, resultados
    )

    salida = io.BytesIO()
    documento.save(salida)
    return salida.getvalue()


def _reemplazar_marcador_con_tabla(documento, marcador, construir_tabla, resultados):
    for parrafo in documento.paragraphs:
        if parrafo.text.strip() == marcador:
            tabla = construir_tabla(documento, resultados)
            parrafo._p.addnext(tabla._tbl)
            parrafo._p.getparent().remove(parrafo._p)
            return
    raise ValueError(f"No se encontró el marcador {marcador!r} en la plantilla")


def _construir_tabla_puntajes(documento: DocxDocumentType, resultados: list[ResultadoCriterio]):
    tabla = documento.add_table(rows=1, cols=2)
    tabla.style = "Table Grid"
    encabezado = tabla.rows[0].cells
    encabezado[0].text = "Criterio evaluado"
    encabezado[1].text = "Puntaje obtenido"
    for r in resultados:
        fila = tabla.add_row().cells
        fila[0].text = f"{r.numero}. {r.nombre}"
        fila[1].text = f"{r.puntaje}/{r.puntaje_maximo}"
    return tabla


def _construir_tabla_porcentajes(documento: DocxDocumentType, resultados: list[ResultadoCriterio]):
    tabla = documento.add_table(rows=1, cols=3)
    tabla.style = "Table Grid"
    encabezado = tabla.rows[0].cells
    encabezado[0].text = "Criterio evaluado"
    encabezado[1].text = "Porcentaje de cumplimiento"
    encabezado[2].text = "Clasificación"
    for r in resultados:
        fila = tabla.add_row().cells
        fila[0].text = f"{r.numero}. {r.nombre}"
        fila[1].text = f"{r.porcentaje:.1f}%"
        fila[2].text = BUCKET_ETIQUETAS.get(r.bucket, r.bucket)
    return tabla
