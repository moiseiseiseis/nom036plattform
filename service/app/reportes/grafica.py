import io
import textwrap

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Patch

from app.engine.models import ResultadoCriterio

# Paleta de severidad (0-20/20-40/.../80-100), validada para papel impreso
# (contraste sobre fondo blanco y separación perceptible con daltonismo —
# ver contenido/como-se-calculan-los-porcentajes.md para los cortes). Mismo
# concepto rojo->azul que el instrumento original y el formulario público,
# en tonos más oscuros/saturados porque aquí el color va sobre papel blanco,
# no como fondo de un botón.
COLOR_INEXISTENTE = "#b91c1c"
COLOR_MINIMO = "#eb6834"
COLOR_REGULAR = "#7a6900"
COLOR_ACEPTABLE = "#1baf7a"
COLOR_OPTIMO = "#2a78d6"

BANDAS_SEVERIDAD = (
    (0, 20, "Inexistente", COLOR_INEXISTENTE),
    (20, 40, "Mínimo", COLOR_MINIMO),
    (40, 60, "Regular", COLOR_REGULAR),
    (60, 80, "Aceptable", COLOR_ACEPTABLE),
    (80, 100, "Óptimo", COLOR_OPTIMO),
)

COLOR_LINEA_DATOS = "#0b0b0b"

COLOR_OBLIGATORIO = "#4a3aa7"
COLOR_OPTATIVO = "#898781"


def generar_grafica_radar(criterios: list[ResultadoCriterio]) -> bytes:
    """Radar de porcentaje de cumplimiento por criterio, como PNG en memoria.

    El fondo se pinta con las 5 franjas de severidad (mismo corte y colores
    que el resto del sistema) para que el lector ubique de un vistazo qué
    tan lejos está cada criterio de la siguiente franja, sin tener que leer
    la tabla de porcentajes aparte.

    Con un solo criterio poblado (Etapa 4, mientras se cargan los Criterios
    2-5 en la Etapa 7) el resultado es un radar degenerado de un solo eje;
    es el comportamiento esperado para esta etapa.
    """
    if not criterios:
        raise ValueError("Se requiere al menos un criterio para generar la gráfica")

    etiquetas = ["\n".join(textwrap.wrap(f"C{c.numero}. {c.nombre}", 28)) for c in criterios]
    valores = [c.porcentaje for c in criterios]

    num_ejes = len(criterios)
    angulos = np.linspace(0, 2 * np.pi, num_ejes, endpoint=False).tolist()
    valores_cerrado = valores + valores[:1]
    angulos_cerrado = angulos + angulos[:1]

    fig, ax = plt.subplots(figsize=(7.5, 8.5), subplot_kw={"projection": "polar"})
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)

    theta_bandas = np.linspace(0, 2 * np.pi, 200)
    for r_ini, r_fin, _etiqueta, color in BANDAS_SEVERIDAD:
        ax.fill_between(theta_bandas, r_ini, r_fin, color=color, alpha=0.16, zorder=0, linewidth=0)

    ax.plot(
        angulos_cerrado,
        valores_cerrado,
        color=COLOR_LINEA_DATOS,
        linewidth=2.5,
        marker="o",
        markersize=7,
        markerfacecolor="white",
        markeredgecolor=COLOR_LINEA_DATOS,
        markeredgewidth=2,
        zorder=3,
    )
    ax.fill(angulos_cerrado, valores_cerrado, color=COLOR_LINEA_DATOS, alpha=0.08, zorder=2)

    for angulo, valor in zip(angulos, valores):
        ax.annotate(
            f"{valor:.0f}%",
            xy=(angulo, valor),
            xytext=(0, 10),
            textcoords="offset points",
            ha="center",
            fontsize=10,
            fontweight="bold",
            color=COLOR_LINEA_DATOS,
            zorder=4,
        )

    ax.set_ylim(0, 100)
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_yticklabels(["20%", "40%", "60%", "80%", "100%"], fontsize=8, color="#52514e")
    ax.set_xticks(angulos)
    ax.set_xticklabels(etiquetas, fontsize=9)
    ax.tick_params(axis="x", pad=18)
    ax.spines["polar"].set_color("#c3c2b7")
    ax.grid(color="#e1e0d9")
    fig.suptitle(
        "Porcentaje de cumplimiento por criterio", y=0.98, fontsize=13, fontweight="bold"
    )

    leyenda = [
        Patch(facecolor=color, alpha=0.5, label=f"{ini}-{fin}% {etiqueta}")
        for ini, fin, etiqueta, color in BANDAS_SEVERIDAD
    ]
    ax.legend(
        handles=leyenda,
        loc="upper center",
        bbox_to_anchor=(0.5, -0.08),
        ncol=3,
        fontsize=8,
        frameon=False,
    )

    fig.subplots_adjust(top=0.78)
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=150, bbox_inches="tight")
    plt.close(fig)
    buffer.seek(0)
    return buffer.getvalue()


def generar_grafica_temas(num_obligatorios: int, num_optativos: int) -> bytes:
    """Gráfica de pastel con la proporción de temas de atención obligatoria
    frente a los de atención optativa (área de oportunidad global), como PNG
    en memoria. Pensada para que, de un vistazo, se entienda cuánto de lo
    señalado en el informe es una exigencia normativa y cuánto es una
    sugerencia de buena práctica.
    """
    total = num_obligatorios + num_optativos
    if total <= 0:
        raise ValueError("Se requiere al menos un tema (obligatorio u optativo) para graficar")

    valores = [v for v in (num_obligatorios, num_optativos) if v > 0]
    etiquetas = [
        etiqueta
        for etiqueta, v in (
            (f"Obligatorios ({num_obligatorios})", num_obligatorios),
            (f"Optativos ({num_optativos})", num_optativos),
        )
        if v > 0
    ]
    colores = [
        color
        for color, v in ((COLOR_OBLIGATORIO, num_obligatorios), (COLOR_OPTATIVO, num_optativos))
        if v > 0
    ]

    fig, ax = plt.subplots(figsize=(5, 5))
    ax.pie(
        valores,
        labels=etiquetas,
        colors=colores,
        autopct=lambda pct: f"{pct:.0f}%",
        pctdistance=0.75,
        wedgeprops={"width": 0.45, "edgecolor": "white", "linewidth": 2},
        textprops={"fontsize": 10, "color": "#0b0b0b"},
        startangle=90,
    )
    ax.set_title("Temas obligatorios vs. optativos", fontsize=13, fontweight="bold")
    ax.axis("equal")

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=150, bbox_inches="tight")
    plt.close(fig)
    buffer.seek(0)
    return buffer.getvalue()
