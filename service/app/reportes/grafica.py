import io

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np

from app.engine.models import ResultadoCriterio


def generar_grafica_radar(criterios: list[ResultadoCriterio]) -> bytes:
    """Radar de porcentaje de cumplimiento por criterio, como PNG en memoria.

    Con un solo criterio poblado (Etapa 4, mientras se cargan los Criterios
    2-5 en la Etapa 7) el resultado es un radar degenerado de un solo eje;
    es el comportamiento esperado para esta etapa.
    """
    if not criterios:
        raise ValueError("Se requiere al menos un criterio para generar la gráfica")

    etiquetas = [f"C{c.numero}. {c.nombre}" for c in criterios]
    valores = [c.porcentaje for c in criterios]

    num_ejes = len(criterios)
    angulos = np.linspace(0, 2 * np.pi, num_ejes, endpoint=False).tolist()
    valores_cerrado = valores + valores[:1]
    angulos_cerrado = angulos + angulos[:1]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw={"projection": "polar"})
    ax.plot(angulos_cerrado, valores_cerrado, color="#1d4ed8", linewidth=2)
    ax.fill(angulos_cerrado, valores_cerrado, color="#1d4ed8", alpha=0.25)
    ax.set_ylim(0, 100)
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_xticks(angulos)
    ax.set_xticklabels(etiquetas, fontsize=8)
    ax.set_title("Porcentaje de cumplimiento por criterio", pad=20)

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=150, bbox_inches="tight")
    plt.close(fig)
    buffer.seek(0)
    return buffer.getvalue()
