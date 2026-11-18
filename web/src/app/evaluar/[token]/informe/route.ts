import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { descargarInformeDocx } from "@/lib/informes";

/**
 * Informe PRELIMINAR para la empresa que acaba de responder: el mismo
 * enlace único es la credencial, igual que para el formulario. Solo existe
 * una vez enviada la autoevaluación. El oficial (revisado y firmado) lo
 * descarga el equipo desde el panel.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const filas = await sql<{ id: string; estado: string }[]>`
    select id, estado from nom036.evaluacion where token_publico = ${token} limit 1
  `;
  const evaluacion = filas[0];
  if (!evaluacion) {
    return NextResponse.json({ error: "Enlace no válido" }, { status: 404 });
  }
  if (evaluacion.estado === "pendiente") {
    return NextResponse.json({ error: "La autoevaluación aún no se ha enviado" }, { status: 409 });
  }

  const respuesta = await descargarInformeDocx(evaluacion.id, { revision: false, preliminar: true });
  if (!respuesta.ok) {
    return NextResponse.json({ error: "No se pudo generar el informe" }, { status: 502 });
  }

  return new NextResponse(await respuesta.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":
        respuesta.headers.get("content-disposition") ??
        'attachment; filename="Informe-prediagnostico-empresarial-PRELIMINAR.docx"',
      "Cache-Control": "no-store",
    },
  });
}
