import Link from "next/link";
import { exigirAdmin } from "@/lib/panel/auth";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { boton, tarjeta } from "@/components/panel/estilos";

export default async function BlogPanel() {
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("entradas").select("id,titulo,publicado,publicada_en,creado_en").order("creado_en", { ascending: false });
  return (
    <>
      <TituloPanel titulo="Blog" ayuda="Artículos con consejos. Ayudan a que te encuentren en Google.">
        <Link href="/panel/blog/nuevo" className={boton}>Nueva entrada</Link>
      </TituloPanel>
      {!data?.length && <p className="text-muted-foreground">Aún no hay entradas.</p>}
      <div className="space-y-3">
        {data?.map((e) => (
          <Link key={e.id} href={`/panel/blog/${e.id}`} className={`${tarjeta} flex items-center justify-between gap-4 transition hover:border-primary`}>
            <span className="font-medium">{e.titulo}</span>
            <span className={`shrink-0 border px-2 py-0.5 text-xs ${e.publicado ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>{e.publicado ? "Publicado" : "Borrador"}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
