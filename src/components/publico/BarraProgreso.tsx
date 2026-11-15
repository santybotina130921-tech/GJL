"use client";

import { useEffect, useRef } from "react";

export function BarraProgreso() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const actualizar = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, window.scrollY / total) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    return () => window.removeEventListener("scroll", actualizar);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left scale-x-0 bg-primary"
    />
  );
}
