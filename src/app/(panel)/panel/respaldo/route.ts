import { exigirAdmin } from "@/lib/panel/auth";

export const dynamic = "force-dynamic";

const TABLAS = [
  "perfiles", "ajustes", "proyectos", "proyecto_media", "servicios", "diapositivas", "estadisticas", "hitos",
  "equipo", "certificaciones", "preguntas", "testimonios", "productos", "tarifas", "entradas",
  "cotizaciones", "visitas", "obras", "avances_obra", "documentos", "movimientos",
];

export async function GET() {
  const { sb } = await exigirAdmin();
  const tablas: Record<string, unknown[]> = {};

  for (const t of TABLAS) {
    const filas: unknown[] = [];
    for (let desde = 0; ; desde += 1000) {
      const { data, error } = await sb.from(t).select("*").range(desde, desde + 999);
      if (error || !data) break;
      filas.push(...data);
      if (data.length < 1000) break;
    }
    tablas[t] = filas;
  }

  const fecha = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify({ generado: new Date().toISOString(), tablas }, null, 1), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="jgl-respaldo-${fecha}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
