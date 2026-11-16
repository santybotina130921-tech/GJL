import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/panel/auth";
import { borrarDocumento, marcarPagado } from "@/lib/panel/acciones";
import { VistaDocumento, type DatosDoc } from "@/components/panel/VistaDocumento";
import { BotonImprimir } from "@/components/panel/BotonImprimir";
import { EnlaceCotizacion } from "@/components/panel/EnlaceCotizacion";
import { BotonRecordatorio } from "@/components/panel/BotonRecordatorio";
import { formatoCOP } from "@/lib/documentos/letras";
import { urlSitio } from "@/lib/codigos";
import { duplicarDocumento } from "@/lib/panel/acciones-extra";
import Link from "next/link";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { boton, botonBorde } from "@/components/panel/estilos";

export default async function VerDocumento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("documentos").select("*").eq("id", id).single();
  if (!data) notFound();

  const d: DatosDoc = {
    tipo: data.tipo,
    numero: data.numero,
    fecha: data.fecha,
    prestador: data.prestador,
    identificacion: data.identificacion,
    cliente: data.cliente,
    concepto: data.concepto,
    items: data.items,
    iva: Number(data.iva),
    forma_pago: data.forma_pago,
    cuenta: data.cuenta,
    titular: data.titular,
    validez: data.validez,
    entrega: data.entrega,
    valor_cotizacion: Number(data.valor_cotizacion ?? 0),
  };

  return (
    <>
      <TituloPanel titulo={data.tipo === "cotizacion" ? "Cotización" : "Cuenta de cobro"}>
        <div className="flex gap-3">
          <BotonImprimir />
          <Link href={`/panel/documentos/${id}/editar`} className={botonBorde}>Editar</Link>
          <form action={duplicarDocumento}>
            <input type="hidden" name="id" value={id} />
            <button className={botonBorde}>Duplicar</button>
          </form>
          <form action={borrarDocumento}>
            <input type="hidden" name="id" value={id} />
            <button className={botonBorde}>Borrar</button>
          </form>
        </div>
      </TituloPanel>
      {data.tipo === "cuenta_cobro" && (
        <div className="mb-6 flex flex-wrap items-center gap-4 border border-border bg-card/90 p-4 text-sm">
          <span>Estado: <b className={data.estado === "pagado" ? "text-emerald-400" : ""}>{data.estado}</b></span>
          {data.estado !== "pagado" && (
            <form action={marcarPagado}>
              <input type="hidden" name="id" value={id} />
              <button className={boton}>Marcar como pagada y registrar el ingreso</button>
            </form>
          )}
        </div>
      )}
      {data.tipo === "cotizacion" && (
        <EnlaceCotizacion id={id} token={data.token_aprobacion} aprobacion={data.aprobacion} aprobadaPor={data.aprobada_por} comentario={data.comentario_cliente} whatsapp={data.cliente_whatsapp} cliente={data.cliente} numero={data.numero} base={await urlSitio()} />
      )}
      {data.tipo === "cuenta_cobro" && data.estado !== "pagado" && (
        <div className="mb-6 border border-border bg-card/90 p-4">
          <BotonRecordatorio
            id={id}
            whatsapp={data.cliente_whatsapp}
            ultimo={data.ultimo_recordatorio}
            mensaje={`Hola ${data.cliente}, te escribimos de JGL Estructural. Te recordamos la cuenta de cobro N° ${String(data.numero).padStart(3, "0")} por ${formatoCOP(Number(data.total))}. Puedes pagar por ${data.forma_pago}${data.cuenta ? " al " + data.cuenta : ""}${data.titular ? " (titular: " + data.titular + ")" : ""}. ¡Gracias!`}
          />
        </div>
      )}
      <VistaDocumento d={d} />
    </>
  );
}
