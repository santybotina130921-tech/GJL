"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Boton } from "@/components/publico/Boton";
import { ComparadorAntesDespues } from "@/components/publico/ComparadorAntesDespues";
import type { Proyecto } from "@/config/proyectos";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

export function GaleriaProyectos({ proyectos, whatsapp }: { proyectos: Proyecto[]; whatsapp: string }) {
  const [cat, setCat] = useState("Todos");
  const [sel, setSel] = useState<Proyecto | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  const categorias = [...new Set(proyectos.map((p) => p.categoria))];
  const lista = cat === "Todos" ? proyectos : proyectos.filter((p) => p.categoria === cat);

  const abrir = (p: Proyecto) => {
    setSel(p);
    dialogo.current?.showModal();
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-10 flex flex-wrap gap-2">
        {["Todos", ...categorias].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`border px-5 py-2 text-sm transition ${
              cat === c ? "border-primary bg-primary text-white" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => abrir(p)}
            className="entrar group border border-border bg-card text-left transition-colors hover:border-primary"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="placeholder-acero relative aspect-[4/3] overflow-hidden">
              {p.imagen && (
                <Image src={p.imagen} alt={p.titulo} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              )}
              <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">{p.categoria}</span>
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-transform duration-300 group-hover:translate-y-0">
                Ver proyecto →
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-3xl font-semibold uppercase leading-none">{p.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{[p.ubicacion, p.medidas].filter(Boolean).join(" · ")}</p>
            </div>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogo}
        onClick={(e) => e.target === dialogo.current && dialogo.current?.close()}
        className="dialogo m-auto max-h-[92vh] w-[min(94vw,760px)] overflow-y-auto border border-border bg-card p-0 text-foreground backdrop:bg-black/75"
      >
        {sel && (
          <div>
            {sel.antes && sel.despues && <ComparadorAntesDespues antes={sel.antes} despues={sel.despues} alt={sel.titulo} />}
            <div className={`placeholder-acero relative aspect-[16/9] ${sel.antes && sel.despues ? "hidden" : ""}`}>
              {sel.imagen && <Image src={sel.imagen} alt={sel.titulo} fill sizes="760px" className="object-cover" />}
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{sel.categoria}</p>
              <h3 className="mt-1 font-display text-4xl font-bold uppercase leading-none">{sel.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{[sel.ubicacion, sel.medidas].filter(Boolean).join(" · ")}</p>
              <p className="mt-4">{sel.descripcion}</p>

              {sel.media && sel.media.length > 1 && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {sel.media.map((m) =>
                    m.tipo === "video" ? (
                      <video key={m.url} src={m.url} controls preload="metadata" className="aspect-video w-full bg-black" />
                    ) : (
                      <div key={m.url} className="relative aspect-video">
                        <Image src={m.url} alt={sel.titulo} fill sizes="360px" className="object-cover" />
                      </div>
                    ),
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-4">
                <Boton href={crearEnlaceWhatsApp(whatsapp, `Hola, quiero cotizar algo similar a: ${sel.titulo}`)} externo>
                  Cotizar algo similar
                </Boton>
                <button type="button" onClick={() => dialogo.current?.close()} className="px-4 text-sm text-muted-foreground hover:text-foreground">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
