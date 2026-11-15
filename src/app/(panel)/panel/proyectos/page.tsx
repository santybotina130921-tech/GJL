import Link from "next/link";
import { exigirAdmin } from "@/lib/panel/auth";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { boton, tarjeta } from "@/components/panel/estilos";

type M = { url: string; tipo: string; es_portada: boolean };

export default async function Proyectos() {
  const { sb } = await exigirAdmin();
  const { data } = await sb
    .from("proyectos")
    .select("id,titulo,categoria,estado,orden,proyecto_media(url,tipo,es_portada)")
    .order("orden")
    .order("creado_en", { ascending: false });

  return (
    <>
      <TituloPanel titulo="Proyectos" ayuda="Crea proyectos, sube fotos y videos y publícalos en la página.">
        <Link href="/panel/proyectos/nuevo" className={boton}>Nuevo proyecto</Link>
      </TituloPanel>
      {!data?.length && <p className="text-muted-foreground">Aún no hay proyectos. Crea el primero.</p>}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {data?.map((p) => {
          const media = (p.proyecto_media ?? []) as M[];
          const portada = media.find((m) => m.es_portada && m.tipo === "foto") ?? media.find((m) => m.tipo === "foto");
          return (
            <Link key={p.id} href={`/panel/proyectos/${p.id}`} className={`${tarjeta} group block overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:border-primary`}>
              <div className="placeholder-acero relative aspect-video">
                {portada && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portada.url} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <span className={`absolute left-3 top-3 px-3 py-1 text-xs font-semibold uppercase ${p.estado === "publicado" ? "bg-primary text-white" : "bg-black/70 text-neutral-300"}`}>
                  {p.estado}
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-display text-2xl font-semibold uppercase leading-none">{p.titulo}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.categoria} · {media.length} archivos</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
