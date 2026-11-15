import { Boton } from "@/components/publico/Boton";
import { Fondo } from "@/components/publico/Fondo";
import { Revelar } from "@/components/publico/Revelar";
import { getAjustes } from "@/lib/datos";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

export async function CtaCotizar() {
  const a = await getAjustes();
  return (
    <section className="relative isolate overflow-hidden bg-primary text-white">
      <Fondo clave="fondo_cta" velo="bg-primary/90" />
      <div className="rejilla absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 py-24">
        <Revelar>
          <h2 className="max-w-xl font-display text-5xl font-bold uppercase leading-none sm:text-7xl">
            ¿Tienes una obra en mente?
          </h2>
        </Revelar>
        <Revelar retardo={150} className="flex flex-wrap gap-4">
          <Boton href="/contacto" variante="oscuro">Solicitar cotización</Boton>
          <Boton href={crearEnlaceWhatsApp(a.whatsapp)} externo variante="oscuro">WhatsApp</Boton>
        </Revelar>
      </div>
    </section>
  );
}
