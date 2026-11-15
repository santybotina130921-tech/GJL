"use client";

import { useEffect, useRef } from "react";

/**
 * Texto que se va "encendiendo" palabra por palabra mientras haces scroll.
 */
export function TextoRevelado({
  texto,
  className,
}: {
  texto: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const palabras = texto.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("span"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }

    let raf = 0;
    const actualizar = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const inicio = vh * 0.92; // el bloque empieza a revelarse al entrar
      const fin = vh * 0.35; // termina cuando sube a esta altura
      const p = Math.min(1, Math.max(0, (inicio - r.top) / (inicio - fin + r.height * 0.5)));
      const n = spans.length;
      const x = p * (n + 6);
      spans.forEach((s, i) => {
        const o = Math.min(1, Math.max(0.15, (x - i) / 6));
        s.style.opacity = String(o);
      });
    };
    const alScroll = () => {
      if (!raf) raf = requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {palabras.map((p, i) => (
        <span
          key={i}
          className="transition-opacity duration-300"
          style={{ opacity: 0.15 }}
        >
          {p}
          {i < palabras.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
