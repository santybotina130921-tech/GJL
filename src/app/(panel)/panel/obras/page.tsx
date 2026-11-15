import Link from "next/link";
import { exigirAdmin } from "@/lib/panel/auth";
import { crearObra } from "@/lib/panel/acciones-extra";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { boton, campo, etiqueta, tarjeta } from "@/components/panel/estilos";

const ESTADOS: Record<string, string> = { en_proceso: "En proceso", pausada: "Pausada", terminada: "Terminada" };

export default async function Obras({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("obras").select("id,codigo,nombre,cliente,estado,avance,publica").order("creado_en", { ascending: false });

  return (
    <>
      <TituloPanel titulo="Obras (seguimiento)" ayuda="Cada obra tiene un código para que el cliente vea el avance sin registrarse." />
      {error && <p role="alert" className="mb-4 text-sm text-primary">Escribe el nombre de la obra y el cliente.</p>}
      <form action={crearObra} className={`${tarjeta} mb-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end`}>
        <div><label className={etiqueta}>Nombre de la obra</label><input name="nombre" required className={campo} placeholder="Ej. Cubierta bodega" /></div>
        <div><label className={etiqueta}>Cliente</label><input name="cliente" required className={campo} /></div>
        <button type="submit" className={boton}>Crear obra</button>
      </form>
      {!data?.length && <p className="text-muted-foreground">Aún no hay obras.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((o) => (
          <Link key={o.id} href={`/panel/obras/${o.id}`} className={`${tarjeta} block transition duration-300 hover:-translate-y-1 hover:border-primary`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl uppercase leading-none">{o.nombre}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{o.cliente} · {o.codigo}</p>
              </div>
              <span className="border border-border px-2 py-0.5 text-xs">{ESTADOS[o.estado]}</span>
            </div>
            <div className="mt-4 h-2 bg-border"><div className="h-full bg-primary" style={{ width: `${o.avance}%` }} /></div>
            <p className="mt-1 text-xs text-muted-foreground">{o.avance}% {o.publica ? "" : "· enlace desactivado"}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
