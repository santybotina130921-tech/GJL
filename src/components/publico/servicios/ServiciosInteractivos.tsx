"use client";

import { useState } from "react";
import { Boton } from "@/components/publico/Boton";
import type { Servicio } from "@/config/servicios";

export function ServiciosInteractivos({ servicios }: { servicios: Servicio[] }) {
  const [i, setI] = useState(0);
  const s = servicios[i] ?? servicios[0];
  if (!s) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
        <ul>
          {servicios.map((x, n) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => setI(n)}
                onMouseEnter={() => setI(n)}
                onFocus={() => setI(n)}
                aria-current={n === i}
                className={`flex w-full items-center justify-between border-b border-border py-6 text-left font-display text-4xl font-semibold uppercase leading-none transition-all duration-300 sm:text-5xl ${
                  n === i ? "pl-4 text-primary" : "text-muted-foreground hover:pl-2 hover:text-foreground"
                }`}
              >
                {x.nombre}
                <span aria-hidden="true" className={`transition-transform ${n === i ? "translate-x-0" : "-translate-x-2 opacity-0"}`}>→</span>
              </button>
            </li>
          ))}
        </ul>
        <div key={s.id} className="entrar border border-border bg-card p-8">
          <h2 className="font-display text-4xl font-bold uppercase leading-none">{s.nombre}</h2>
          <p className="mt-4 text-muted-foreground">{s.descripcion}</p>
          <ul className="mt-6 space-y-3">
            {s.capacidades.map((c, n) => (
              <li key={c} className="entrar flex gap-3" style={{ animationDelay: `${120 + n * 80}ms` }}>
                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-primary" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Boton href="/contacto">Cotizar este servicio</Boton>
          </div>
        </div>
      </div>
    </section>
  );
}
