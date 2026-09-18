import "server-only";
import { randomBytes } from "node:crypto";
import { sql } from "@/lib/db";
import type { Empresa, EstadoEvaluacion, EvaluacionResumen } from "./types";

export async function listarEvaluaciones(): Promise<EvaluacionResumen[]> {
  return sql<EvaluacionResumen[]>`
    select e.id, e.token_publico, e.estado, e.fecha, emp.nombre as empresa_nombre
    from nom036.evaluacion e
    join nom036.empresa emp on emp.id = e.empresa_id
    order by e.fecha desc
  `;
}

function generarToken(): string {
  return randomBytes(18).toString("base64url");
}

export async function crearEvaluacion(nombreEmpresa: string): Promise<{ token: string }> {
  const token = generarToken();

  await sql.begin(async (tx) => {
    const empresas = await tx<{ id: string }[]>`
      insert into nom036.empresa (nombre)
      values (${nombreEmpresa})
      returning id
    `;
    await tx`
      insert into nom036.evaluacion (empresa_id, token_publico, estado)
      values (${empresas[0].id}, ${token}, 'pendiente')
    `;
  });

  return { token };
}

export interface EvaluacionDetallePanel {
  id: string;
  token_publico: string;
  estado: EstadoEvaluacion;
  fecha: string;
  empresa: Empresa;
}

export async function getEvaluacionDetallePanel(
  id: string
): Promise<EvaluacionDetallePanel | null> {
  const rows = await sql<
    {
      id: string;
      token_publico: string;
      estado: EstadoEvaluacion;
      fecha: string;
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
      e.id, e.token_publico, e.estado, e.fecha,
      emp.id as empresa_id, emp.nombre, emp.ubicacion, emp.giro,
      emp.num_trabajadores, emp.turnos, emp.descripcion_mmh
    from nom036.evaluacion e
    join nom036.empresa emp on emp.id = e.empresa_id
    where e.id = ${id}
    limit 1
  `;

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    token_publico: row.token_publico,
    estado: row.estado,
    fecha: row.fecha,
    empresa: {
      id: row.empresa_id,
      nombre: row.nombre,
      ubicacion: row.ubicacion,
      giro: row.giro,
      num_trabajadores: row.num_trabajadores,
      turnos: row.turnos,
      descripcion_mmh: row.descripcion_mmh,
    },
  };
}

export async function eliminarEvaluacion(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  // `respuesta.evaluacion_id` tiene ON DELETE CASCADE (supabase/migrations) — borrar la
  // evaluación se lleva sus respuestas sin necesidad de un delete aparte. La empresa no se
  // toca (puede tener otras evaluaciones, o quedarse sin ninguna; eso no es un error).
  const resultado = await sql`
    delete from nom036.evaluacion
    where id = ${id}
  `;

  if (resultado.count === 0) {
    return { ok: false, error: "La evaluación no existe." };
  }
  return { ok: true };
}

export async function marcarRevisado(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const resultado = await sql`
    update nom036.evaluacion
    set estado = 'revisado'
    where id = ${id} and estado = 'completado'
  `;

  if (resultado.count === 0) {
    return { ok: false, error: "La evaluación no existe o no está en estado 'completado'." };
  }
  return { ok: true };
}
