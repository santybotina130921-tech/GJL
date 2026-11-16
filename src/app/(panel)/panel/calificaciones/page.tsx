import { exigirAdmin } from "@/lib/panel/auth";
import { borrarCalificacion, moderarCalificacion } from "@/lib/panel/acciones-extra";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde, tarjeta } from "@/components/panel/estilos";

type Fila = {
  id: string; estrellas: number; comentario: string; nombre: string; aprobada: boolean; creado_en: string;
  obras: { nombre: string; cliente: string } | null;
};

export default async function Calificaciones() {
  const { sb } = await exigirAdmin();
  const { data } = await sb
    .from("calificaciones")
    .select("id,estrellas,comentario,nombre,aprobada,creado_en,obras(nombre,cliente)")
    .order("creado_en", { ascending: false });
  const lista = (data ?? []) as unknown as Fila[];

  return (
    <>
      <TituloPanel
        titulo="Calificaciones"
        ayuda="Opiniones de clientes que tienen el código de una obra terminada. Nada se publica hasta que lo apruebes."
      />
      {!lista.length && (
        <p className="text-muted-foreground">
          Aún no hay calificaciones. Cuando marques una obra como terminada, usa el botón &quot;Pedir calificación por WhatsApp&quot;.
        </p>
      )}
      <div className="space-y-4">
        {lista.map((c) => (
          <article key={c.id} className={`${tarjeta} ${c.aprobada ? "" : "border-primary/60"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-2xl tracking-widest text-primary" aria-label={`${c.estrellas} estrellas`}>
                  {"★".repeat(c.estrellas)}<span className="text-border">{"★".repeat(5 - c.estrellas)}</span>
                </p>
                <p className="mt-1 text-sm"><b>{c.nombre}</b> <span className="text-muted-foreground">· obra: {c.obras?.nombre ?? "—"} ({c.obras?.cliente ?? "—"})</span></p>
                <p className="text-xs text-muted-foreground">{new Date(c.creado_en).toLocaleString("es-CO")}</p>
              </div>
              <span className={`border px-3 py-1 text-xs uppercase tracking-wider ${c.aprobada ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-primary text-primary"}`}>
                {c.aprobada ? "Publicada" : "Por revisar"}
              </span>
            </div>
            {c.comentario && <p className="mt-3 text-sm">{c.comentario}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={moderarCalificacion}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="aprobada" value={c.aprobada ? "0" : "1"} />
                <button className={botonBorde}>{c.aprobada ? "Ocultar" : "Aprobar y publicar"}</button>
              </form>
              <form action={borrarCalificacion}>
                <input type="hidden" name="id" value={c.id} />
                <button className={botonBorde}>Borrar</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
