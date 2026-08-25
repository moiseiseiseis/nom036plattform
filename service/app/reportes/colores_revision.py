"""Paleta de colores de la "versión de revisión" del informe (Etapa 6).

Resalta el texto del `.docx` generado según su origen dentro del motor de
recomendaciones (dato ingresado por la empresa, resultado calculado,
plantilla fija por franja de severidad, o recomendación elegida de un
catálogo), para facilitar su comparación con el criterio experto del Dr.
Sergio durante la validación piloto. No se usa en el informe final que se
entrega a una empresa real — ver el parámetro `modo_revision` en
`generador.py`.
"""

from docx.oxml import OxmlElement
from docx.oxml.ns import qn

DATO_EMPRESA = "CFE2F3"
RESULTADO_CALCULADO = "D9EAD3"
PLANTILLA_FIJA = "E6D9F2"
RECOMENDACION_CATALOGO = "FCE5CD"
TEMA_OBLIGATORIO_OPTATIVO = "EAEAEA"

# (etiqueta, descripción, color) — mismo orden en que se listan en la leyenda
# del documento.
LEYENDA = (
    (
        "Dato de la empresa",
        "Texto ingresado directamente por la empresa en la autoevaluación (datos generales).",
        DATO_EMPRESA,
    ),
    (
        "Resultado calculado",
        "Puntaje, porcentaje y clasificación que obtiene el motor a partir de las respuestas.",
        RESULTADO_CALCULADO,
    ),
    (
        "Plantilla fija",
        "Texto de apertura o cierre que depende solo de la franja de severidad — el mismo "
        "para cualquier empresa que caiga en ella.",
        PLANTILLA_FIJA,
    ),
    (
        "Recomendación de catálogo",
        "Texto elegido del catálogo ítem-nivel según la respuesta específica de la empresa.",
        RECOMENDACION_CATALOGO,
    ),
    (
        "Tema obligatorio / optativo",
        "Las mismas recomendaciones de catálogo, agrupadas como lista de áreas de oportunidad.",
        TEMA_OBLIGATORIO_OPTATIVO,
    ),
)


def sombrear_run(run, color_hex: str) -> None:
    """Aplica un color de fondo (efecto marcatextos) a un run ya existente.

    python-docx no expone sombreado de texto en su API de alto nivel; se
    inserta el elemento `w:shd` directamente en las propiedades del run.
    """
    rpr = run._r.get_or_add_rPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), color_hex)
    rpr.append(shd)
