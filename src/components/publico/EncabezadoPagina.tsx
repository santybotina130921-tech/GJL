export function EncabezadoPagina({
  linea1,
  linea2,
  texto,
}: {
  linea1: string;
  linea2: string;
  texto?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div className="rejilla absolute inset-0 -z-10" aria-hidden="true" />
      <div className="resplandor absolute inset-0 -z-10" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 py-24">
        <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
        <h1 className="font-display text-5xl uppercase leading-none sm:text-7xl">
          {linea1}
          <br />
          <span className="text-primary">{linea2}</span>
        </h1>
        {texto && <p className="mt-5 max-w-xl text-lg text-muted-foreground">{texto}</p>}
      </div>
    </section>
  );
}
