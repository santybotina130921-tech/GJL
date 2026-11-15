"use client";

import { useEffect, useMemo, useState } from "react";
import { agendarVisita, horasOcupadas } from "@/lib/panel/acciones-sitio";
import { etiquetaFecha, fechasDisponibles, hoyBogota, HORAS } from "@/lib/agenda";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

const campo = "mt-2 w-full border border-border bg-background px-4 py-3 outline-none transition focus:border-primary";

export function AgendarVisita({ whatsapp }: { whatsapp: string }) {
  const dias = useMemo(() => fechasDisponibles(hoyBogota(), 14), []);
  const [fecha, setFecha] = useState(dias[0]);
  const [hora, setHora] = useState("");
  const [ocupadas, setOcupadas] = useState<string[]>([]);
  const [f, setF] = useState({ nombre: "", whatsapp: "", direccion: "", notas: "", sitio_web: "" });
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "error">("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let vivo = true;
    setHora("");
    horasOcupadas(fecha).then((h) => vivo && setOcupadas(h));
    return () => { vivo = false; };
  }, [fecha]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hora) { setMensaje("Elige una hora."); return; }
    setEstado("enviando");
    const r = await agendarVisita({ ...f, fecha, hora });
    if (r.ok) { setEstado("ok"); return; }
    setEstado("error");
    setMensaje(
      r.motivo === "ocupado" ? "Esa hora se acaba de ocupar. Elige otra." :
      r.motivo === "intentos" ? "Demasiados intentos. Espera un momento." :
      "No se pudo agendar. Revisa los datos e inténtalo de nuevo.",
    );
    horasOcupadas(fecha).then(setOcupadas);
  };

  if (estado === "ok") {
    return (
      <div className="entrar border border-primary bg-card p-8">
        <h2 className="font-display text-4xl uppercase leading-none">¡Visita solicitada!</h2>
        <p className="mt-3 text-muted-foreground">
          {etiquetaFecha(fecha)} a las {hora}. Te confirmaremos por WhatsApp.
        </p>
        <a
          href={crearEnlaceWhatsApp(whatsapp, `Hola, soy ${f.nombre}. Acabo de solicitar una visita técnica para el ${etiquetaFecha(fecha)} a las ${hora}.`)}
          target="_blank" rel="noopener noreferrer" className="btn-jgl mt-6"
        >
          Confirmar por WhatsApp <span className="flecha" aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-8">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">1. Elige el día (lunes a sábado)</p>
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {dias.map((d) => (
            <button key={d} type="button" onClick={() => setFecha(d)} aria-pressed={fecha === d}
              className={`shrink-0 border px-4 py-3 text-sm capitalize transition ${fecha === d ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
              {etiquetaFecha(d)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm text-muted-foreground">2. Elige la hora</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {HORAS.map((h) => {
            const tomada = ocupadas.includes(h);
            return (
              <button key={h} type="button" disabled={tomada} onClick={() => setHora(h)} aria-pressed={hora === h}
                className={`border px-3 py-3 text-sm transition ${tomada ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-50" : hora === h ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                {h}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <input type="text" name="sitio_web" value={f.sitio_web} onChange={(e) => setF({ ...f, sitio_web: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <label className="text-sm text-muted-foreground">Nombre<input required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} className={campo} /></label>
        <label className="text-sm text-muted-foreground">WhatsApp<input required type="tel" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} className={campo} /></label>
        <label className="text-sm text-muted-foreground sm:col-span-2">Dirección de la obra<input required value={f.direccion} onChange={(e) => setF({ ...f, direccion: e.target.value })} className={campo} /></label>
        <label className="text-sm text-muted-foreground sm:col-span-2">¿Qué necesitas? (opcional)<textarea rows={3} value={f.notas} onChange={(e) => setF({ ...f, notas: e.target.value })} className={campo} /></label>
      </div>

      {mensaje && <p role="alert" className="text-sm text-primary">{mensaje}</p>}
      <button type="submit" disabled={estado === "enviando"} className="btn-jgl disabled:opacity-60">
        {estado === "enviando" ? "Agendando..." : "Agendar visita"} <span className="flecha" aria-hidden="true">→</span>
      </button>
    </form>
  );
}
