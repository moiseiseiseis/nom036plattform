import "server-only";
import { sql } from "@/lib/db";
import type { CriterioConItems, DatosGeneralesInput, EvaluacionConDetalle } from "./types";

export async function getEvaluacionPorToken(
  token: string
): Promise<EvaluacionConDetalle | null> {
  const evaluaciones = await sql<
    {
      id: string;
      token_publico: string;
      estado: EvaluacionConDetalle["estado"];
      empresa_id: string;
      nombre: string;
      ubicacion: string | null;
      giro: string | null;
      num_trabajadores: number | null;
      turnos: string | null;
      descripcion_mmh: string | null;
    }[]
  >`
    select
      e.id, e.token_publico, e.estado,
      emp.id as empresa_id, emp.nombre, emp.ubicacion, emp.giro,
      emp.num_trabajadores, emp.turnos, emp.descripcion_mmh
    from nom036.evaluacion e
    join nom036.empresa emp on emp.id = e.empresa_id
    where e.token_publico = ${token}
    limit 1
  `;

  const evaluacion = evaluaciones[0];
  if (!evaluacion) return null;

  const filas = await sql<
    {
      criterio_numero: number;
      criterio_nombre: string;
      id: string;
      numero: number;
      texto_pregunta: string;
      niveles: { nivel: number; descripcion: string | null }[] | null;
    }[]
  >`
    select c.numero as criterio_numero, c.nombre as criterio_nombre,
           i.id, i.numero, i.texto_pregunta,
           (select json_agg(json_build_object('nivel', r.nivel, 'descripcion', r.descripcion_nivel)
                            order by r.nivel)
            from nom036.recomendacion r
            where r.item_id = i.id) as niveles
    from nom036.item i
    join nom036.criterio c on c.id = i.criterio_id
    order by c.orden, i.numero
  `;

  const criterios: CriterioConItems[] = [];
  for (const fila of filas) {
    let criterio = criterios.find((c) => c.numero === fila.criterio_numero);
    if (!criterio) {
      criterio = { numero: fila.criterio_numero, nombre: fila.criterio_nombre, items: [] };
      criterios.push(criterio);
    }
    // Siempre los 5 niveles, aunque falte alguna fila de contenido: el
    // formulario no debe quedarse sin una opción de respuesta.
    const niveles = [0, 1, 2, 3, 4].map((nivel) => ({
      nivel,
      descripcion: fila.niveles?.find((n) => n.nivel === nivel)?.descripcion ?? null,
    }));
    criterio.items.push({
      id: fila.id,
      numero: fila.numero,
      texto_pregunta: fila.texto_pregunta,
      niveles,
    });
  }

  return {
    id: evaluacion.id,
    token_publico: evaluacion.token_publico,
    estado: evaluacion.estado,
    empresa: {
      id: evaluacion.empresa_id,
      nombre: evaluacion.nombre,
      ubicacion: evaluacion.ubicacion,
      giro: evaluacion.giro,
      num_trabajadores: evaluacion.num_trabajadores,
      turnos: evaluacion.turnos,
      descripcion_mmh: evaluacion.descripcion_mmh,
    },
    criterios,
  };
}

export async function guardarEvaluacion(
  token: string,
  datosGenerales: DatosGeneralesInput,
  respuestas: { item_id: string; nivel: number }[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  return sql.begin(async (tx) => {
    const evaluaciones = await tx<
      { id: string; empresa_id: string; estado: string }[]
    >`
      select id, empresa_id, estado
      from nom036.evaluacion
      where token_publico = ${token}
      for update
    `;
    const evaluacion = evaluaciones[0];
    if (!evaluacion) {
      return { ok: false, error: "Evaluación no encontrada." };
    }
    if (evaluacion.estado !== "pendiente") {
      return { ok: false, error: "Esta evaluación ya fue enviada." };
    }

    await tx`
      update nom036.empresa
      set ubicacion = ${datosGenerales.ubicacion},
          giro = ${datosGenerales.giro},
          num_trabajadores = ${datosGenerales.num_trabajadores},
          turnos = ${datosGenerales.turnos},
          descripcion_mmh = ${datosGenerales.descripcion_mmh}
      where id = ${evaluacion.empresa_id}
    `;

    // Un solo insert para los 50 ítems: a través del pooler, 50 viajes
    // separados alargaban el envío varios segundos.
    const filas = respuestas.map((r) => ({
      evaluacion_id: evaluacion.id,
      item_id: r.item_id,
      nivel_seleccionado: r.nivel,
    }));
    await tx`
      insert into nom036.respuesta ${tx(filas, "evaluacion_id", "item_id", "nivel_seleccionado")}
    `;

    await tx`
      update nom036.evaluacion
      set estado = 'completado'
      where id = ${evaluacion.id}
    `;

    return { ok: true };
  });
}
