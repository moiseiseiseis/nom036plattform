"""Genera la plantilla base `app/templates/informe_base.docx` usada por
docxtpl para renderizar el informe final (Etapa 4).

Se ejecuta una sola vez (o cuando cambie la estructura fija del informe) y
el resultado se versiona en el repositorio como cualquier otro archivo de
plantilla. No se ejecuta en cada generación de informe.

Uso: python scripts/generar_plantilla_base.py
"""

import sys
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.reportes import estilos  # noqa: E402
from app.reportes.colores_revision import LEYENDA, sombrear_run  # noqa: E402

SALIDA = Path(__file__).resolve().parent.parent / "app" / "templates" / "informe_base.docx"

# Marcadores de texto que generador.py localiza y reemplaza por las tablas
# de puntajes/porcentajes construidas con python-docx (más simple y robusto
# que las etiquetas de fila de docxtpl para tablas puramente numéricas).
MARCADOR_TABLA_PUNTAJES = "[[TABLA_PUNTAJES]]"
MARCADOR_TABLA_PORCENTAJES = "[[TABLA_PORCENTAJES]]"


def _seccion(doc, titulo: str, *, nivel: int = 1):
    """Encabezado de sección con la regla de color debajo (solo en nivel 1,
    para marcar el inicio de los bloques principales del informe)."""
    encabezado = doc.add_heading(titulo, level=nivel)
    if nivel == 1:
        estilos.agregar_regla_inferior(encabezado)
    return encabezado


def _parrafo_justificado(doc, *runs_con_texto):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    for texto in runs_con_texto:
        p.add_run(texto)
    return p


def _parrafo_tema(doc):
    """"Tema N:" en cursiva seguido del texto, como en el informe JASANA."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.add_run("Tema {{ loop.index }}:").italic = True
    p.add_run(" ")
    p.add_run("{{r tema }}")
    return p


def _parrafo_cierre(doc, texto: str, *, centrado: bool = False):
    p = doc.add_paragraph(texto)
    if centrado:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_with_next = True
    return p


def _caption(doc, texto: str):
    p = doc.add_paragraph(texto)
    estilos.estilizar_texto_cita(p)
    return p


def construir_documento() -> Document:
    doc = Document()
    estilos.aplicar_estilos_base(doc)
    estilos.configurar_pie_pagina(doc.sections[0])

    # --- Portada ---------------------------------------------------------
    titulo = doc.add_heading("Informe de Pre Diagnóstico Empresarial", level=0)
    titulo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    estilos.agregar_regla_inferior(titulo, grosor=12)

    subtitulo = doc.add_paragraph()
    subtitulo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    # El giro y el estado salen del formulario (ver `generador.py::_titulo_informe`).
    subtitulo.add_run("{{r titulo_informe }}")

    doc.add_paragraph()
    ficha = doc.add_paragraph()
    ficha.alignment = WD_ALIGN_PARAGRAPH.CENTER
    ficha.add_run("Empresa evaluada: ").bold = True
    ficha.add_run("{{r empresa_nombre }}")
    ficha_fecha = doc.add_paragraph()
    ficha_fecha.alignment = WD_ALIGN_PARAGRAPH.CENTER
    ficha_fecha.add_run("Fecha de generación: ").bold = True
    ficha_fecha.add_run("{{ fecha_generacion }}")

    aviso = doc.add_paragraph()
    aviso.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_aviso = aviso.add_run(
        "Documento confidencial. Su contenido está dirigido exclusivamente a la empresa "
        "evaluada y al equipo responsable de la validación de este instrumento."
    )
    r_aviso.font.size = Pt(9.5)
    r_aviso.font.italic = True
    r_aviso.font.color.rgb = estilos.COLOR_TEXTO_TENUE

    doc.add_page_break()

    # --- Introducción ------------------------------------------------------
    # Redacción del informe JASANA del Dr. Sergio, sin su párrafo inicial sobre
    # el sector. Las fechas y el alcance son los del texto oficial (DOF
    # 23/11/2018, Transitorios y numerales 2 y 2.1), no los de JASANA ("31 de
    # marzo del 2024" y "aunque la actividad se realice una vez al día", lo
    # contrario del numeral 2: "más de una vez al día").
    _seccion(doc, "Introducción")
    _parrafo_justificado(
        doc,
        "Desde el 2018 se han propuesto y aprobado nuevas normas oficiales específicas, las "
        "cuales están directamente dirigidas a mejorar las condiciones laborales dentro de "
        "los centros de trabajo. Un ejemplo de ello es la NOM-036-1-STPS-2018, que tiene como "
        "objetivo establecer los lineamientos para analizar, prevenir y controlar los "
        "factores de riesgo ergonómico por el manejo manual de cargas.",
    )
    _parrafo_justificado(
        doc,
        "Dicha norma oficial mexicana está enfocada en minimizar la exposición que tienen los "
        "trabajadores al manejo y/o manipulación de cargas durante sus jornadas laborales. "
        "Entró en vigor el 2 de enero de 2020, y desde el 4 de enero de 2023 son exigibles "
        "también el análisis de los factores de riesgo ergonómico y el programa de ergonomía, "
        "de tal manera que todo puesto de trabajo en donde se manipulen o se transporten "
        "objetos con una masa de 3 kg o más, de forma cotidiana (más de una vez al día), será "
        "susceptible de ser evaluado con base en el marco normativo ya mencionado.",
    )
    _parrafo_justificado(
        doc,
        "En este sentido, el objetivo de este documento es presentar los resultados obtenidos "
        "durante la implementación de un instrumento de autoevaluación para la identificación "
        "de factores de riesgo ergonómico por manejo manual de cargas, con base en la "
        "NOM-036-1-STPS-2018, dentro de la empresa ",
        "{{r empresa_nombre }}",
        ".",
    )

    doc.add_paragraph("{% if es_revision %}")
    _seccion(doc, "Guía de colores de este documento", nivel=2)
    doc.add_paragraph(
        "Esta versión del informe, generada durante la etapa de validación piloto, resalta el "
        "texto según su origen dentro del motor de recomendaciones, para facilitar su revisión:"
    )
    for etiqueta, descripcion, color in LEYENDA:
        p = doc.add_paragraph(style="List Bullet")
        r = p.add_run(etiqueta)
        r.bold = True
        sombrear_run(r, color)
        p.add_run(f": {descripcion}")
    doc.add_paragraph("{% endif %}")

    # --- Información general de la empresa ---------------------------------
    _seccion(doc, "Información general de la empresa")
    p = _parrafo_justificado(doc, "La empresa ", "{{r empresa_nombre }}")
    p.add_run(" se encuentra ubicada en {{r empresa_ubicacion }}. Cuenta con aproximadamente ")
    p.add_run("{{r empresa_num_trabajadores }}")
    p.add_run(
        " trabajadores, los cuales laboran en {{r empresa_turnos }}, y su actividad principal "
        "es {{r empresa_giro }}."
    )
    _parrafo_justificado(
        doc,
        "Dentro de las actividades relacionadas con el manejo manual de cargas se identificaron "
        "las siguientes: {{r empresa_descripcion_mmh }}.",
    )
    _parrafo_justificado(
        doc,
        "A continuación se presentan los resultados obtenidos con la aplicación del instrumento "
        "de autoevaluación para la identificación de factores de riesgo ergonómico por manejo "
        "manual de cargas.",
    )

    # --- Resultados de la evaluación ----------------------------------------
    _seccion(doc, "Resultados de la evaluación")
    _parrafo_justificado(
        doc,
        "El instrumento de evaluación se dividió en cinco secciones, las cuales son: "
        "{{ secciones_instrumento }}.",
    )
    _parrafo_justificado(
        doc,
        "Cada sección está constituida por 10 ítems, los cuales se calificaron en una escala "
        "del 0 al 4, en donde 0 = Nada y 4 = Óptimo.",
    )
    _parrafo_justificado(
        doc,
        "La calificación máxima para cada sección fue de 40 puntos a partir de la sumatoria de "
        "todos los ítems, de tal manera que entre mayor fuera el puntaje, mayor sería el grado "
        "de cumplimiento de la NOM-036-1-STPS-2018 relativa a la identificación, análisis, "
        "prevención y control de manejo manual de cargas.",
    )
    _parrafo_justificado(
        doc,
        "A continuación se explican los resultados obtenidos en cada una de las secciones del "
        "instrumento, los cuales se pueden observar en las tablas 1 y 2 y en las figuras 1 y 2.",
    )

    doc.add_paragraph("Tabla 1. Calificación obtenida por criterio evaluado.")
    doc.add_paragraph(MARCADOR_TABLA_PUNTAJES)

    doc.add_paragraph("Tabla 2. Porcentaje de cumplimiento por criterio evaluado.")
    doc.add_paragraph(MARCADOR_TABLA_PORCENTAJES)
    _parrafo_justificado(
        doc,
        "La calificación obtenida en cada criterio se convirtió en porcentaje con el propósito "
        "de tener una interpretación más clara del grado de cumplimiento percibido por la "
        "persona que respondió la autoevaluación. Se tomó como referencia que, para cada "
        "criterio evaluado, la puntuación máxima es de 40 puntos.",
    )

    img_p = doc.add_paragraph("{{ grafica_radar }}")
    img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _caption(doc, "Figura 1. Porcentaje de cumplimiento por criterio, sobre las 5 franjas de severidad.")

    img_heatmap_p = doc.add_paragraph("{{ grafica_heatmap }}")
    img_heatmap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _caption(
        doc,
        "Figura 2. Nivel de respuesta (0-4) de cada ítem, agrupado por criterio evaluado.",
    )

    # --- Resultados por criterio ---------------------------------------------
    _seccion(doc, "Resultados por criterio")
    doc.add_paragraph("{% for c in criterios %}")
    cp = doc.add_paragraph()
    cp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    cp.add_run("Criterio {{ c.numero }}.- ").bold = True
    cp.add_run("{{r c.narrativa }}")
    doc.add_paragraph("{% endfor %}")

    # --- Áreas de oportunidad --------------------------------------------
    # Con evaluación parcial (menos criterios respondidos que los que integra
    # el instrumento), `resultado_global_cierre` ya trae el párrafo completo
    # con el alcance acotado (ver `engine/narrativa.py::construir_cierre_parcial`)
    # — se omite la apertura fija para no ser redundante ni generalizar sobre
    # un bucket global que con datos parciales no describe a la empresa
    # completa (retroalimentación de la validación piloto, hallazgo 1).
    _seccion(doc, "Áreas de oportunidad")
    doc.add_paragraph("{% if not resultado_global_es_parcial %}")
    _parrafo_justificado(doc, "{{r resultado_global_apertura }}")
    doc.add_paragraph("{% endif %}")
    _parrafo_justificado(doc, "{{r resultado_global_cierre }}")

    doc.add_paragraph("{% if hay_temas %}")
    img_temas_p = doc.add_paragraph("{{ grafica_temas }}")
    img_temas_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _caption(doc, "Figura 3. Proporción de temas de atención obligatoria y optativa.")
    doc.add_paragraph("{% endif %}")

    # Fallback explícito si la lista sale vacía: sin esto, la sección se veía
    # como un error (encabezado + texto introductorio sin nada debajo) en vez
    # de leerse como "no hay pendientes" (retroalimentación de la validación
    # piloto, hallazgo 3).
    _seccion(doc, "Temas obligatorios", nivel=2)
    doc.add_paragraph(
        "Derivados directamente de las exigencias de la NOM-036-1-STPS-2018 para los "
        "temas evaluados con nivel de cumplimiento bajo."
    )
    doc.add_paragraph("{% if temas_obligatorios %}")
    doc.add_paragraph("{%p for tema in temas_obligatorios %}")
    _parrafo_tema(doc)
    doc.add_paragraph("{%p endfor %}")
    doc.add_paragraph("{% else %}")
    doc.add_paragraph(
        "No se identificaron temas obligatorios pendientes en los criterios evaluados."
    )
    doc.add_paragraph("{% endif %}")

    _seccion(doc, "Temas optativos", nivel=2)
    doc.add_paragraph("Buenas prácticas sugeridas, adicionales a lo que exige la norma.")
    doc.add_paragraph("{% if temas_optativos %}")
    doc.add_paragraph("{%p for tema in temas_optativos %}")
    _parrafo_tema(doc)
    doc.add_paragraph("{%p endfor %}")
    doc.add_paragraph("{% else %}")
    doc.add_paragraph(
        "No se identificaron temas optativos adicionales en los criterios evaluados."
    )
    doc.add_paragraph("{% endif %}")

    # Cierre como en el informe JASANA: firma centrada con espacio para firmar
    # y datos institucionales abajo a la izquierda. Nombre y cédula (NOM-036,
    # numeral 7.4 inciso f) vienen de `generador.py::_responsable`. Se mantiene
    # junto para que la firma no quede separada en dos páginas.
    atentamente = _parrafo_cierre(doc, "Atentamente", centrado=True)
    atentamente.paragraph_format.space_before = Pt(24)
    for _ in range(3):
        _parrafo_cierre(doc, "")
    _parrafo_cierre(doc, "_" * 38, centrado=True)
    firma = _parrafo_cierre(doc, "", centrado=True)
    firma.add_run("{{ responsable_nombre }}").bold = True
    doc.add_paragraph("{%p if responsable_cedula %}")
    _parrafo_cierre(doc, "Cédula profesional: {{ responsable_cedula }}", centrado=True)
    doc.add_paragraph("{%p endif %}")
    _parrafo_cierre(doc, "")
    for linea in (
        "LFHE Laboratorio de Factores Humanos y Ergonomía Tlajomulco",
        "Universidad de Guadalajara",
        "Centro Universitario de Tlajomulco",
    ):
        institucion = _parrafo_cierre(doc, "")
        institucion.add_run(linea).italic = True
        institucion.paragraph_format.space_after = Pt(0)

    return doc


if __name__ == "__main__":
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    construir_documento().save(SALIDA)
    print(f"Plantilla generada en {SALIDA}")
