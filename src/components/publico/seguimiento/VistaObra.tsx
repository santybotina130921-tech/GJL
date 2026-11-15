import Image from "next/image";

export type ObraPublica = {
  nombre: string;
  cliente: string;
  descripcion: string;
  estado: "en_proceso" | "pausada" | "terminada";
  avance: number;
  etapas: { nombre: string; avance: number }[];
  fecha_inicio: string | null;
  fecha_estimada: string | null;
  avances: { nota: string; foto_url: string | null; fecha: string }[];
};

const ESTADOS = { en_proceso: "En proceso", pausada: "Pausada", terminada: "Terminada" } as const;
const fecha = (f: string) => new Date(f + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

export function VistaObra({ obra }: { obra: ObraPublica }) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm text-muted-foreground">Obra de {obra.cliente}</p>
      <h1 className="mt-1 font-display text-5xl uppercase leading-none sm:text-6xl">{obra.nombre}</h1>
      {obra.descripcion && <p className="mt-4 max-w-2xl text-muted-foreground">{obra.descripcion}</p>}

      <div className="mt-8 border border-border bg-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="font-display text-7xl leading-none text-primary">{obra.avance}%</p>
          <span className="border border-primary px-3 py-1 text-xs uppercase tracking-wider text-primary">{ESTADOS[obra.estado]}</span>
        </div>
        <div className="mt-4 h-3 bg-border" role="progressbar" aria-valuenow={obra.avance} aria-valuemin={0} aria-valuemax={100} aria-label="Avance de la obra">
          <div className="h-full bg-gradient-to-r from-primary to-[var(--acento-2)] transition-all duration-1000" style={{ width: `${obra.avance}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {obra.fecha_inicio && <>Inicio: {fecha(obra.fecha_inicio)}</>}
          {obra.fecha_inicio && obra.fecha_estimada && " · "}
          {obra.fecha_estimada && <>Entrega estimada: {fecha(obra.fecha_estimada)}</>}
        </p>
      </div>

      {obra.etapas.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-3xl uppercase">Etapas</h2>
          <ul className="space-y-4">
            {obra.etapas.map((e) => (
              <li key={e.nombre}>
                <div className="flex justify-between text-sm"><span>{e.nombre}</span><span className="text-muted-foreground">{e.avance}%</span></div>
                <div className="mt-1 h-2 bg-border"><div className="h-full bg-primary transition-all duration-1000" style={{ width: `${e.avance}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-4 font-display text-3xl uppercase">Avances</h2>
        {obra.avances.length === 0 && <p className="text-muted-foreground">Pronto verás aquí las fotos y notas del avance.</p>}
        <ol className="relative space-y-8 border-l border-border pl-6">
          {obra.avances.map((a, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rotate-45 bg-primary" aria-hidden="true" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{fecha(a.fecha)}</p>
              {a.nota && <p className="mt-1">{a.nota}</p>}
              {a.foto_url && (
                <div className="relative mt-3 aspect-video max-w-xl overflow-hidden border border-border">
                  <Image src={a.foto_url} alt={a.nota || "Avance de la obra"} fill sizes="(min-width: 768px) 576px, 100vw" className="object-cover" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
