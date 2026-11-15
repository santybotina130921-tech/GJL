"use client";

import Image from "next/image";
import { useState } from "react";

/** Compara dos fotos arrastrando el control (mouse, dedo o teclado). */
export function ComparadorAntesDespues({
  antes,
  despues,
  alt,
}: {
  antes?: string;
  despues?: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[16/10] w-full select-none overflow-hidden border border-border bg-card">
      {despues ? (
        <Image src={despues} alt={`${alt}: después`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      ) : (
        <div className="placeholder-acero absolute inset-0" />
      )}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {antes ? (
          <Image src={antes} alt={`${alt}: antes`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#2a2c30]" />
        )}
      </div>

      <span className="absolute left-3 top-3 bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Antes</span>
      <span className="absolute right-3 top-3 bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">Después</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg">↔</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparar antes y después"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
