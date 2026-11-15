import Image from "next/image";
import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getEquipo } from "@/lib/datos";

export async function Equipo() {
  const equipo = await getEquipo();
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Nuestro equipo</TituloSeccion>
      </Revelar>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {equipo.map((p, i) => (
          <Revelar key={p.nombre + i} retardo={(i % 4) * 100}>
            <article className="group border border-border bg-card">
              <div className="placeholder-acero relative aspect-[4/5] overflow-hidden">
                {p.foto_url ? (
                  <Image src={p.foto_url} alt={p.nombre} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-display text-7xl text-muted-foreground">{p.nombre[0]}</span>
                )}
              </div>
              <div className="border-t-2 border-primary p-4">
                <h3 className="font-display text-2xl uppercase leading-none">{p.nombre}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.cargo}</p>
              </div>
            </article>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
