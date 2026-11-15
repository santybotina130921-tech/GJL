"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Diapositiva = { titulo: string; detalle: string; src?: string };

export function Carrusel({
  diapositivas,
  intervalo = 5000,
}: {
  diapositivas: Diapositiva[];
  intervalo?: number;
}) {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const total = diapositivas.length;

  useEffect(() => {
    if (pausa || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActual((a) => (a + 1) % total), intervalo);
    return () => clearInterval(t);
  }, [pausa, total, intervalo]);

  const ir = (i: number) => setActual((i + total) % total);

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Obras destacadas"
      className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-card"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      {diapositivas.map((d, i) => (
        <div
          key={d.titulo}
          aria-hidden={i !== actual}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === actual ? "opacity-100" : "opacity-0"
          }`}
        >
          {d.src ? (
            <Image
              src={d.src}
              alt={d.titulo}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 40vw, 100vw"
              className={`object-cover transition-transform duration-[6000ms] ease-out ${
                i === actual ? "scale-100" : "scale-110"
              }`}
            />
          ) : (
            <div className="placeholder-acero absolute inset-0 grid place-items-center text-xs text-muted-foreground">
              Foto real de la obra
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6 pb-14 pt-24 text-white">
            <p className="font-display text-3xl font-bold uppercase leading-none">
              {d.titulo}
            </p>
            <p className="mt-1 text-sm text-neutral-300">{d.detalle}</p>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-white">
        <div className="flex gap-2">
          {diapositivas.map((d, i) => (
            <button
              key={d.titulo}
              type="button"
              aria-label={`Ir a ${d.titulo}`}
              aria-current={i === actual}
              onClick={() => ir(i)}
              className={`h-1.5 transition-all ${
                i === actual ? "w-8 bg-white" : "w-4 bg-white/40"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => ir(actual - 1)}
            className="border border-white/30 px-3 py-1 text-sm hover:bg-white/10"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => ir(actual + 1)}
            className="border border-white/30 px-3 py-1 text-sm hover:bg-white/10"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
