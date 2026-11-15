import { ComparadorAntesDespues } from "@/components/publico/ComparadorAntesDespues";
import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import type { Proyecto } from "@/config/proyectos";

export function AntesDespuesSeccion({ proyectos }: { proyectos: Proyecto[] }) {
  const pares = proyectos.filter((p) => p.antes && p.despues).slice(0, 4);
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <Revelar>
        <TituloSeccion>Antes y después</TituloSeccion>
      </Revelar>
      {pares.length === 0 ? (
        <Revelar>
          <ComparadorAntesDespues alt="Ejemplo" />
          <p className="mt-3 text-sm text-muted-foreground">Ejemplo. Cuando se suban fotos de antes y después desde el panel, aparecerán aquí.</p>
        </Revelar>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {pares.map((p, i) => (
            <Revelar key={p.slug} retardo={i * 100}>
              <ComparadorAntesDespues antes={p.antes} despues={p.despues} alt={p.titulo} />
              <h3 className="mt-3 font-display text-2xl uppercase leading-none">{p.titulo}</h3>
              <p className="text-sm text-muted-foreground">{[p.ubicacion, p.medidas].filter(Boolean).join(" · ")}</p>
            </Revelar>
          ))}
        </div>
      )}
    </section>
  );
}
