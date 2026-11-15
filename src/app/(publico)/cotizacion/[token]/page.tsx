import { notFound } from "next/navigation";
import { VistaDocumento, type DatosDoc } from "@/components/panel/VistaDocumento";
import { RespuestaCotizacion } from "@/components/publico/cotizacion/RespuestaCotizacion";
import { crearClienteDirecto } from "@/lib/supabase/publico";
import { ipActual, limitar } from "@/lib/limite";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tu cotización | JGL Estructural", robots: { index: false, follow: false } };

export default async function Cotizacion({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{32}$/.test(token)) notFound();
  if (limitar(`cotver:${await ipActual()}`, 30, 10 * 60_000)) {
    return <section className="mx-auto max-w-3xl px-5 py-24"><p>Demasiados intentos. Espera unos minutos.</p></section>;
  }
  const { data } = await crearClienteDirecto().rpc("cotizacion_por_token", { t: token });
  if (!data) notFound();

  const d: DatosDoc = {
    tipo: "cotizacion",
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
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <VistaDocumento d={d} />
      {data.aprobacion === "pendiente" && !data.vencida && <RespuestaCotizacion token={token} />}
      {data.aprobacion === "pendiente" && data.vencida && (
        <p className="mt-8 border border-border bg-card p-6 text-muted-foreground">Esta oferta ya venció. Escríbenos y te enviamos una nueva.</p>
      )}
      {data.aprobacion === "aprobada" && (
        <p className="mt-8 border border-primary bg-card p-6">Cotización <b>aprobada</b>{data.aprobada_por ? ` por ${data.aprobada_por}` : ""}. ¡Gracias!</p>
      )}
      {data.aprobacion === "rechazada" && (
        <p className="mt-8 border border-border bg-card p-6 text-muted-foreground">Respondiste que no aceptas esta cotización. Si cambias de opinión, escríbenos.</p>
      )}
    </section>
  );
}
