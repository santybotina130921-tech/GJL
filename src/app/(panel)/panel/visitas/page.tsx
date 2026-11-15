import { exigirAdmin } from "@/lib/panel/auth";
import { actualizarVisita, borrarVisita } from "@/lib/panel/acciones-extra";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";
import { etiquetaFecha } from "@/lib/agenda";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde, tarjeta } from "@/components/panel/estilos";

const ESTILO: Record<string, string> = {
  pendiente: "border-primary bg-primary/15 text-primary",
  confirmada: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  realizada: "border-border text-muted-foreground",
  cancelada: "border-border text-muted-foreground line-through",
};

export default async function Visitas() {
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("visitas").select("*").order("fecha", { ascending: true }).order("hora");
  const lista = data ?? [];

  return (
    <>
      <TituloPanel titulo="Visitas técnicas" ayuda="Solicitudes de visita que llegan desde la página. Confírmalas por WhatsApp." />
      {!lista.length && <p className="text-muted-foreground">Aún no hay visitas agendadas.</p>}
      <div className="space-y-4">
        {lista.map((v) => (
          <article key={v.id} className={tarjeta}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold capitalize">{etiquetaFecha(v.fecha)} · {v.hora}</h2>
                <p className="text-sm text-muted-foreground">{v.nombre} · {v.whatsapp}</p>
                <p className="mt-1 text-sm">{v.direccion}</p>
                {v.notas && <p className="mt-1 text-sm text-muted-foreground">{v.notas}</p>}
              </div>
              <span className={`border px-3 py-1 text-xs uppercase tracking-wider ${ESTILO[v.estado] ?? ""}`}>{v.estado}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={crearEnlaceWhatsApp(v.whatsapp, `Hola ${v.nombre}, te confirmamos la visita técnica de JGL Estructural para el ${etiquetaFecha(v.fecha)} a las ${v.hora} en ${v.direccion}.`)}
                target="_blank" rel="noopener noreferrer" className={botonBorde}
              >
                Confirmar por WhatsApp
              </a>
              {["confirmada", "realizada", "cancelada", "pendiente"].filter((e) => e !== v.estado).map((e) => (
                <form key={e} action={actualizarVisita}>
                  <input type="hidden" name="id" value={v.id} /><input type="hidden" name="estado" value={e} />
                  <button className={botonBorde}>Marcar {e}</button>
                </form>
              ))}
              <form action={borrarVisita}><input type="hidden" name="id" value={v.id} /><button className={botonBorde}>Borrar</button></form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
