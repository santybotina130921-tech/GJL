"use client";

import Image from "next/image";
import { useState } from "react";
import { formatoCOP } from "@/lib/documentos/letras";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

export type Producto = { nombre: string; categoria: string; descripcion: string; imagen_url: string | null; precio_desde: number; medidas: string; unidad_precio: string };

export function GridCatalogo({ productos, whatsapp }: { productos: Producto[]; whatsapp: string }) {
  const [cat, setCat] = useState("Todos");
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  const lista = cat === "Todos" ? productos : productos.filter((p) => p.categoria === cat);

  return (
    <>
      {categorias.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {["Todos", ...categorias].map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)}
              className={`border px-5 py-2 text-sm transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p, i) => (
          <article key={p.nombre} className="entrar group flex flex-col border border-border bg-card transition-colors hover:border-primary" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="placeholder-acero relative aspect-[4/3] overflow-hidden">
              {p.imagen_url && <Image src={p.imagen_url} alt={p.nombre} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />}
              {p.categoria && <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">{p.categoria}</span>}
              <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/80">Imagen ilustrativa</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-3xl uppercase leading-none">{p.nombre}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.descripcion}</p>
              {p.medidas && <p className="mt-3 text-sm text-muted-foreground">Medidas: <b className="text-foreground">{p.medidas}</b></p>}
              {p.precio_desde > 0 && <p className="mt-1 text-lg">Desde <b className="text-primary">{formatoCOP(p.precio_desde)}</b>{p.unidad_precio ? ` por ${p.unidad_precio}` : ""}</p>}
              <a href={crearEnlaceWhatsApp(whatsapp, `Hola, quiero cotizar: ${p.nombre}`)} target="_blank" rel="noopener noreferrer" className="btn-jgl mt-5 self-start">
                Cotizar <span className="flecha" aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
