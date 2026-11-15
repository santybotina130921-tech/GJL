"use client";

import Link from "next/link";

/** Tarjeta con una luz que sigue al mouse. Si recibe href, funciona como enlace. */
export function TarjetaBrillo({
  children,
  className = "",
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const mover = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const clases = `brillo block border border-border bg-card/90 ${className}`;
  return href ? (
    <Link href={href} onMouseMove={mover} className={clases}>{children}</Link>
  ) : (
    <div onMouseMove={mover} className={clases}>{children}</div>
  );
}
