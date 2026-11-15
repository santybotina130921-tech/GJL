"use client";

import { useEffect, useRef, useState } from "react";

export function Contador({ hasta, prefijo = "+" }: { hasta: number; prefijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValor(hasta);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const paso = (t: number) => {
          const p = Math.min((t - inicio) / 1800, 1);
          setValor(Math.round(hasta * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasta]);

  return (
    <span ref={ref}>
      {prefijo}
      {valor}
    </span>
  );
}
