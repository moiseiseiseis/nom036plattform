"""Genera el SQL de contenido del instrumento a partir del documento revisado
por el Dr. Sergio (`retroalimentacion/criterios-valoraciones-separadas.md`).

El .md es la fuente de verdad del contenido: así no hay que transcribir a mano
250 descripciones y 250 recomendaciones, y cualquier corrección futura se hace
en el documento y se regenera el SQL.

Uso (desde la raíz del repo):
    python service/scripts/generar_sql_valoraciones.py

Escribe `supabase/content_v4_valoraciones_separadas.sql`. Actualiza los ítems
en su lugar (por criterio y número), no los borra, para no romper las
respuestas ya guardadas que apuntan a sus ids.
"""

import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ORIGEN = RAIZ / "retroalimentacion" / "criterios-valoraciones-separadas.md"
DESTINO = RAIZ / "supabase" / "content_v4_valoraciones_separadas.sql"

BUCKET_POR_FRANJA = {
    "Inexistente": "inexistente",
    "Mínimo": "minimo",
    "Regular": "regular",
    "Aceptable": "aceptable",
    "Óptimo": "optimo",
}

RE_CRITERIO = re.compile(r"^## Criterio (\d+) — (.+)$")
RE_ITEM = re.compile(r"^### Ítem (\d+)\.(\d+) — (.+) — (Obligatorio|Optativo)$")
RE_PREGUNTA = re.compile(r"^\*\*Pregunta:\*\* (.+)$")
RE_NIVEL = re.compile(r"^\| ([0-4]) — [^|]+ \| (.+) \| (.+) \|$")
RE_FRANJA = re.compile(r"^\| (Inexistente|Mínimo|Regular|Aceptable|Óptimo) \([^)]*\) \| (.+) \|$")


def _numeral(texto: str) -> str | None:
    if texto.startswith("Sin numeral"):
        return None
    return re.sub(r"^Numeral(es)? ", "", texto)


def parsear(md: str) -> list[dict]:
    criterios: list[dict] = []
    item: dict | None = None
    for linea in md.splitlines():
        linea = linea.rstrip()
        if m := RE_CRITERIO.match(linea):
            criterios.append({"numero": int(m[1]), "nombre": m[2], "items": [], "aperturas": {}})
            item = None
        elif m := RE_ITEM.match(linea):
            item = {
                "numero": int(m[2]),
                "numeral": _numeral(m[3]),
                "obligatorio": m[4] == "Obligatorio",
                "pregunta": None,
                "niveles": {},
            }
            criterios[-1]["items"].append(item)
        elif (m := RE_PREGUNTA.match(linea)) and item:
            item["pregunta"] = m[1]
        elif (m := RE_NIVEL.match(linea)) and item:
            item["niveles"][int(m[1])] = (m[2].strip(), m[3].strip())
        elif m := RE_FRANJA.match(linea):
            criterios[-1]["aperturas"][BUCKET_POR_FRANJA[m[1]]] = m[2].strip()
    return criterios


def validar(criterios: list[dict]) -> None:
    errores = []
    if [c["numero"] for c in criterios] != [1, 2, 3, 4, 5]:
        errores.append("se esperaban los criterios 1 a 5")
    for c in criterios:
        if [i["numero"] for i in c["items"]] != list(range(1, 11)):
            errores.append(f"criterio {c['numero']}: se esperaban los ítems 1 a 10")
        if set(c["aperturas"]) != set(BUCKET_POR_FRANJA.values()):
            errores.append(f"criterio {c['numero']}: faltan aperturas")
        for i in c["items"]:
            if not i["pregunta"]:
                errores.append(f"ítem {c['numero']}.{i['numero']}: sin pregunta")
            if set(i["niveles"]) != {0, 1, 2, 3, 4}:
                errores.append(f"ítem {c['numero']}.{i['numero']}: faltan niveles")
    if errores:
        sys.exit("Documento incompleto:\n  " + "\n  ".join(errores))


def q(texto: str | None) -> str:
    if texto is None:
        return "null"
    assert "$txt$" not in texto
    return f"$txt${texto}$txt$"


def generar_sql(criterios: list[dict]) -> str:
    out = [
        "-- GENERADO por service/scripts/generar_sql_valoraciones.py a partir de",
        "-- retroalimentacion/criterios-valoraciones-separadas.md — no editar a mano.",
        "--",
        "-- Contenido revisado por el Dr. Sergio (octubre de 2026) y decisiones del",
        "-- 2026-10-24 (retroalimentacion/pendientes-revision-dr-sergio.md, sección 0):",
        "-- texto de las preguntas, numeral NOM, obligatorio/optativo, descripción del",
        "-- nivel (formulario), recomendación (informe), apertura por franja y nombre",
        "-- de los criterios. Requiere la migración 20261024000001.",
        "",
        "begin;",
        "",
    ]
    for c in criterios:
        crit = f"(select c.id from nom036.criterio c where c.numero = {c['numero']})"
        out.append(f"-- Criterio {c['numero']} — {c['nombre']}")
        out.append(f"update nom036.criterio set nombre = {q(c['nombre'])} where numero = {c['numero']};")
        for i in c["items"]:
            item_id = (
                f"(select i.id from nom036.item i where i.criterio_id = {crit} "
                f"and i.numero = {i['numero']})"
            )
            out.append(
                f"update nom036.item set texto_pregunta = {q(i['pregunta'])}, "
                f"numeral_nom = {q(i['numeral'])}, "
                f"es_obligatorio = {'true' if i['obligatorio'] else 'false'} "
                f"where criterio_id = {crit} and numero = {i['numero']};"
            )
            for nivel, (descripcion, recomendacion) in sorted(i["niveles"].items()):
                out.append(
                    "insert into nom036.recomendacion (item_id, nivel, texto, descripcion_nivel) "
                    f"values ({item_id}, {nivel}, {q(recomendacion)}, {q(descripcion)}) "
                    "on conflict (item_id, nivel) do update "
                    "set texto = excluded.texto, descripcion_nivel = excluded.descripcion_nivel;"
                )
        out.append(f"delete from nom036.plantilla_bucket where criterio_id = {crit} and tipo = 'apertura';")
        for bucket, texto in c["aperturas"].items():
            out.append(
                "insert into nom036.plantilla_bucket (criterio_id, bucket, tipo, texto) "
                f"values ({crit}, '{bucket}', 'apertura', {q(texto)});"
            )
        out.append("")
    out.append("commit;")
    return "\n".join(out) + "\n"


def main() -> None:
    criterios = parsear(ORIGEN.read_text(encoding="utf-8"))
    validar(criterios)
    DESTINO.write_text(generar_sql(criterios), encoding="utf-8")
    total_items = sum(len(c["items"]) for c in criterios)
    print(f"{DESTINO.relative_to(RAIZ)}: {len(criterios)} criterios, {total_items} ítems")


if __name__ == "__main__":
    main()
