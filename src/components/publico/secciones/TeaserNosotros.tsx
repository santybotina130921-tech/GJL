import { Boton } from "@/components/publico/Boton";
import { Fondo } from "@/components/publico/Fondo";
import { Revelar } from "@/components/publico/Revelar";
import { TextoRevelado } from "@/components/publico/TextoRevelado";
import { getAjustes } from "@/lib/datos";

export async function TeaserNosotros() {
  const a = await getAjustes();
  return (
    <section className="relative isolate overflow-hidden border-y border-border">
      <Fondo clave="fondo_nosotros" velo="bg-gradient-to-r from-background via-background/85 to-background/50" />
      <p
        className="contorno pointer-events-none absolute bottom-0 right-4 -z-10 select-none font-display text-[clamp(8rem,22vw,17rem)] font-bold leading-[.8]"
        aria-hidden="true"
      >
        JGL
      </p>
      <div className="relative mx-auto max-w-6xl px-5 py-28">
        <Revelar>
          <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
          <h2 className="max-w-3xl font-display text-5xl font-bold uppercase leading-none sm:text-7xl">
            Somos el acero detrás de cada obra
          </h2>
        </Revelar>
        <div className="mt-10 max-w-2xl border-l-[3px] border-primary pl-5">
          <TextoRevelado className="text-xl font-medium leading-snug sm:text-3xl" texto={a.nosotros_texto} />
        </div>
        <div className="mt-10">
          <Boton href="/nosotros" variante="borde">Conócenos</Boton>
        </div>
      </div>
    </section>
  );
}
