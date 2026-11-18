"""Genera el SQL con la ayuda de las preguntas del formulario público a partir
de `retroalimentacion/ayuda-preguntas.md` (la fuente de verdad: se corrige el
documento y se regenera el SQL, nunca a la inversa).

Uso (desde la raíz del repo):
    python service/scripts/generar_sql_ayuda.py

Escribe `supabase/content_v5_ayuda.sql`. Actualiza los ítems en su lugar, por
número de criterio y de ítem. Requiere la migración 20261117000001.
"""

import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ORIGEN = RAIZ / "retroalimentacion" / "ayuda-preguntas.md"
DESTINO = RAIZ / "supabase" / "content_v5_ayuda.sql"

RE_ITEM = re.compile(r"^### Ítem (\d+)\.(\d+)\s*$")
RE_DEFINICION = re.compile(r"^\*\*Definición:\*\* (.+)$")
RE_GUIA = re.compile(r"^\d+\. (.+)$")


def parsear(md: str) -> list[dict]:
    items: list[dict] = []
    for linea in md.splitlines():
        linea = linea.rstrip()
        if m := RE_ITEM.match(linea):
            items.append({"criterio": int(m[1]), "numero": int(m[2]), "definicion": None, "guia": []})
        elif not items:
            continue
        elif m := RE_DEFINICION.match(linea):
            items[-1]["definicion"] = m[1].strip()
        elif m := RE_GUIA.match(linea):
            items[-1]["guia"].append(m[1].strip())
    return items


def validar(items: list[dict]) -> None:
    esperados = [(c, n) for c in range(1, 6) for n in range(1, 11)]
    errores = []
    if [(i["criterio"], i["numero"]) for i in items] != esperados:
        errores.append("se esperaban los ítems 1.1 a 5.10, en orden")
    for i in items:
        clave = f"{i['criterio']}.{i['numero']}"
        if not i["definicion"]:
            errores.append(f"ítem {clave}: sin definición")
        if not 1 <= len(i["guia"]) <= 3:
            errores.append(f"ítem {clave}: se esperaban de 1 a 3 preguntas guía")
    if errores:
        sys.exit("Documento incompleto:\n  " + "\n  ".join(errores))


def q(texto: str) -> str:
    assert "$txt$" not in texto
    return f"$txt${texto}$txt$"


def generar_sql(items: list[dict]) -> str:
    out = [
        "-- GENERADO por service/scripts/generar_sql_ayuda.py a partir de",
        "-- retroalimentacion/ayuda-preguntas.md — no editar a mano.",
        "--",
        "-- Ayuda de las 50 preguntas del formulario público (definición y preguntas",
        "-- guía). Contenido de trabajo, pendiente de revisión del Dr. Sergio.",
        "-- Requiere la migración 20261117000001.",
        "",
        "begin;",
        "",
    ]
    for i in items:
        guia = "array[" + ", ".join(q(g) for g in i["guia"]) + "]::text[]"
        out.append(
            f"update nom036.item set ayuda_definicion = {q(i['definicion'])}, ayuda_preguntas_guia = {guia}\n"
            f"  where numero = {i['numero']} and criterio_id = "
            f"(select id from nom036.criterio where numero = {i['criterio']});"
        )
    out += ["", "commit;", ""]
    return "\n".join(out)


def main() -> None:
    items = parsear(ORIGEN.read_text(encoding="utf-8"))
    validar(items)
    DESTINO.write_text(generar_sql(items), encoding="utf-8", newline="\n")
    print(f"{DESTINO.relative_to(RAIZ)}: {len(items)} ítems")


if __name__ == "__main__":
    main()
