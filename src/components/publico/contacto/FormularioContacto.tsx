"use client";

import { useState } from "react";
import { enviarSolicitud } from "@/lib/panel/acciones-publicas";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

const tipos = ["Estructura metálica", "Cubierta o cercha", "Soldadura", "Portón o cerramiento", "Otro"];
const campo = "mt-2 w-full border border-border bg-background px-4 py-3 outline-none transition focus:border-primary";

export function FormularioContacto({ whatsapp }: { whatsapp: string }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState(tipos[0]);
  const [medidas, setMedidas] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [trampa, setTrampa] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const texto =
      `Hola, soy ${nombre}. Quiero cotizar: ${tipo}.` +
      (medidas ? ` Medidas aproximadas: ${medidas}.` : "") +
      (mensaje ? ` ${mensaje}` : "");
    // Primero se abre WhatsApp (para que el navegador no lo bloquee) y luego se guarda en el panel.
    window.open(crearEnlaceWhatsApp(whatsapp, texto), "_blank", "noopener,noreferrer");
    void enviarSolicitud({ nombre, whatsapp: telefono, tipo_trabajo: tipo, medidas, descripcion: mensaje, sitio_web: trampa });
  };

  return (
    <form onSubmit={enviar} className="entrar space-y-5 border border-border bg-card p-8">
      <h2 className="font-display text-4xl font-bold uppercase leading-none">Solicita tu cotización</h2>
      <input type="text" name="sitio_web" value={trampa} onChange={(e) => setTrampa(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <label className="block text-sm text-muted-foreground">
        Nombre
        <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
      </label>
      <label className="block text-sm text-muted-foreground">
        Tu WhatsApp o teléfono
        <input required type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={campo} />
      </label>
      <label className="block text-sm text-muted-foreground">
        Tipo de trabajo
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={campo}>
          {tipos.map((t) => (<option key={t}>{t}</option>))}
        </select>
      </label>
      <label className="block text-sm text-muted-foreground">
        Medidas aproximadas
        <input value={medidas} onChange={(e) => setMedidas(e.target.value)} placeholder="Ej. 12 m x 8 m" className={campo} />
      </label>
      <label className="block text-sm text-muted-foreground">
        Cuéntanos qué necesitas
        <textarea rows={4} value={mensaje} onChange={(e) => setMensaje(e.target.value)} className={campo} />
      </label>
      <button type="submit" className="btn-jgl">
        Enviar por WhatsApp <span className="flecha" aria-hidden="true">→</span>
      </button>
      <p className="text-xs text-muted-foreground">Se abrirá WhatsApp con tu mensaje ya escrito.</p>
    </form>
  );
}
