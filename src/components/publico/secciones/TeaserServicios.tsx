import Link from "next/link";
import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getServicios } from "@/lib/datos";

export async function TeaserServicios() {
  const servicios = await getServicios();
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <Revelar>
          <TituloSeccion>Lo que hacemos</TituloSeccion>
        </Revelar>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {servicios.slice(0, 4).map((s, i) => (
            <Revelar key={s.id} retardo={i * 100}>
              <Link
                href="/servicios"
                className="group relative isolate flex h-full min-h-56 flex-col justify-between overflow-hidden bg-card p-6 transition-colors hover:text-primary-foreground relleno"
              >
                <h3 className="font-display text-3xl font-semibold uppercase leading-none">{s.nombre}</h3>
                <p className="mt-6 text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground">{s.descripcion}</p>
              </Link>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
