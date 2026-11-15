import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";

const pasos = [
  { t: "Visita técnica", d: "Medimos y revisamos el sitio de la obra." },
  { t: "Cotización", d: "Detalle de materiales, tiempos y valor." },
  { t: "Fabricación", d: "Corte, armado y soldadura en taller." },
  { t: "Montaje", d: "Instalación en obra con personal calificado." },
  { t: "Entrega", d: "Revisión final y garantía." },
];

export function Proceso() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Cómo trabajamos</TituloSeccion>
      </Revelar>
      <Revelar>
        <div className="relative grid gap-10 md:grid-cols-5">
          <span className="trazo-h absolute left-0 top-[34px] hidden h-0.5 w-full bg-primary md:block" aria-hidden="true" />
          {pasos.map((p, i) => (
            <div key={p.t} className="relative">
              <span className="relative z-10 grid h-[68px] w-[68px] place-items-center border border-border bg-background font-display text-4xl font-bold text-primary">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold uppercase leading-none">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Revelar>
    </section>
  );
}
