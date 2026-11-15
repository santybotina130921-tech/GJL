"use client";

import { useState } from "react";
import { guardarObra } from "@/lib/panel/acciones-extra";
import { boton, campo, etiqueta, tarjeta } from "./estilos";

type Obra = {
  id: string; nombre: string; cliente: string; cliente_whatsapp: string; descripcion: string;
  estado: string; avance: number; etapas: { nombre: string; avance: number }[];
  fecha_inicio: string | null; fecha_estimada: string | null; publica: boolean;
};

export function FormularioObra({ obra }: { obra: Obra }) {
  const [etapas, setEtapas] = useState(obra.etapas);
  const [avance, setAvance] = useState(obra.avance);
  const poner = (i: number, k: "nombre" | "avance", v: string) =>
    setEtapas((l) => l.map((e, n) => (n === i ? { ...e, [k]: k === "avance" ? Number(v) : v } : e)));

  return (
    <form action={guardarObra} className={`${tarjeta} grid gap-4 sm:grid-cols-2`}>
      <input type="hidden" name="id" value={obra.id} />
      <input type="hidden" name="etapas" value={JSON.stringify(etapas)} />
      <div><label className={etiqueta}>Nombre de la obra</label><input name="nombre" required defaultValue={obra.nombre} className={campo} /></div>
      <div><label className={etiqueta}>Cliente</label><input name="cliente" required defaultValue={obra.cliente} className={campo} /></div>
      <div><label className={etiqueta}>WhatsApp del cliente (opcional)</label><input name="cliente_whatsapp" defaultValue={obra.cliente_whatsapp} className={campo} /></div>
      <div>
        <label className={etiqueta}>Estado</label>
        <select name="estado" defaultValue={obra.estado} className={campo}>
          <option value="en_proceso">En proceso</option><option value="pausada">Pausada</option><option value="terminada">Terminada</option>
        </select>
      </div>
      <div className="sm:col-span-2"><label className={etiqueta}>Descripción</label><textarea name="descripcion" rows={3} defaultValue={obra.descripcion} className={campo} /></div>
      <div><label className={etiqueta}>Fecha de inicio</label><input name="fecha_inicio" type="date" defaultValue={obra.fecha_inicio ?? ""} className={campo} /></div>
      <div><label className={etiqueta}>Entrega estimada</label><input name="fecha_estimada" type="date" defaultValue={obra.fecha_estimada ?? ""} className={campo} /></div>

      <div className="sm:col-span-2">
        <label className={etiqueta}>Avance general: {avance}%</label>
        <input name="avance" type="range" min={0} max={100} value={avance} onChange={(e) => setAvance(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
      </div>

      <div className="sm:col-span-2">
        <label className={etiqueta}>Etapas</label>
        <div className="space-y-2">
          {etapas.map((e, i) => (
            <div key={i} className="grid grid-cols-[1fr_90px_auto] gap-2">
              <input value={e.nombre} onChange={(x) => poner(i, "nombre", x.target.value)} className={campo} aria-label="Nombre de la etapa" />
              <input type="number" min={0} max={100} value={e.avance} onChange={(x) => poner(i, "avance", x.target.value)} className={campo} aria-label="Avance de la etapa" />
              <button type="button" onClick={() => setEtapas((l) => l.filter((_, n) => n !== i))} className="border border-border px-3 transition hover:border-primary" aria-label="Quitar etapa">×</button>
            </div>
          ))}
        </div>
        <button type="button" disabled={etapas.length >= 12} onClick={() => setEtapas((l) => [...l, { nombre: "", avance: 0 }])} className="mt-3 border border-border px-4 py-2 text-sm transition hover:border-primary">Agregar etapa</button>
      </div>

      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="publica" defaultChecked={obra.publica} />
        Enlace activo (el cliente puede ver el avance con el código)
      </label>
      <div className="sm:col-span-2"><button type="submit" className={boton}>Guardar cambios</button></div>
    </form>
  );
}
