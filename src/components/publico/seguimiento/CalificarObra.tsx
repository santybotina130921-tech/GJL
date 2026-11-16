"use client";

import { useState } from "react";
import { calificarObra } from "@/lib/panel/acciones-sitio";

const campo = "mt-2 w-full border border-border bg-background px-4 py-3 outline-none transition focus:border-primary";

export function CalificarObra({ codigo }: { codigo: string }) {
  const [estrellas, setEstrellas] = useState(0);
  const [sobre, setSobre] = useState(0);
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [trampa, setTrampa] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "error">("");
  const [mensaje, setMensaje] = useState("");

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estrellas < 1) { setEstado("error"); setMensaje("Elige cuántas estrellas das."); return; }
    setEstado("enviando");
    const r = await calificarObra(codigo, estrellas, nombre, comentario, trampa);
    if (r.ok) { setEstado("ok"); return; }
    setEstado("error");
    setMensaje(
      r.motivo === "ya_calificada" ? "Esta obra ya fue calificada. ¡Gracias!" :
      r.motivo === "intentos" ? "Demasiados intentos. Espera un momento." :
      "No se pudo enviar. Inténtalo de nuevo.",
    );
  };

  if (estado === "ok") {
    return (
      <section className="entrar mt-12 border border-primary bg-card p-6">
        <p className="font-display text-3xl uppercase leading-none">¡Gracias por tu opinión!</p>
        <p className="mt-2 text-muted-foreground">La revisaremos y la publicaremos muy pronto.</p>
      </section>
    );
  }

  return (
    <section className="mt-12 border border-border bg-card p-6">
      <h2 className="font-display text-3xl uppercase leading-none">¿Cómo te fue con tu obra?</h2>
      <p className="mt-2 text-sm text-muted-foreground">Tu opinión nos ayuda a mejorar y a que otros clientes nos conozcan.</p>
      <form onSubmit={enviar} className="mt-6 space-y-5">
        <div role="radiogroup" aria-label="Calificación" className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={estrellas === n}
              aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
              onMouseEnter={() => setSobre(n)}
              onMouseLeave={() => setSobre(0)}
              onClick={() => setEstrellas(n)}
              className={`text-4xl leading-none transition-transform hover:scale-110 ${n <= (sobre || estrellas) ? "text-primary" : "text-border"}`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="text" value={trampa} onChange={(e) => setTrampa(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <label className="block text-sm text-muted-foreground">
          Tu nombre (como quieres que aparezca)
          <input value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} className={campo} />
        </label>
        <label className="block text-sm text-muted-foreground">
          Tu comentario (opcional)
          <textarea rows={3} maxLength={500} value={comentario} onChange={(e) => setComentario(e.target.value)} className={campo} />
        </label>
        {estado === "error" && <p role="alert" className="text-sm text-primary">{mensaje}</p>}
        <button type="submit" disabled={estado === "enviando"} className="btn-jgl disabled:opacity-60">
          {estado === "enviando" ? "Enviando..." : "Enviar calificación"} <span className="flecha" aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}
