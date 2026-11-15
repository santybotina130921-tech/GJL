import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getTestimonios } from "@/lib/datos";

export async function Testimonios() {
  const lista = await getTestimonios();
  if (!lista.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Lo que dicen los clientes</TituloSeccion>
      </Revelar>
      <div className="grid gap-6 md:grid-cols-3">
        {lista.map((t, i) => (
          <Revelar key={t.nombre + i} retardo={i * 120}>
            <figure className="h-full border border-border bg-card p-8">
              <blockquote className="text-lg leading-snug">{t.texto}</blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{t.nombre}</span>
                {t.cargo ? ` · ${t.cargo}` : ""}
              </figcaption>
            </figure>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
