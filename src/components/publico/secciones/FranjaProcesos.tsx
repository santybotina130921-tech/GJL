const palabras = [
  "Soldadura MIG",
  "Soldadura TIG",
  "Electrodo revestido",
  "Cerchas",
  "Naves industriales",
  "Cubiertas",
  "Portones",
  "Montaje en obra",
];

export function FranjaProcesos() {
  const lista = [...palabras, ...palabras];
  return (
    <div className="overflow-hidden border-y border-border py-4" aria-hidden="true">
      <div className="marquesina">
        {lista.map((p, i) => (
          <span
            key={i}
            className="whitespace-nowrap pr-14 font-display text-3xl font-semibold uppercase text-muted-foreground"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
