from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.db import get_connection
from app.reportes import EvaluacionNoEncontrada, calcular_resultados, fetch_datos_evaluacion, generar_informe

router = APIRouter(prefix="/informes", tags=["informes"])


@router.get("/{evaluacion_id}/resumen")
def resumen_informe(evaluacion_id: str) -> dict:
    """Resultados calculados (sin generar el .docx), para que el panel
    privado pueda mostrar una vista previa antes de aprobar/descargar."""
    try:
        with get_connection() as conn:
            datos = fetch_datos_evaluacion(conn, evaluacion_id)
        resultados, resultado_global = calcular_resultados(datos)
    except EvaluacionNoEncontrada as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "evaluacion_id": datos.evaluacion_id,
        "empresa_nombre": datos.empresa_nombre,
        "criterios": [
            {
                "numero": r.numero,
                "nombre": r.nombre,
                "puntaje": r.puntaje,
                "puntaje_maximo": r.puntaje_maximo,
                "porcentaje": round(r.porcentaje, 1),
                "bucket": r.bucket,
                "narrativa": r.narrativa,
            }
            for r in resultados
        ],
        "global": {
            "puntaje": resultado_global.puntaje,
            "puntaje_maximo": resultado_global.puntaje_maximo,
            "porcentaje": round(resultado_global.porcentaje, 1),
            "bucket": resultado_global.bucket,
            "cierre": resultado_global.cierre,
            "temas_obligatorios": resultado_global.temas_obligatorios,
            "temas_optativos": resultado_global.temas_optativos,
        },
    }


@router.get("/{evaluacion_id}")
def descargar_informe(evaluacion_id: str) -> Response:
    try:
        contenido = generar_informe(evaluacion_id)
    except EvaluacionNoEncontrada as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return Response(
        content=contenido,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="informe-{evaluacion_id}.docx"'},
    )
