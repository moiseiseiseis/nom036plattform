# -*- coding: utf-8 -*-
"""
service/app/reportes/grafica.py — versión rediseñada

Reemplaza las dos funciones de generación de gráficas (`generar_grafica_radar`,
`generar_grafica_temas`). Firma y contrato de salida sin cambios respecto al
código actual: reciben los datos ya calculados por el motor y devuelven PNG en
memoria (bytes), listos para `docxtpl.InlineImage`. No tocan la base de datos.

Cambios de diseño respecto a la versión anterior (aprobados en revisión):
  - Tipografía Carlito (compatible en métricas con la Calibri del cuerpo del
    .docx) en vez de la DejaVu Sans por defecto de matplotlib.
  - El polígono/línea de datos del radar usa el azul de marca del documento
    (COLOR_MARCA) en vez de negro — antes la gráfica no tenía ninguna relación
    visual con el resto del informe.
  - Bandas de severidad más saturadas que en el primer mockup (alpha subida de
    0.13 a 0.24 — el mockup se sentía "disuelto"), con un hairline blanco entre
    cada franja para que seis lean como franjas discretas, no una mancha.
  - Valores como "badge": pastilla blanca con borde del color de severidad de
    ese punto — reemplaza el texto plano flotando y evita el traslape con la
    leyenda que estaba en la lista de pendientes (sección 6 del documento de
    hallazgos).
  - Dona: KPI central (total de temas) en vez de espacio vacío; leyenda con
    conteo + porcentaje debajo en vez de etiquetas flotando sobre el pastel.
  - Los hex de color NO cambiaron — siguen viniendo de estilos.py, misma
    fuente de verdad que usa la Tabla 2 del .docx.

IMPORTANTE — fuente Carlito en producción:
  Este entorno de desarrollo tiene Carlito preinstalada (paquete
  `fonts-crosextra-carlito`, común en distros basadas en Chrome OS / algunas
  imágenes de Linux Desktop), pero un contenedor de Railway "pelón" casi
  seguro NO la trae. Dos opciones, en orden de preferencia:
    1) Bundlear el .ttf con el repo (recomendado — no depende del SO del
       contenedor): descarga Carlito-Regular.ttf / Carlito-Bold.ttf (SIL Open
       Font License, se consiguen en Google Fonts o el paquete crosextra) y
       colócalos en `service/app/reportes/fonts/`. El código de abajo ya
       busca ahí primero.
    2) Instalar `fonts-crosextra-carlito` en el Dockerfile del microservicio.
  Si no encuentra el archivo, cae a DejaVu Sans con un warning en el log —
  nunca truena el request, pero sí se pierde la consistencia tipográfica con
  Calibri, así que vale la pena confirmar que el .ttf viaja con el deploy.
"""
from __future__ import annotations

import io
import logging
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

from .estilos import COLOR_POR_BUCKET, ETIQUETA_POR_BUCKET  # fuente de verdad existente

try:
    from .estilos import COLOR_OBLIGATORIO_HEX, COLOR_OPTATIVO_HEX
except ImportError:  # por si el nombre exacto difiere en tu estilos.py actual
    COLOR_OBLIGATORIO_HEX = "#4A3AA7"
    COLOR_OPTATIVO_HEX = "#898781"

try:
    # Recomendado: mover esta constante a estilos.py junto a las demás, para
    # que quede en la misma fuente de verdad que ya usa el resto del .docx.
    from .estilos import COLOR_MARCA
except ImportError:
    COLOR_MARCA = "#2E5C8A"  # azul primario del documento (memoria del proyecto)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Tipografía
# ---------------------------------------------------------------------------
_FONT_DIR_CANDIDATES = [
    Path(__file__).parent / "fonts",              # bundleada con el repo (recomendado)
    Path("/usr/share/fonts/truetype/crosextra"),   # paquete fonts-crosextra-carlito
]
_FONT_FAMILY = "DejaVu Sans"  # fallback si no se encuentra Carlito


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
        "inconsistente con la Calibri del cuerpo del .docx.",
        ", ".join(str(d) for d in _FONT_DIR_CANDIDATES),
    )
    return "DejaVu Sans"


_FONT_FAMILY = _registrar_fuente_carlito()
plt.rcParams["font.family"] = _FONT_FAMILY
plt.rcParams["axes.unicode_minus"] = False

# ---------------------------------------------------------------------------
# Tokens visuales
# ---------------------------------------------------------------------------
BUCKETS = list(COLOR_POR_BUCKET.keys())
INK = "#1F2430"        # texto principal (no negro puro)
INK_MUTED = "#6B7280"  # texto secundario / ejes
GRID = "#E4E4E1"       # gris recesivo para líneas de referencia
SURFACE = "#FFFFFF"

# Saturación de las bandas de severidad. 0.13 (primer mockup) se sentía
# "disuelto"; 0.24 mantiene la línea de datos legible encima y se ve más vivo.
# Súbelo/bájalo aquí si al imprimir se ve muy fuerte o muy pálido — es el
# único número que controla ese balance.
ALPHA_BANDAS = 0.24


def _bucket_de(pct: float) -> str:
    idx = min(int(pct // 20), len(BUCKETS) - 1)
    return BUCKETS[idx]


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
def generar_grafica_radar(resultados_criterio) -> bytes:
    """
    resultados_criterio: iterable de objetos con `.nombre` (str) y
    `.porcentaje` (float, 0-100) — mismo contrato que la versión actual
    (ResultadoCriterio). Con un solo criterio disponible (etapa piloto),
    dibuja un radar de un solo eje: es el comportamiento esperado mientras
    se cargan los Criterios 2-5, no un caso a corregir en esta función.
    """
    criterios = [r.nombre for r in resultados_criterio]
    valores = [float(r.porcentaje) for r in resultados_criterio]
    n = len(criterios)

    angles = [i / n * 2 * np.pi for i in range(n)]
    angles += angles[:1]
    vals = valores + valores[:1]

    fig = plt.figure(figsize=(7.8, 9.0), dpi=200)
    fig.patch.set_facecolor(SURFACE)
    ax = fig.add_axes([0.14, 0.155, 0.72, 0.72], polar=True)
    ax.set_facecolor(SURFACE)
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)

    # Bandas de severidad, con un hairline blanco entre cada una (surface gap)
    ring_gap = 0.6
    for i, b in enumerate(BUCKETS):
        bottom = i * 20
        height = 20 - (ring_gap if i < len(BUCKETS) - 1 else 0)
        ax.bar(0, height, width=2 * np.pi, bottom=bottom, color=COLOR_POR_BUCKET[b],
               alpha=ALPHA_BANDAS, zorder=0, edgecolor="none")

    ax.set_ylim(0, 100)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    ax.set_yticklabels([])
    ax.spines["polar"].set_color(GRID)
    ax.spines["polar"].set_linewidth(1)
    ax.grid(color=GRID, linewidth=0.8, alpha=0.9)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels([])

    # Línea y relleno de datos — azul de marca, no negro
    ax.fill(angles, vals, color=COLOR_MARCA, alpha=0.14, zorder=2)
    ax.plot(angles, vals, color=COLOR_MARCA, linewidth=2.6, zorder=3, solid_capstyle="round")
    ax.plot(angles, vals, marker="o", markersize=9, markerfacecolor=COLOR_MARCA,
            markeredgecolor=SURFACE, markeredgewidth=2, linewidth=0, zorder=4)

    # Nombres de criterio
    for ang, nombre in zip(angles[:-1], criterios):
        ax.text(ang, 118, _wrap(nombre, 14), ha="center", va="center",
                fontsize=10.5, color=INK, fontweight="medium", linespacing=1.25,
                zorder=5, clip_on=False)

    # Valores como badge, borde = color de severidad de ese punto
    for ang, v in zip(angles[:-1], valores):
        b = _bucket_de(v)
        r_label = min(v + 14, 96)
        ax.annotate(
            f"{v:.0f}%", xy=(ang, r_label), ha="center", va="center", zorder=6,
            fontsize=10, fontweight="bold", color=INK,
            bbox=dict(boxstyle="round,pad=0.32", facecolor=SURFACE,
                      edgecolor=COLOR_POR_BUCKET[b], linewidth=1.6),
            clip_on=False,
        )

    # Leyenda — chips en una fila
    leg_ax = fig.add_axes([0.06, 0.015, 0.88, 0.075])
    leg_ax.axis("off")
    n_b = len(BUCKETS)
    for i, b in enumerate(BUCKETS):
        x0 = i / n_b
        leg_ax.add_patch(matplotlib.patches.FancyBboxPatch(
            (x0 + 0.01, 0.35), 0.028, 0.28,
            boxstyle="round,pad=0,rounding_size=0.05",
            transform=leg_ax.transAxes,
            facecolor=COLOR_POR_BUCKET[b], edgecolor="none"))
        leg_ax.text(x0 + 0.055, 0.49, ETIQUETA_POR_BUCKET.get(b, b), transform=leg_ax.transAxes,
                    fontsize=8.8, color=INK_MUTED, va="center")
        leg_ax.text(x0 + 0.055, 0.10, f"{i * 20}-{(i + 1) * 20}%", transform=leg_ax.transAxes,
                    fontsize=7.6, color=INK_MUTED, va="center", alpha=0.8)

    return _fig_a_bytes(fig)


# ---------------------------------------------------------------------------
# Figura 2 — dona de temas obligatorios / optativos
# ---------------------------------------------------------------------------
def generar_grafica_temas(num_obligatorios: int, num_optativos: int) -> bytes:
    """
    Mismo contrato que la versión actual: se llama solo si
    num_obligatorios + num_optativos > 0 (ver generador.py::hay_temas). Si un
    lado es 0, esa rebanada no se dibuja.
    """
    total = num_obligatorios + num_optativos

    fig, ax = plt.subplots(figsize=(5.6, 5.6), dpi=200, subplot_kw={"aspect": "equal"})
    fig.patch.set_facecolor(SURFACE)

    vals, colors, names, counts = [], [], [], []
    if num_obligatorios > 0:
        vals.append(num_obligatorios); colors.append(COLOR_OBLIGATORIO_HEX)
        names.append("Obligatorios"); counts.append(num_obligatorios)
    if num_optativos > 0:
        vals.append(num_optativos); colors.append(COLOR_OPTATIVO_HEX)
        names.append("Optativos"); counts.append(num_optativos)

    ax.pie(vals, colors=colors, wedgeprops={"width": 0.34, "edgecolor": SURFACE, "linewidth": 3},
           startangle=90, counterclock=False, radius=1.0)

    ax.text(0, 0.10, f"{total}", ha="center", va="center", fontsize=40, fontweight="bold", color=INK)
    ax.text(0, -0.16, "temas identificados", ha="center", va="center", fontsize=10.5, color=INK_MUTED)

    leg_ax = fig.add_axes([0.05, 0.02, 0.9, 0.14])
    leg_ax.axis("off")
    n_items = len(names)
    for i, (nombre, c, col) in enumerate(zip(names, counts, colors)):
        x0 = 0.5 / n_items * (2 * i + 1) - 0.20
        pct = round(100 * c / total)
        leg_ax.plot([x0], [0.5], marker="o", markersize=11, markerfacecolor=col,
                    markeredgecolor="none", transform=leg_ax.transAxes, clip_on=False)
        leg_ax.text(x0 + 0.035, 0.5, nombre, transform=leg_ax.transAxes, fontsize=10.5,
                    color=INK, va="center", fontweight="medium")
        leg_ax.text(x0 + 0.035, 0.12, f"{c} temas · {pct}%", transform=leg_ax.transAxes,
                    fontsize=8.6, color=INK_MUTED, va="center")

    return _fig_a_bytes(fig)
