"""Generación de las gráficas del informe (radar de cumplimiento por
criterio y dona de temas obligatorios/optativos), como PNG en memoria listos
para `docxtpl.InlineImage`. No tocan la base de datos.

Rediseño de retroalimentación de la validación piloto
(`retroalimentacion/grafica.py`, `retroalimentacion/reporte.txt` hallazgo 7 y
`contenido/como-se-generan-las-graficas.md` sección 6): tipografía Carlito
(compatible en métricas con la Calibri del cuerpo del .docx) en vez de la
DejaVu Sans por defecto de matplotlib, línea de datos del radar en el mismo
azul de los encabezados del documento en vez de negro, bandas de severidad
más saturadas con un hairline blanco entre cada una, valores como "badge" en
vez de texto flotando, y una dona con KPI central + leyenda con conteo y
porcentaje.

Fuente de verdad de colores: `estilos.py` (mismos hex que usa la Tabla 2 del
.docx) y `app.engine.scoring.clasificar_bucket` (mismo corte de franjas que
usa el resto del sistema — no se reimplementa aquí).
"""
from __future__ import annotations

import io
import logging
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.font_manager as fm
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
import numpy as np

from app.engine.models import ResultadoCriterio
from app.engine.scoring import BUCKETS, clasificar_bucket

from .estilos import (
    COLOR_MARCA_HEX,
    COLOR_OBLIGATORIO_HEX,
    COLOR_OPTATIVO_HEX,
    COLOR_POR_BUCKET,
    ETIQUETA_POR_BUCKET,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Tipografía
# ---------------------------------------------------------------------------
_FONT_DIR_CANDIDATES = [
    Path(__file__).parent / "fonts",  # bundleada con el repo (recomendado)
    Path("/usr/share/fonts/truetype/crosextra"),  # paquete fonts-crosextra-carlito
]


def _registrar_fuente_carlito() -> str:
    for d in _FONT_DIR_CANDIDATES:
        regular = d / "Carlito-Regular.ttf"
        bold = d / "Carlito-Bold.ttf"
        if regular.exists():
            fm.fontManager.addfont(str(regular))
            if bold.exists():
                fm.fontManager.addfont(str(bold))
            return "Carlito"
    logger.warning(
        "Carlito no encontrada (buscado en %s) — las gráficas usarán DejaVu Sans, "
        "inconsistente con la Calibri del cuerpo del .docx. Ver "
        "retroalimentacion/grafica.py para cómo bundlear el .ttf.",
        ", ".join(str(d) for d in _FONT_DIR_CANDIDATES),
    )
    return "DejaVu Sans"


_FONT_FAMILY = _registrar_fuente_carlito()
plt.rcParams["font.family"] = _FONT_FAMILY
plt.rcParams["axes.unicode_minus"] = False

# ---------------------------------------------------------------------------
# Tokens visuales — hex de `estilos.py` con el `#` que matplotlib requiere
# (esos hex no llevan `#` porque el resto del documento los usa también para
# `w:fill`/`RGBColor.from_string`, que sí lo exigen sin prefijo).
# ---------------------------------------------------------------------------
COLOR_BANDA = {bucket: f"#{hex_}" for bucket, hex_ in COLOR_POR_BUCKET.items()}
COLOR_OBLIGATORIO = f"#{COLOR_OBLIGATORIO_HEX}"
COLOR_OPTATIVO = f"#{COLOR_OPTATIVO_HEX}"
COLOR_MARCA = f"#{COLOR_MARCA_HEX}"

INK = "#1F2430"  # texto principal (no negro puro)
INK_MUTED = "#6B7280"  # texto secundario / ejes
GRID = "#E4E4E1"  # gris recesivo para líneas de referencia
SURFACE = "#FFFFFF"

# Saturación de las bandas de severidad. 0.13 (primer mockup) se sentía
# "disuelto"; 0.24 mantiene la línea de datos legible encima y se ve más
# vivo. Súbelo/bájalo aquí si al imprimir se ve muy fuerte o muy pálido — es
# el único número que controla ese balance.
ALPHA_BANDAS = 0.24


def _wrap(texto: str, ancho: int = 14) -> str:
    palabras = texto.split()
    lineas, actual = [], ""
    for palabra in palabras:
        prueba = (actual + " " + palabra).strip()
        if len(prueba) > ancho and actual:
            lineas.append(actual)
            actual = palabra
        else:
            actual = prueba
    if actual:
        lineas.append(actual)
    return "\n".join(lineas)


def _fig_a_bytes(fig, dpi: int = 200) -> bytes:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=dpi, facecolor=SURFACE, bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return buf.read()


# ---------------------------------------------------------------------------
# Figura 1 — radar de cumplimiento por criterio
# ---------------------------------------------------------------------------
def generar_grafica_radar(criterios: list[ResultadoCriterio]) -> bytes:
    """Con un solo criterio disponible (etapa piloto, mientras se cargan los
    Criterios 2-5), dibuja un radar de un solo eje: es el comportamiento
    esperado, no un caso a corregir en esta función."""
    if not criterios:
        raise ValueError("Se requiere al menos un criterio para generar la gráfica")

    nombres = [c.nombre for c in criterios]
    valores = [float(c.porcentaje) for c in criterios]
    n = len(criterios)

    angulos = [i / n * 2 * np.pi for i in range(n)]
    angulos_cerrado = angulos + angulos[:1]
    valores_cerrado = valores + valores[:1]

    fig = plt.figure(figsize=(7.8, 9.0), dpi=200)
    fig.patch.set_facecolor(SURFACE)
    ax = fig.add_axes((0.14, 0.155, 0.72, 0.72), polar=True)
    ax.set_facecolor(SURFACE)
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)

    # Bandas de severidad, con un hairline blanco entre cada una (surface gap)
    ring_gap = 0.6
    for i, bucket in enumerate(BUCKETS):
        bottom = i * 20
        height = 20 - (ring_gap if i < len(BUCKETS) - 1 else 0)
        ax.bar(
            0, height, width=2 * np.pi, bottom=bottom, color=COLOR_BANDA[bucket],
            alpha=ALPHA_BANDAS, zorder=0, edgecolor="none",
        )

    ax.set_ylim(0, 100)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    ax.set_yticklabels([])
    ax.spines["polar"].set_color(GRID)
    ax.spines["polar"].set_linewidth(1)
    ax.grid(color=GRID, linewidth=0.8, alpha=0.9)
    ax.set_xticks(angulos)
    ax.set_xticklabels([])

    # Línea y relleno de datos — azul de marca del documento, no negro
    ax.fill(angulos_cerrado, valores_cerrado, color=COLOR_MARCA, alpha=0.14, zorder=2)
    ax.plot(
        angulos_cerrado, valores_cerrado, color=COLOR_MARCA, linewidth=2.6, zorder=3,
        solid_capstyle="round",
    )
    ax.plot(
        angulos_cerrado, valores_cerrado, marker="o", markersize=9, markerfacecolor=COLOR_MARCA,
        markeredgecolor=SURFACE, markeredgewidth=2, linewidth=0, zorder=4,
    )

    # Nombres de criterio
    for ang, nombre in zip(angulos, nombres):
        ax.text(
            ang, 118, _wrap(nombre, 14), ha="center", va="center", fontsize=10.5, color=INK,
            fontweight="medium", linespacing=1.25, zorder=5, clip_on=False,
        )

    # Valores como badge, borde = color de severidad de ese punto
    for ang, valor in zip(angulos, valores):
        bucket = clasificar_bucket(valor)
        r_label = min(valor + 14, 96)
        ax.annotate(
            f"{valor:.0f}%", xy=(ang, r_label), ha="center", va="center", zorder=6,
            fontsize=10, fontweight="bold", color=INK,
            bbox=dict(
                boxstyle="round,pad=0.32", facecolor=SURFACE, edgecolor=COLOR_BANDA[bucket],
                linewidth=1.6,
            ),
            clip_on=False,
        )

    # Leyenda — chips en una fila
    leg_ax = fig.add_axes((0.06, 0.015, 0.88, 0.075))
    leg_ax.axis("off")
    n_bandas = len(BUCKETS)
    for i, bucket in enumerate(BUCKETS):
        x0 = i / n_bandas
        leg_ax.add_patch(
            mpatches.FancyBboxPatch(
                (x0 + 0.01, 0.35), 0.028, 0.28, boxstyle="round,pad=0,rounding_size=0.05",
                transform=leg_ax.transAxes, facecolor=COLOR_BANDA[bucket], edgecolor="none",
            )
        )
        leg_ax.text(
            x0 + 0.055, 0.49, ETIQUETA_POR_BUCKET.get(bucket, bucket), transform=leg_ax.transAxes,
            fontsize=8.8, color=INK_MUTED, va="center",
        )
        leg_ax.text(
            x0 + 0.055, 0.10, f"{i * 20}-{(i + 1) * 20}%", transform=leg_ax.transAxes,
            fontsize=7.6, color=INK_MUTED, va="center", alpha=0.8,
        )

    return _fig_a_bytes(fig)


# ---------------------------------------------------------------------------
# Figura 2 — dona de temas obligatorios / optativos
# ---------------------------------------------------------------------------
def generar_grafica_temas(num_obligatorios: int, num_optativos: int) -> bytes:
    """Se llama solo si `num_obligatorios + num_optativos > 0` (ver
    `generador.py::hay_temas`). Si un lado es 0, esa rebanada no se dibuja."""
    total = num_obligatorios + num_optativos
    if total <= 0:
        raise ValueError("Se requiere al menos un tema (obligatorio u optativo) para graficar")

    fig, ax = plt.subplots(figsize=(5.6, 5.6), dpi=200, subplot_kw={"aspect": "equal"})
    fig.patch.set_facecolor(SURFACE)

    valores, colores, nombres, conteos = [], [], [], []
    if num_obligatorios > 0:
        valores.append(num_obligatorios)
        colores.append(COLOR_OBLIGATORIO)
        nombres.append("Obligatorios")
        conteos.append(num_obligatorios)
    if num_optativos > 0:
        valores.append(num_optativos)
        colores.append(COLOR_OPTATIVO)
        nombres.append("Optativos")
        conteos.append(num_optativos)

    ax.pie(
        valores, colors=colores, wedgeprops={"width": 0.34, "edgecolor": SURFACE, "linewidth": 3},
        startangle=90, counterclock=False, radius=1.0,
    )

    ax.text(0, 0.10, f"{total}", ha="center", va="center", fontsize=40, fontweight="bold", color=INK)
    ax.text(0, -0.16, "temas identificados", ha="center", va="center", fontsize=10.5, color=INK_MUTED)

    leg_ax = fig.add_axes((0.05, 0.02, 0.9, 0.14))
    leg_ax.axis("off")
    n_items = len(nombres)
    for i, (nombre, color, conteo) in enumerate(zip(nombres, colores, conteos)):
        x0 = 0.5 / n_items * (2 * i + 1) - 0.20
        pct = round(100 * conteo / total)
        leg_ax.plot(
            [x0], [0.5], marker="o", markersize=11, markerfacecolor=color, markeredgecolor="none",
            transform=leg_ax.transAxes, clip_on=False,
        )
        leg_ax.text(
            x0 + 0.035, 0.5, nombre, transform=leg_ax.transAxes, fontsize=10.5, color=INK,
            va="center", fontweight="medium",
        )
        etiqueta_conteo = "tema" if conteo == 1 else "temas"
        leg_ax.text(
            x0 + 0.035, 0.12, f"{conteo} {etiqueta_conteo} · {pct}%", transform=leg_ax.transAxes,
            fontsize=8.6, color=INK_MUTED, va="center",
        )

    return _fig_a_bytes(fig)
