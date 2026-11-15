import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/panel/auth";
import { borrarEntrada } from "@/lib/panel/acciones-extra";
import { FormularioEntrada } from "@/components/panel/FormularioEntrada";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde } from "@/components/panel/estilos";

export default async function EditarEntrada({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const { sb } = await exigirAdmin();
  const { data: e } = await sb.from("entradas").select("*").eq("id", id).single();
  if (!e) notFound();
  return (
    <>
      <TituloPanel titulo={e.titulo} />
      {ok && <p className="mb-4 text-sm text-primary">Cambios guardados.</p>}
      {error && <p role="alert" className="mb-4 text-sm text-primary">Escribe un título.</p>}
      <div className="space-y-6">
        <FormularioEntrada e={e} />
        <form action={borrarEntrada}><input type="hidden" name="id" value={id} /><button className={botonBorde}>Borrar esta entrada</button></form>
      </div>
    </>
  );
}
