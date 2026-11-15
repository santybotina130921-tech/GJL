import { Revelar } from "@/components/publico/Revelar";
import { TituloSeccion } from "@/components/publico/TituloSeccion";

const materiales = [
  { t: "Acero al carbono", d: "Perfiles, láminas y tubería estructural para obras civiles e industriales." },
  { t: "Acero inoxidable", d: "Para ambientes húmedos, alimentos y acabados visibles." },
  { t: "Aluminio", d: "Livianos y resistentes a la corrosión, para cerramientos y detalles." },
];
const acabados = ["Pintura anticorrosiva", "Pintura electrostática", "Galvanizado", "Pulido y satinado"];

export function Materiales() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Revelar>
        <TituloSeccion>Materiales y acabados</TituloSeccion>
      </Revelar>
      <div className="grid gap-6 md:grid-cols-3">
        {materiales.map((m, i) => (
          <Revelar key={m.t} retardo={i * 100}>
            <div className="h-full border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary">
              <h3 className="font-display text-3xl uppercase leading-none">{m.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{m.d}</p>
            </div>
          </Revelar>
        ))}
      </div>
      <Revelar>
        <ul className="mt-8 flex flex-wrap gap-3">
          {acabados.map((a) => (
            <li key={a} className="border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground">{a}</li>
          ))}
        </ul>
      </Revelar>
    </section>
  );
}
