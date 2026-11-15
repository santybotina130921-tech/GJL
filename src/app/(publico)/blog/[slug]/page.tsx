import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContenidoBlog } from "@/components/publico/blog/ContenidoBlog";
import { CtaCotizar } from "@/components/publico/secciones/CtaCotizar";
import { getEntrada } from "@/lib/datos";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEntrada(slug);
  if (!e) return { title: "Blog | JGL Estructural" };
  return { title: `${e.titulo} | JGL Estructural`, description: e.resumen };
}

export default async function Articulo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEntrada(slug);
  if (!e) notFound();
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-16">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">← Volver al blog</Link>
        <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">{e.publicada_en ? new Date(e.publicada_en).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-none sm:text-6xl">{e.titulo}</h1>
        {e.imagen_url && (
          <div className="relative my-8 aspect-video overflow-hidden border border-border">
            <Image src={e.imagen_url} alt={e.titulo} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <ContenidoBlog texto={e.contenido} />
      </article>
      <CtaCotizar />
    </>
  );
}
