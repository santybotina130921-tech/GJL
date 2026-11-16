import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/panel/auth";
import { borrarObra } from "@/lib/panel/acciones-extra";
import { urlSitio } from "@/lib/codigos";
import { EnlaceObra } from "@/components/panel/EnlaceObra";
import { PedirCalificacion } from "@/components/panel/PedirCalificacion";
import { FormularioObra } from "@/components/panel/FormularioObra";
import { GestorAvances } from "@/components/panel/GestorAvances";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde } from "@/components/panel/estilos";

export default async function EditarObra({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const { sb } = await exigirAdmin();
  const { data: o } = await sb.from("obras").select("*").eq("id", id).single();
  if (!o) notFound();
  const { data: avances } = await sb
    .from("avances_obra")
    .select("id,nota,foto_url,fecha")
    .eq("obra_id", id)
    .order("fecha", { ascending: false })
    .order("creado_en", { ascending: false });

  return (
    <>
      <TituloPanel titulo={o.nombre} ayuda={`Obra de ${o.cliente}. Comparte el enlace y publica avances con fotos.`} />
      {ok && <p className="mb-4 text-sm text-primary">Cambios guardados.</p>}
      {error && <p role="alert" className="mb-4 text-sm text-primary">Revisa los datos de la obra.</p>}
      <div className="space-y-10">
        <EnlaceObra id={id} codigo={o.codigo} base={await urlSitio()} whatsapp={o.cliente_whatsapp} nombre={o.nombre} cliente={o.cliente} />
        {o.estado === "terminada" && <PedirCalificacion codigo={o.codigo} base={await urlSitio()} whatsapp={o.cliente_whatsapp} cliente={o.cliente} nombre={o.nombre} />}
        <FormularioObra obra={o} />
        <section>
          <h2 className="mb-3 font-display text-2xl uppercase">Avances (lo que ve el cliente)</h2>
          <GestorAvances obraId={id} avances={avances ?? []} />
        </section>
        <form action={borrarObra}>
          <input type="hidden" name="id" value={id} />
          <button className={botonBorde}>Borrar esta obra</button>
        </form>
      </div>
    </>
  );
}
