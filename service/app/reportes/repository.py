import psycopg

from app.engine.models import RespuestaItem
from .models import DatosCriterio, DatosEvaluacion


class EvaluacionNoEncontrada(Exception):
    pass


def fetch_datos_evaluacion(conn: psycopg.Connection, evaluacion_id: str) -> DatosEvaluacion:
    with conn.cursor() as cur:
        cur.execute(
            """
            select e.id, e.token_publico, e.estado,
                   emp.nombre, emp.ubicacion, emp.giro, emp.num_trabajadores,
                   emp.turnos, emp.descripcion_mmh
            from nom036.evaluacion e
            join nom036.empresa emp on emp.id = e.empresa_id
            where e.id = %s
            """,
            (evaluacion_id,),
        )
        evaluacion = cur.fetchone()
        if evaluacion is None:
            raise EvaluacionNoEncontrada(f"No existe la evaluación {evaluacion_id}")

        cur.execute(
            """
            select id, numero, nombre
            from nom036.criterio
            order by orden
            """
        )
        criterios_rows = cur.fetchall()

        criterios: list[DatosCriterio] = []
        for criterio in criterios_rows:
            cur.execute(
                """
                select i.id as item_id, i.numero, i.es_obligatorio, r.nivel_seleccionado
                from nom036.item i
                join nom036.respuesta r
                  on r.item_id = i.id and r.evaluacion_id = %s
                where i.criterio_id = %s
                order by i.numero
                """,
                (evaluacion_id, criterio["id"]),
            )
            respuestas_rows = cur.fetchall()
            if not respuestas_rows:
                # Esta evaluación no respondió este criterio (ej. solo existe
                # contenido/relevancia para el Criterio 1 en esta etapa).
                continue

            respuestas = [
                RespuestaItem(
                    item_id=str(row["item_id"]),
                    numero=row["numero"],
                    nivel=row["nivel_seleccionado"],
                    es_obligatorio=row["es_obligatorio"],
                )
                for row in respuestas_rows
            ]

            cur.execute(
                """
                select rec.item_id, rec.nivel, rec.texto
                from nom036.recomendacion rec
                join nom036.item i on i.id = rec.item_id
                where i.criterio_id = %s
                """,
                (criterio["id"],),
            )
            recomendaciones = {
                (str(row["item_id"]), row["nivel"]): row["texto"] for row in cur.fetchall()
            }

            cur.execute(
                """
                select bucket, texto
                from nom036.plantilla_bucket
                where criterio_id = %s and tipo = 'apertura'
                """,
                (criterio["id"],),
            )
            plantillas_apertura = {row["bucket"]: row["texto"] for row in cur.fetchall()}

            criterios.append(
                DatosCriterio(
                    id=str(criterio["id"]),
                    numero=criterio["numero"],
                    nombre=criterio["nombre"],
                    respuestas=respuestas,
                    recomendaciones=recomendaciones,
                    plantillas_apertura=plantillas_apertura,
                )
            )

        cur.execute(
            """
            select bucket, texto
            from nom036.plantilla_bucket
            where criterio_id is null and tipo = 'cierre'
            """
        )
        plantillas_cierre_global = {row["bucket"]: row["texto"] for row in cur.fetchall()}

    return DatosEvaluacion(
        evaluacion_id=str(evaluacion["id"]),
        token_publico=evaluacion["token_publico"],
        estado=evaluacion["estado"],
        empresa_nombre=evaluacion["nombre"],
        empresa_ubicacion=evaluacion["ubicacion"],
        empresa_giro=evaluacion["giro"],
        empresa_num_trabajadores=evaluacion["num_trabajadores"],
        empresa_turnos=evaluacion["turnos"],
        empresa_descripcion_mmh=evaluacion["descripcion_mmh"],
        criterios=criterios,
        plantillas_cierre_global=plantillas_cierre_global,
    )
