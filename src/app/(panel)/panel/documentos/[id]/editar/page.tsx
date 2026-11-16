import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/panel/auth";
import { EditorDocumento, type DocInicial } from "@/components/panel/EditorDocumento";
import { TituloPanel } from "@/components/panel/TituloPanel";

export default async function EditarDocumento({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("documentos").select("*").eq("id", id).single();
  if (!data) notFound();

  const inicial: DocInicial = {
    id,
    tipo: data.tipo,
    numero: data.numero,
    fecha: data.fecha,
    prestador: data.prestador,
    identificacion: data.identificacion,
    cliente: data.cliente,
    cliente_whatsapp: data.cliente_whatsapp,
    concepto: data.concepto,
    items: data.items,
    iva: Number(data.iva),
    forma_pago: data.forma_pago,
    cuenta: data.cuenta,
    titular: data.titular,
    validez: data.validez,
    entrega: data.entrega,
    valor_cotizacion: Number(data.valor_cotizacion ?? 0),
    estado: data.estado,
    aprobacion: data.aprobacion,
  };

  return (
    <>
      <TituloPanel
        titulo={`Editar ${data.tipo === "cotizacion" ? "cotización" : "cuenta de cobro"} ${String(data.numero).padStart(3, "0")}`}
        ayuda="Cambia lo que necesites y guarda. El número consecutivo no cambia."
      />
      {error && <p role="alert" className="mb-4 text-sm text-primary">Revisa los datos: el cliente y al menos un ítem son obligatorios.</p>}
      <EditorDocumento inicial={inicial} />
    </>
  );
}
