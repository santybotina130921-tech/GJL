import Image from "next/image";
import Link from "next/link";
import { EncabezadoPagina } from "@/components/publico/EncabezadoPagina";
import { getEntradas } from "@/lib/datos";

export const metadata = { title: "Blog | JGL Estructural", description: "Consejos sobre estructuras metálicas, soldadura y mantenimiento." };
export const revalidate = 60;

export default async function Blog() {
  const entradas = await getEntradas();
  return (
    <>
      <EncabezadoPagina linea1="Consejos" linea2="de taller." texto="Guías sobre estructuras metálicas, soldadura y mantenimiento, explicadas sin tecnicismos." />
      <section className="mx-auto max-w-6xl px-5 py-16">
        {entradas.length === 0 ? (
          <p className="text-muted-foreground">Pronto publicaremos nuestras primeras guías.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entradas.map((e, i) => (
              <Link key={e.slug} href={`/blog/${e.slug}`} className="entrar group border border-border bg-card transition-colors hover:border-primary" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="placeholder-acero relative aspect-[16/10] overflow-hidden">
                  {e.imagen_url && <Image src={e.imagen_url} alt={e.titulo} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{e.publicada_en ? new Date(e.publicada_en).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
                  <h2 className="mt-1 font-display text-3xl uppercase leading-none transition-colors group-hover:text-primary">{e.titulo}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{e.resumen}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
