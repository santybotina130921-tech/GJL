import { EncabezadoPagina } from "@/components/publico/EncabezadoPagina";
import { AgendarVisita } from "@/components/publico/visita/AgendarVisita";
import { getAjustes } from "@/lib/datos";

export const metadata = { title: "Agendar visita técnica | JGL Estructural" };

export default async function Visita() {
  const a = await getAjustes();
  return (
    <>
      <EncabezadoPagina linea1="Agenda una" linea2="visita técnica." texto="Vamos a tu obra, medimos y revisamos el sitio para darte una cotización precisa. Elige el día y la hora." />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <AgendarVisita whatsapp={a.whatsapp} />
      </section>
    </>
  );
}
