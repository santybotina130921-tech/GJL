"use client";

import { useState } from "react";
import { formatoCOP } from "@/lib/documentos/letras";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

export type Tarifa = { nombre: string; unidad: string; precio_min: number; precio_max: number };

export function Cotizador({ tarifas, whatsapp }: { tarifas: Tarifa[]; whatsapp: string }) {
  const [i, setI] = useState(0);
  const [cantidad, setCantidad] = useState(20);
  const t = tarifas[i];
  const min = t.precio_min * cantidad;
  const max = t.precio_max * cantidad;
  const mensaje = `Hola, usé el cotizador de la página: ${t.nombre}, ${cantidad} ${t.unidad}. Estimado: ${formatoCOP(min)} a ${formatoCOP(max)}. Quiero una cotización formal.`;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6 border border-border bg-card p-8">
        <label className="block text-sm text-muted-foreground">
          ¿Qué necesitas?
          <select value={i} onChange={(e) => setI(Number(e.target.value))} className="mt-2 w-full border border-border bg-background px-4 py-3 outline-none focus:border-primary">
            {tarifas.map((x, n) => (<option key={x.nombre} value={n}>{x.nombre}</option>))}
          </select>
        </label>
        <label className="block text-sm text-muted-foreground">
          Cantidad ({t.unidad})
          <input type="number" min={1} max={100000} value={cantidad} onChange={(e) => setCantidad(Math.max(1, Math.min(100000, Number(e.target.value) || 1)))} className="mt-2 w-full border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
        </label>
        <input type="range" min={1} max={500} value={Math.min(cantidad, 500)} onChange={(e) => setCantidad(Number(e.target.value))} aria-label="Cantidad" className="w-full accent-[var(--primary)]" />
      </div>

      <div className="flex flex-col justify-between border border-primary bg-card p-8">
        <div>
          <p className="text-sm text-muted-foreground">Estimado aproximado</p>
          <p className="mt-2 break-words font-display text-5xl leading-none text-primary">{formatoCOP(min)}</p>
          <p className="mt-1 font-display text-3xl leading-none text-muted-foreground">a {formatoCOP(max)}</p>
          <p className="mt-5 text-sm text-muted-foreground">Es solo una orientación. El valor final depende de los materiales, el diseño y la visita técnica.</p>
        </div>
        <a href={crearEnlaceWhatsApp(whatsapp, mensaje)} target="_blank" rel="noopener noreferrer" className="btn-jgl mt-8 self-start">
          Pedir cotización formal <span className="flecha" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
