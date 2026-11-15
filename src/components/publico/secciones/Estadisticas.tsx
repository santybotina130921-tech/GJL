import { Contador } from "@/components/publico/Contador";
import { Revelar } from "@/components/publico/Revelar";
import { getEstadisticas } from "@/lib/datos";

export async function Estadisticas() {
  const datos = await getEstadisticas();
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-10 sm:grid-cols-3">
        {datos.map((d, i) => (
          <Revelar key={d.etiqueta} retardo={i * 120}>
            <p className="font-display text-7xl font-bold leading-none text-primary sm:text-8xl">
              <Contador hasta={d.valor} />
            </p>
            <p className="mt-2 text-muted-foreground">{d.etiqueta}</p>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
