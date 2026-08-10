from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.reportes import EvaluacionNoEncontrada, generar_informe

router = APIRouter(prefix="/informes", tags=["informes"])


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
