import Image from "next/image";
import { Boton } from "@/components/publico/Boton";
import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getProyectos } from "@/lib/datos";

export async function TeaserProyectos() {
  const proyectos = (await getProyectos()).slice(0, 3);
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Obras que hablan</TituloSeccion>
      </Revelar>
      <div className="grid gap-6 md:grid-cols-3">
        {proyectos.map((p, i) => (
          <Revelar key={p.slug} retardo={i * 140}>
            <article className="inclinar group border border-border bg-card">
              <div className="placeholder-acero relative aspect-[4/3] overflow-hidden">
                {p.imagen && (
                  <Image src={p.imagen} alt={p.titulo} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  {p.categoria}
                </span>
                <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-primary/80 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-3xl font-semibold uppercase leading-none">{p.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{[p.ubicacion, p.medidas].filter(Boolean).join(" · ")}</p>
              </div>
            </article>
          </Revelar>
        ))}
      </div>
      <div className="mt-12">
        <Boton href="/proyectos">Ver todos los proyectos</Boton>
      </div>
    </section>
  );
}
