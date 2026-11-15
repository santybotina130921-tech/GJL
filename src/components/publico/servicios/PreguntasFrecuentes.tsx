import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getPreguntas } from "@/lib/datos";

export async function PreguntasFrecuentes() {
  const preguntas = await getPreguntas();
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-4xl px-5 py-24">
        <Revelar>
          <TituloSeccion>Preguntas frecuentes</TituloSeccion>
        </Revelar>
        <Revelar>
          {preguntas.map((q) => (
            <details key={q.pregunta} className="group border-b border-border py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl font-semibold uppercase leading-none transition-colors hover:text-primary sm:text-3xl">
                {q.pregunta}
                <span className="text-primary transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="entrar mt-3 max-w-2xl text-muted-foreground">{q.respuesta}</p>
            </details>
          ))}
        </Revelar>
      </div>
    </section>
  );
}
