"use client";

import { useEffect, useRef } from "react";

const palabras = [
  "Soldadura MIG",
  "Soldadura TIG",
  "Electrodo revestido",
  "Cerchas",
  "Naves industriales",
  "Cubiertas",
  "Portones",
  "Montaje en obra",
];

/** Cinta que avanza sola y que se puede arrastrar con el mouse o el dedo. */
export function CintaProcesos() {
  const pista = useRef<HTMLDivElement>(null);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pista.current;
    const cont = contenedor.current;
    if (!el || !cont) return;

    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0;
    let arrastrando = false;
        let ultimo = 0;
    let raf = 0;

    const pintar = () => {
      const mitad = el.scrollWidth / 2;
      if (mitad > 0) x = ((x % mitad) + mitad) % mitad;
      el.style.transform = `translateX(${-x}px)`;
    };
    const paso = () => {
      if (!arrastrando) x += reducir ? 0.3 : 0.9;
      pintar();
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);

    const abajo = (e: PointerEvent) => {
      arrastrando = true;
      ultimo = e.clientX;
      cont.setPointerCapture(e.pointerId);
    };
    const mover = (e: PointerEvent) => {
      if (!arrastrando) return;
      x -= e.clientX - ultimo;
      ultimo = e.clientX;
    };
    const arriba = () => {
      arrastrando = false;
    };

    cont.addEventListener("pointerdown", abajo);
    cont.addEventListener("pointermove", mover);
    cont.addEventListener("pointerup", arriba);
    cont.addEventListener("pointercancel", arriba);
    return () => {
      cancelAnimationFrame(raf);
      cont.removeEventListener("pointerdown", abajo);
      cont.removeEventListener("pointermove", mover);
      cont.removeEventListener("pointerup", arriba);
      cont.removeEventListener("pointercancel", arriba);
    };
  }, []);

  const lista = [...palabras, ...palabras, ...palabras, ...palabras];

  return (
    <div
      ref={contenedor}
      className="cursor-grab touch-pan-y select-none overflow-hidden border-y border-border bg-card py-5 active:cursor-grabbing"
      aria-label="Procesos y trabajos. Arrastra para mover."
    >
      <div ref={pista} className="flex w-max will-change-transform">
        {lista.map((p, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap font-display text-3xl font-semibold uppercase text-muted-foreground transition-colors hover:text-foreground sm:text-4xl"
          >
            {p}
            <span className="mx-8 text-primary" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
