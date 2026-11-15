"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icono } from "./iconos";
import { NAV } from "./navegacion";
import { PaletaComandos } from "./PaletaComandos";

export function CabeceraPanel({ correo, nuevos, avatar }: { correo: string; nuevos: number; avatar?: string }) {
  const ruta = usePathname();
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAbierta((a) => !a);
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  const actual =
    NAV.find((n) => (n.href === "/panel" ? ruta === n.href : ruta.startsWith(n.href)))?.texto ?? "Panel";

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6 md:px-10">
        <p className="hidden shrink-0 text-sm text-muted-foreground lg:block">
          Panel <span className="mx-1">/</span> <span className="text-foreground">{actual}</span>
        </p>
        <button
          type="button"
          onClick={() => setAbierta(true)}
          className="flex w-full max-w-md items-center gap-3 border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground sm:ml-auto"
        >
          <Icono nombre="buscar" className="h-4 w-4" />
          <span>Buscar o ir a…</span>
          <kbd className="ml-auto hidden border border-border px-1.5 text-[11px] sm:block">Ctrl K</kbd>
        </button>
        <Link href="/" target="_blank" className="hidden items-center gap-2 border border-border px-3 py-2 text-sm transition hover:border-primary sm:flex">
          <Icono nombre="sitio" className="h-4 w-4" /> Ver sitio
        </Link>
        <Link href="/panel/mensajes" aria-label={`${nuevos} mensajes nuevos`} className="relative border border-border p-2 transition hover:border-primary">
          <Icono nombre="mensajes" className="h-5 w-5" />
          {nuevos > 0 && (
            <span className="punto-vivo absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{nuevos}</span>
          )}
        </Link>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="Tu foto" className="h-9 w-9 shrink-0 rounded-full border border-border object-cover" />
        ) : (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-bold uppercase text-primary-foreground" title={correo}>
            {correo[0] ?? "?"}
          </span>
        )}
      </header>
      <PaletaComandos abierta={abierta} cerrar={() => setAbierta(false)} />
    </>
  );
}
