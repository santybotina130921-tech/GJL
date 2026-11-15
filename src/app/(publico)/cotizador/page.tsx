import Link from "next/link";
import { EncabezadoPagina } from "@/components/publico/EncabezadoPagina";
import { Cotizador } from "@/components/publico/cotizador/Cotizador";
import { getAjustes, getTarifas } from "@/lib/datos";

export const metadata = { title: "Cotizador rápido | JGL Estructural" };
export const revalidate = 60;

export default async function PaginaCotizador() {
  const [tarifas, a] = await Promise.all([getTarifas(), getAjustes()]);
  return (
    <>
      <EncabezadoPagina linea1="Calcula tu" linea2="presupuesto." texto="Un estimado rápido para que te hagas una idea. La cotización formal la hacemos después de la visita técnica." />
      <section className="mx-auto max-w-6xl px-5 py-16">
        {tarifas.length > 0 ? (
          <Cotizador tarifas={tarifas} whatsapp={a.whatsapp} />
        ) : (
          <div className="border border-border bg-card p-8">
            <p className="text-muted-foreground">El cotizador estará disponible muy pronto. Mientras tanto, cuéntanos tu obra y te cotizamos.</p>
            <Link href="/contacto" className="btn-jgl mt-6">Solicitar cotización <span className="flecha" aria-hidden="true">→</span></Link>
          </div>
        )}
      </section>
    </>
  );
}
