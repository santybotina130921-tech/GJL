"use client";

import { useEffect, useState } from "react";

/** Barra de secciones de una página: resalta la sección que estás viendo. */
export function SubNav({ items }: { items: { id: string; texto: string }[] }) {
  const [activo, setActivo] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActivo(e.target.id)),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Secciones de la página"
      className="sticky z-30 border-b border-border bg-background/85 backdrop-blur"
      style={{ top: 65 }}
    >
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none]">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            aria-current={activo === i.id ? "true" : undefined}
            className={`shrink-0 border px-4 py-1.5 text-sm transition ${
              activo === i.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {i.texto}
          </a>
        ))}
      </div>
    </nav>
  );
}
