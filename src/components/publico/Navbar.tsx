"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Boton } from "@/components/publico/Boton";

const enlaces = [
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/proyectos", texto: "Proyectos" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/blog", texto: "Blog" },
  { href: "/contacto", texto: "Contacto" },
];

export function Navbar() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [bajo, setBajo] = useState(false);

  useEffect(() => {
    const f = () => setBajo(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const activo = (href: string) => ruta === href || ruta.startsWith(href + "/");

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          bajo ? "border-border bg-background/85 py-1 backdrop-blur" : "border-transparent bg-transparent py-3"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            aria-label="JGL Estructural, ir al inicio"
            className="block overflow-hidden bg-[#e4e5e7] transition-transform duration-300 hover:scale-105"
          >
            <Image src="/logo-nav.jpg" alt="JGL Estructural" width={372} height={318} priority className={`w-auto transition-all duration-300 ${bajo ? "h-14" : "h-20"}`} />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className={`relative text-sm transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 ${
                  activo(e.href) ? "text-foreground after:scale-x-100" : "text-muted-foreground after:scale-x-0"
                }`}
              >
                {e.texto}
              </Link>
            ))}
            <Link
              href="/login"
              className="border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              Ingresar
            </Link>
            <Boton href="/cotizador">Cotizar</Boton>
          </nav>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setAbierto(true)}
            className="border border-border px-4 py-2 text-sm md:hidden"
          >
            Menú
          </button>
        </div>
      </header>

      {abierto && (
        <div className="entrar fixed inset-0 z-50 flex flex-col bg-background px-6 py-6 md:hidden">
          <div className="flex justify-end">
            <button type="button" onClick={() => setAbierto(false)} className="border border-border px-4 py-2 text-sm">
              Cerrar
            </button>
          </div>
          <div className="mt-10 flex flex-col gap-6">
            {[...enlaces, { href: "/visita", texto: "Agendar visita" }, { href: "/seguimiento", texto: "Seguimiento de obra" }, { href: "/login", texto: "Ingresar" }].map((e, i) => (
              <Link
                key={e.href}
                href={e.href}
                onClick={() => setAbierto(false)}
                className="entrar font-display text-4xl uppercase"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {e.texto}
              </Link>
            ))}
          </div>
          <div className="mt-auto" onClick={() => setAbierto(false)}>
            <Boton href="/cotizador">Cotizar</Boton>
          </div>
        </div>
      )}
    </>
  );
}
