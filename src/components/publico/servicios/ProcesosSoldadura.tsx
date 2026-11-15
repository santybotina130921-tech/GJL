import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";

const procesos = [
  { sigla: "MIG", nombre: "Soldadura MIG", texto: "Rápida y eficiente. Ideal para producción en taller y estructuras livianas y medianas." },
  { sigla: "TIG", nombre: "Soldadura TIG", texto: "Alta precisión y acabado limpio. Indicada para acero inoxidable, aluminio y uniones visibles." },
  { sigla: "SMAW", nombre: "Electrodo revestido", texto: "Versátil y robusta. Funciona bien en obra y en exteriores, con equipos portátiles." },
];

export function ProcesosSoldadura() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Procesos de soldadura</TituloSeccion>
      </Revelar>
      <div className="grid gap-6 md:grid-cols-3">
        {procesos.map((p, i) => (
          <Revelar key={p.sigla} retardo={i * 130}>
            <article className="inclinar relative h-full overflow-hidden border border-border bg-card p-8">
              <p className="contorno font-display text-8xl font-bold leading-none">{p.sigla}</p>
              <h3 className="mt-4 font-display text-3xl font-semibold uppercase leading-none">{p.nombre}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.texto}</p>
              <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-transparent" aria-hidden="true" />
            </article>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
