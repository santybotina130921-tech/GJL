import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getHitos } from "@/lib/datos";

export async function LineaTiempo() {
  const hitos = await getHitos();
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Nuestra historia</TituloSeccion>
      </Revelar>
      <Revelar>
        <ol className="relative ml-3 border-l border-border pl-10">
          <span className="trazo absolute -left-px top-0 h-full w-0.5 bg-primary" aria-hidden="true" />
          {hitos.map((h) => (
            <li key={h.titulo} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[46px] top-2 h-3 w-3 rotate-45 bg-primary" aria-hidden="true" />
              <h3 className="font-display text-4xl font-semibold uppercase leading-none">{h.titulo}</h3>
              <p className="mt-2 max-w-xl text-muted-foreground">{h.texto}</p>
            </li>
          ))}
        </ol>
      </Revelar>
    </section>
  );
}
