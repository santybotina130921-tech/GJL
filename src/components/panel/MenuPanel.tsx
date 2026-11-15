"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icono } from "./iconos";
import { NAV } from "./navegacion";

export function MenuPanel({
  correo,
  salir,
  nuevos,
  avatar,
}: {
  correo: string;
  salir: () => Promise<void>;
  nuevos: number;
  avatar?: string;
}) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const activo = (href: string) => (href === "/panel" ? ruta === href : ruta.startsWith(href));
  const grupos = [...new Set(NAV.map((n) => n.grupo))];

  return (
    <aside className="border-b border-border bg-card/95 md:sticky md:top-0 md:h-screen md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-center justify-between p-4 md:block md:p-5">
        <Link href="/panel" className="block w-28 overflow-hidden bg-[#e4e5e7] transition-transform duration-300 hover:scale-105">
          <Image src="/logo-nav.jpg" alt="JGL Estructural, panel" width={372} height={318} className="h-auto w-full" />
        </Link>
        <button type="button" onClick={() => setAbierto(!abierto)} className="border border-border px-3 py-1 text-sm md:hidden">
          {abierto ? "Cerrar" : "Menú"}
        </button>
      </div>

      <nav className={`${abierto ? "block" : "hidden"} px-3 pb-6 md:block`}>
        {grupos.map((g) => (
          <div key={g} className="mb-5">
            <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{g}</p>
            {NAV.filter((n) => n.grupo === g).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setAbierto(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 ${
                  activo(n.href) ? "nav-activo text-foreground" : "text-muted-foreground hover:translate-x-1 hover:bg-background/60 hover:text-foreground"
                }`}
              >
                <Icono nombre={n.icono} className={`h-[18px] w-[18px] shrink-0 transition-colors ${activo(n.href) ? "text-primary" : "group-hover:text-primary"}`} />
                <span className="flex-1">{n.texto}</span>
                {n.href === "/panel/mensajes" && nuevos > 0 && (
                  <span className="punto-vivo grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{nuevos}</span>
                )}
              </Link>
            ))}
          </div>
        ))}

        <div className="mt-6 border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Tu foto" className="h-9 w-9 shrink-0 rounded-full border border-border object-cover" />
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-bold uppercase text-primary-foreground">{correo[0] ?? "?"}</span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm">{correo}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
          <form action={salir} className="mt-3">
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted-foreground transition hover:text-primary">
              <Icono nombre="salir" className="h-[18px] w-[18px]" /> Cerrar sesión
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
