import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/panel/auth";
import { TABLAS } from "@/lib/panel/tablas";
import { ColeccionEditable } from "@/components/panel/ColeccionEditable";
import { TituloPanel } from "@/components/panel/TituloPanel";

export default async function Contenido({ params }: { params: Promise<{ tabla: string }> }) {
  const { tabla } = await params;
  const cfg = TABLAS[tabla];
  if (!cfg) notFound();
  const { sb } = await exigirAdmin();
  const { data } = await sb.from(tabla).select("*").order("orden");
  return (
    <>
      <TituloPanel titulo={cfg.titulo} ayuda={cfg.ayuda} />
      <ColeccionEditable tabla={tabla} filas={data ?? []} />
    </>
  );
}
