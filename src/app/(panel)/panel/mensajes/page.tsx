import { exigirAdmin } from "@/lib/panel/auth";
import { borrarMensaje, cambiarEstadoMensaje } from "@/lib/panel/acciones";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde, tarjeta } from "@/components/panel/estilos";

export default async function Mensajes() {
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("cotizaciones").select("*").order("creado_en", { ascending: false });

  return (
    <>
      <TituloPanel titulo="Mensajes" ayuda="Solicitudes de cotización que llegan desde el formulario de la página." />
      {!data?.length && <p className="text-muted-foreground">Todavía no ha llegado ninguna solicitud.</p>}
      <div className="space-y-4">
        {data?.map((m) => (
          <article key={m.id} className={`${tarjeta} transition duration-300 hover:-translate-y-0.5 hover:border-primary/60 ${m.estado === "nueva" ? "border-primary/60" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{m.nombre}</h2>
                <p className="text-sm text-muted-foreground">
                  {m.whatsapp} · {new Date(m.creado_en).toLocaleString("es-CO")}
                </p>
              </div>
              <span className={`border px-3 py-1 text-xs uppercase tracking-wider ${m.estado === "nueva" ? "border-primary bg-primary/15 text-primary" : m.estado === "atendida" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-border text-muted-foreground"}`}>
                {m.estado}
              </span>
            </div>
            <p className="mt-3 text-sm"><b>Trabajo:</b> {m.tipo_trabajo || "—"} {m.medidas && `· ${m.medidas}`}</p>
            {m.descripcion && <p className="mt-1 text-sm text-muted-foreground">{m.descripcion}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={crearEnlaceWhatsApp(m.whatsapp, `Hola ${m.nombre}, te escribimos de JGL Estructural sobre tu solicitud de ${m.tipo_trabajo || "cotización"}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={botonBorde}
              >
                WhatsApp directo
              </a>
              {["atendida", "descartada", "nueva"]
                .filter((e) => e !== m.estado)
                .map((e) => (
                  <form key={e} action={cambiarEstadoMensaje}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="estado" value={e} />
                    <button className={botonBorde}>Marcar {e}</button>
                  </form>
                ))}
              <form action={borrarMensaje}>
                <input type="hidden" name="id" value={m.id} />
                <button className={botonBorde}>Borrar</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
