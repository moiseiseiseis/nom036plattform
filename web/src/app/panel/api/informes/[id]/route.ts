import { NextResponse, type NextRequest } from "next/server";
import { descargarInformeDocx } from "@/lib/informes";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const revision = req.nextUrl.searchParams.get("revision") !== "false";
  const respuesta = await descargarInformeDocx(id, { revision });

  if (!respuesta.ok) {
    return NextResponse.json(
      { error: "No se pudo generar el informe" },
      { status: respuesta.status }
    );
  }

  const sufijo = revision ? "revision" : "final";
  const contenido = await respuesta.arrayBuffer();
  return new NextResponse(contenido, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":
        respuesta.headers.get("content-disposition") ??
        `attachment; filename="informe-${id}-${sufijo}.docx"`,
    },
  });
}
