import { Revelar } from "@/components/publico/Revelar";

const valores = [
  { t: "Precisión", d: "Medidas exactas y uniones limpias, desde el corte hasta el último cordón." },
  { t: "Seguridad", d: "Trabajo con normas de seguridad, para la obra y para el equipo." },
  { t: "Cumplimiento", d: "Tiempos claros y entregas puntuales, sin sorpresas." },
];

export function Valores() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-px bg-border px-0 md:grid-cols-3">
        {valores.map((v, i) => (
          <Revelar key={v.t} retardo={i * 120}>
            <div className="group relative h-full overflow-hidden bg-card p-10">
              <h3 className="font-display text-5xl font-bold uppercase leading-none transition-colors group-hover:text-primary">
                {v.t}
              </h3>
              <p className="mt-4 text-muted-foreground">{v.d}</p>
              <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
            </div>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
