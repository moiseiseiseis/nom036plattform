import "server-only";
import { sql } from "@/lib/db";
import type { DatosGeneralesInput, EvaluacionConDetalle, Item } from "./types";

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

  const items = await sql<Item[]>`
    select i.id, i.numero, i.texto_pregunta
    from nom036.item i
    join nom036.criterio c on c.id = i.criterio_id
    where c.numero = 1
    order by i.numero
  `;

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
    items_criterio1: items,
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

    for (const r of respuestas) {
      await tx`
        insert into nom036.respuesta (evaluacion_id, item_id, nivel_seleccionado)
        values (${evaluacion.id}, ${r.item_id}, ${r.nivel})
      `;
    }

    await tx`
      update nom036.evaluacion
      set estado = 'completado'
      where id = ${evaluacion.id}
    `;

    return { ok: true };
  });
}
