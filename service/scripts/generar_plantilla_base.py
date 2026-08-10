"""Genera la plantilla base `app/templates/informe_base.docx` usada por
docxtpl para renderizar el informe final (Etapa 4).

Se ejecuta una sola vez (o cuando cambie la estructura fija del informe) y
el resultado se versiona en el repositorio como cualquier otro archivo de
plantilla. No se ejecuta en cada generación de informe.

Uso: python scripts/generar_plantilla_base.py
"""

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH

SALIDA = Path(__file__).resolve().parent.parent / "app" / "templates" / "informe_base.docx"

# Marcadores de texto que generador.py localiza y reemplaza por las tablas
# de puntajes/porcentajes construidas con python-docx (más simple y robusto
# que las etiquetas de fila de docxtpl para tablas puramente numéricas).
MARCADOR_TABLA_PUNTAJES = "[[TABLA_PUNTAJES]]"
MARCADOR_TABLA_PORCENTAJES = "[[TABLA_PORCENTAJES]]"


def construir_documento() -> Document:
    doc = Document()

    titulo = doc.add_heading("Informe de Pre Diagnóstico Empresarial", level=0)
    titulo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitulo = doc.add_paragraph(
        "Identificación de factores de riesgo ergonómico por manejo manual de cargas, "
        "con base en la NOM-036-1-STPS-2018"
    )
    subtitulo.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_heading("Introducción", level=1)
    doc.add_paragraph(
        "La NOM-036-1-STPS-2018 establece los lineamientos para identificar, analizar, "
        "prevenir y controlar los factores de riesgo ergonómico derivados del manejo "
        "manual de cargas en los centros de trabajo. El presente documento resume los "
        "resultados obtenidos al aplicar el instrumento de autoevaluación con base en "
        "dicha norma dentro de la empresa "
    ).add_run("{{ empresa_nombre }}.").bold = True

    doc.add_heading("Información general de la empresa", level=1)
    p = doc.add_paragraph()
    p.add_run("La empresa ")
    p.add_run("{{ empresa_nombre }}").bold = True
    p.add_run(" se encuentra ubicada en {{ empresa_ubicacion }}. Cuenta con aproximadamente ")
    p.add_run("{{ empresa_num_trabajadores }}").bold = True
    p.add_run(
        " trabajadores, con el siguiente esquema de turnos: {{ empresa_turnos }}. Su giro "
        "es {{ empresa_giro }}. Las actividades relacionadas con el manejo manual de "
        "cargas identificadas son: {{ empresa_descripcion_mmh }}."
    )

    doc.add_heading("Resultados de la evaluación", level=1)
    doc.add_paragraph(
        "El instrumento de evaluación se divide en secciones (criterios), cada una "
        "constituida por diez ítems o afirmaciones calificados en una escala de 0 a 4, "
        "en donde 0 = Nada y 4 = Óptimo. La calificación máxima por criterio es de 40 "
        "puntos; entre mayor sea el puntaje, mayor es el grado de cumplimiento de la "
        "norma en ese rubro."
    )

    doc.add_paragraph("Tabla 1. Calificación obtenida por criterio evaluado.")
    doc.add_paragraph(MARCADOR_TABLA_PUNTAJES)

    doc.add_paragraph("Tabla 2. Porcentaje de cumplimiento por criterio evaluado.")
    doc.add_paragraph(MARCADOR_TABLA_PORCENTAJES)

    img_p = doc.add_paragraph("{{ grafica_radar }}")
    img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_heading("Resultados por criterio", level=1)
    doc.add_paragraph("{% for c in criterios %}")
    cp = doc.add_paragraph()
    cp.add_run("Criterio {{ c.numero }}.- ").bold = True
    cp.add_run("{{ c.narrativa }}")
    doc.add_paragraph("{% endfor %}")

    doc.add_heading("Áreas de oportunidad", level=1)
    doc.add_paragraph(
        "A continuación se describen los puntos identificados en los que se considera "
        "que se puede trabajar para facilitar la implementación y el cumplimiento de la "
        "NOM-036-1-STPS-2018."
    )
    doc.add_paragraph("{{ resultado_global_cierre }}")

    doc.add_heading("Temas obligatorios", level=2)
    doc.add_paragraph("{% for tema in temas_obligatorios %}")
    doc.add_paragraph("{{ loop.index }}. {{ tema }}")
    doc.add_paragraph("{% endfor %}")

    doc.add_heading("Temas optativos", level=2)
    doc.add_paragraph("{% for tema in temas_optativos %}")
    doc.add_paragraph("{{ loop.index }}. {{ tema }}")
    doc.add_paragraph("{% endfor %}")

    doc.add_paragraph("Atentamente,")
    doc.add_paragraph("Equipo de investigación en Ergonomía y Factores Humanos")

    return doc


if __name__ == "__main__":
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    construir_documento().save(SALIDA)
    print(f"Plantilla generada en {SALIDA}")
