"use client";

import { useState } from "react";
import { responderCotizacion } from "@/lib/panel/acciones-sitio";

const campo = "mt-2 w-full border border-border bg-background px-4 py-3 outline-none transition focus:border-primary";

export function RespuestaCotizacion({ token }: { token: string }) {
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "aprobada" | "rechazada" | "error">("");

  const responder = async (decision: "aprobada" | "rechazada") => {
    if (nombre.trim().length < 2) { setEstado("error"); return; }
    setEstado("enviando");
    const r = await responderCotizacion(token, decision, nombre, comentario);
    setEstado(r.ok ? decision : "error");
  };

  if (estado === "aprobada" || estado === "rechazada") {
    return (
      <div className="entrar mt-8 border border-primary bg-card p-6">
        <p className="font-display text-3xl uppercase leading-none">{estado === "aprobada" ? "¡Cotización aprobada!" : "Respuesta registrada"}</p>
        <p className="mt-2 text-muted-foreground">Gracias. Nos pondremos en contacto contigo.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4 border border-border bg-card p-6">
      <label className="block text-sm text-muted-foreground">Tu nombre completo<input value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} /></label>
      <label className="block text-sm text-muted-foreground">Comentario (opcional)<textarea rows={3} value={comentario} onChange={(e) => setComentario(e.target.value)} className={campo} /></label>
      {estado === "error" && <p role="alert" className="text-sm text-primary">Escribe tu nombre. Si ya respondiste o la oferta venció, no se puede cambiar.</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={estado === "enviando"} onClick={() => responder("aprobada")} className="btn-jgl disabled:opacity-60">Aprobar cotización <span className="flecha" aria-hidden="true">→</span></button>
        <button type="button" disabled={estado === "enviando"} onClick={() => responder("rechazada")} className="btn-jgl btn-jgl-o disabled:opacity-60">Rechazar</button>
      </div>
    </div>
  );
}
