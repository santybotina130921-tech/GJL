import Link from "next/link";
import { Revelar } from "@/components/publico/Revelar";

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const accesos = [
  {
    href: "/visita",
    titulo: "Agenda una visita técnica",
    texto: "Elige el día y la hora. Vamos a tu obra, medimos y revisamos el sitio.",
    icono: (<svg viewBox="0 0 24 24" {...trazo} className="h-7 w-7"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>),
  },
  {
    href: "/seguimiento",
    titulo: "Sigue tu obra",
    texto: "Entra con tu código y mira el avance, las etapas y las fotos. Sin registrarte.",
    icono: (<svg viewBox="0 0 24 24" {...trazo} className="h-7 w-7"><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></svg>),
  },
  {
    href: "/cotizador",
    titulo: "Cotizador rápido",
    texto: "Un estimado aproximado en segundos para que te hagas una idea.",
    icono: (<svg viewBox="0 0 24 24" {...trazo} className="h-7 w-7"><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8" /></svg>),
  },
  {
    href: "/catalogo",
    titulo: "Catálogo con precios",
    texto: "Portones, escaleras, barandas y más, con medidas y valores de referencia.",
    icono: (<svg viewBox="0 0 24 24" {...trazo} className="h-7 w-7"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>),
  },
];

export function AccesosRapidos() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <Revelar>
        <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
        <h2 className="font-display text-4xl uppercase leading-none sm:text-6xl">¿Qué necesitas hoy?</h2>
      </Revelar>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {accesos.map((a, i) => (
          <Revelar key={a.href} retardo={i * 90}>
            <Link
              href={a.href}
              className="group relative flex h-full flex-col overflow-hidden border border-border bg-card p-6 transition duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_18px_40px_-24px_var(--primary)]"
            >
              <span className="mb-6 grid h-14 w-14 place-items-center border border-border bg-background text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                {a.icono}
              </span>
              <h3 className="font-display text-3xl uppercase leading-none">{a.titulo}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.texto}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Ir ahora <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
              </span>
              <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
            </Link>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
