import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { getCertificaciones } from "@/lib/datos";

export async function Certificaciones() {
  const lista = await getCertificaciones();
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <Revelar>
          <TituloSeccion>Certificaciones y garantías</TituloSeccion>
        </Revelar>
        <div className="grid gap-px bg-border md:grid-cols-3">
          {lista.map((c, i) => (
            <Revelar key={c.titulo} retardo={i * 100}>
              <div className="group relative h-full overflow-hidden bg-card p-8">
                <span className="mb-4 block h-3 w-3 rotate-45 bg-primary" aria-hidden="true" />
                <h3 className="font-display text-3xl uppercase leading-none transition-colors group-hover:text-primary">{c.titulo}</h3>
                <p className="mt-3 text-muted-foreground">{c.detalle}</p>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
