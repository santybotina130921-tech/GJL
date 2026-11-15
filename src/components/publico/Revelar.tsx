"use client";

import { useEffect, useRef } from "react";

export function Revelar({
  children,
  retardo = 0,
  className = "",
}: {
  children: React.ReactNode;
  retardo?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      el.classList.add("visto");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visto");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${className}`}
      style={{ "--r": `${retardo}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
