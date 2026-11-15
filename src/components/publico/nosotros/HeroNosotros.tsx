import { Chispas } from "@/components/publico/Chispas";
import { Fondo } from "@/components/publico/Fondo";
import { TextoRevelado } from "@/components/publico/TextoRevelado";
import { getAjustes } from "@/lib/datos";

export async function HeroNosotros() {
  const a = await getAjustes();
  return (
    <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden border-b border-border">
      <Fondo clave="fondo_nosotros" velo="bg-gradient-to-r from-background via-background/80 to-background/30" />
      <div className="resplandor absolute inset-0 -z-10" aria-hidden="true" />
      <Chispas cantidad={20} />
      <div className="mx-auto w-full max-w-6xl px-5 py-24">
        <h1 className="font-display text-6xl font-bold uppercase leading-none sm:text-8xl lg:text-9xl">
          <span className="linea-titulo"><span style={{ "--d": 0 } as React.CSSProperties}>Somos la</span></span>
          <span className="linea-titulo"><span className="text-primary" style={{ "--d": 1 } as React.CSSProperties}>fuerza</span></span>
          <span className="linea-titulo"><span style={{ "--d": 2 } as React.CSSProperties}>del acero</span></span>
        </h1>
        <div className="mt-10 max-w-2xl border-l-[3px] border-primary pl-5">
          <TextoRevelado className="text-xl font-medium leading-snug sm:text-3xl" texto={a.nosotros_texto} />
        </div>
        <p className="mt-6 max-w-xl border-l-[3px] border-border pl-5 text-muted-foreground">{a.nosotros_mision}</p>
      </div>
    </section>
  );
}
