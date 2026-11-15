import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/panel/auth";
import { borrarProyecto } from "@/lib/panel/acciones";
import { FormularioProyecto } from "@/components/panel/FormularioProyecto";
import { GestorMedia } from "@/components/panel/GestorMedia";
import { AntesDespuesEditor } from "@/components/panel/AntesDespuesEditor";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde } from "@/components/panel/estilos";

export default async function EditarProyecto({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const { sb } = await exigirAdmin();
  const { data: p } = await sb.from("proyectos").select("*").eq("id", id).single();
  if (!p) notFound();
  const { data: media } = await sb
    .from("proyecto_media")
    .select("id,tipo,url,es_portada")
    .eq("proyecto_id", id)
    .order("orden")
    .order("id");

  return (
    <>
      <TituloPanel titulo={p.titulo} ayuda="Edita los datos, sube fotos y videos y publica el proyecto." />
      {ok && <p className="mb-4 text-sm text-primary">Cambios guardados.</p>}
      {error && <p role="alert" className="mb-4 text-sm text-primary">Escribe un título.</p>}
      <div className="space-y-8">
        <FormularioProyecto p={p} />
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold uppercase">Fotos y videos</h2>
          <GestorMedia proyectoId={id} media={media ?? []} />
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold uppercase">Antes y después</h2>
          <AntesDespuesEditor id={id} antes={p.antes_url ?? ""} despues={p.despues_url ?? ""} />
        </section>
        <form action={borrarProyecto}>
          <input type="hidden" name="id" value={id} />
          <button className={botonBorde}>Borrar este proyecto</button>
        </form>
      </div>
    </>
  );
}
