import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getCalificaciones, getTestimonios } from "@/lib/datos";

function Estrellas({ n }: { n: number }) {
  return (
    <span role="img" aria-label={`${n} de 5 estrellas`} className="tracking-widest text-primary">
      {"★".repeat(n)}
      <span className="text-border">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export async function Testimonios() {
  const [manuales, calificaciones] = await Promise.all([getTestimonios(), getCalificaciones()]);

  const tarjetas = [
    ...calificaciones
      .filter((c) => c.comentario.trim())
      .map((c) => ({ nombre: c.nombre, cargo: "Cliente verificado", texto: c.comentario, estrellas: c.estrellas })),
    ...manuales.map((m) => ({ ...m, estrellas: 0 })),
  ];
  if (!tarjetas.length) return null;

  // El promedio solo se muestra cuando hay al menos 3 calificaciones reales.
  const promedio = calificaciones.length >= 3
    ? calificaciones.reduce((s, c) => s + c.estrellas, 0) / calificaciones.length
    : null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Lo que dicen los clientes</TituloSeccion>
        {promedio !== null && (
          <p className="-mt-4 mb-8 text-muted-foreground">
            <span className="font-display text-4xl text-primary">{promedio.toFixed(1)}</span> de 5 · {calificaciones.length} calificaciones de clientes
          </p>
        )}
      </Revelar>
      <div className="grid gap-6 md:grid-cols-3">
        {tarjetas.map((t, i) => (
          <Revelar key={t.nombre + i} retardo={(i % 3) * 120}>
            <figure className="h-full border border-border bg-card p-8">
              {t.estrellas > 0 && <p className="mb-3 text-xl"><Estrellas n={t.estrellas} /></p>}
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
