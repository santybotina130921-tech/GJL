import { Boton } from "@/components/publico/Boton";
import { Carrusel } from "@/components/publico/Carrusel";
import { Chispas } from "@/components/publico/Chispas";
import { Fondo } from "@/components/publico/Fondo";
import { getAjustes, getDiapositivas } from "@/lib/datos";

export async function Hero() {
  const [diapositivas, a] = await Promise.all([getDiapositivas(), getAjustes()]);
  // Una línea por renglón; la última se resalta con el color de la marca.
  const partes = (a.inicio_titulo ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  const lineas = partes.map((t, i) => ({ t, rojo: i === partes.length - 1 }));

  return (
    <section className="relative isolate overflow-hidden">
      <Fondo clave="fondo_inicio" velo="bg-background/80" />
      <div className="rejilla absolute inset-0 -z-10" aria-hidden="true" />
      <div className="resplandor absolute inset-0 -z-10" aria-hidden="true" />
      <Chispas />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 md:min-h-[88vh] md:grid-cols-[1.1fr_.9fr]">
        <div>
          <h1 className="font-display text-5xl uppercase leading-none sm:text-7xl lg:text-8xl">
            {lineas.map((l, i) => (
              <span key={l.t + i} className="linea-titulo">
                <span className={l.rojo ? "text-primary" : ""} style={{ "--d": i } as React.CSSProperties}>
                  {l.t}
                </span>
              </span>
            ))}
          </h1>
          <div className="cordon mt-7" aria-hidden="true" />
          <p className="aparece mt-6 max-w-lg text-lg text-muted-foreground">{a.inicio_subtitulo}</p>
          <div className="aparece mt-8 flex flex-wrap gap-4" style={{ "--retardo": "1s" } as React.CSSProperties}>
            <Boton href="/cotizador">Solicitar cotización</Boton>
            <Boton href="/proyectos" variante="borde">Ver proyectos</Boton>
          </div>
        </div>
        <Carrusel diapositivas={diapositivas} />
      </div>
    </section>
  );
}
