import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { servicios } from "@/config/servicios";

export function Servicios() {
  return (
    <section id="servicios" className="mx-auto max-w-6xl px-5 py-24">
      <TituloSeccion>Servicios</TituloSeccion>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {servicios.map((s) => (
          <article
            key={s.nombre}
            className="group relative overflow-hidden border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-muted-foreground"
          >
            <h3 className="mb-3 font-display text-3xl font-semibold uppercase leading-none">
              {s.nombre}
            </h3>
            <p className="text-sm text-muted-foreground">{s.descripcion}</p>
            <span
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
