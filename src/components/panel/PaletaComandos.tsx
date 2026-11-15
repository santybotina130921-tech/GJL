"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icono, type IconoNombre } from "./iconos";
import { NAV } from "./navegacion";

type Comando = { texto: string; icono: IconoNombre; href: string; externo?: boolean; grupo: string };

const COMANDOS: Comando[] = [
  { texto: "Nuevo proyecto", icono: "mas", href: "/panel/proyectos/nuevo", grupo: "Crear" },
  { texto: "Nueva cuenta de cobro o cotización", icono: "mas", href: "/panel/documentos/nuevo", grupo: "Crear" },
  ...NAV.map((n) => ({ texto: n.texto, icono: n.icono, href: n.href, grupo: "Ir a" })),
  { texto: "Ver el sitio público", icono: "sitio", href: "/", externo: true, grupo: "Ir a" },
];

export function PaletaComandos({ abierta, cerrar }: { abierta: boolean; cerrar: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const entrada = useRef<HTMLInputElement>(null);

  const lista = COMANDOS.filter((c) => c.texto.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (abierta) {
      setQ("");
      setI(0);
      setTimeout(() => entrada.current?.focus(), 30);
    }
  }, [abierta]);

  const ir = (c?: Comando) => {
    if (!c) return;
    cerrar();
    if (c.externo) window.open(c.href, "_blank");
    else router.push(c.href);
  };

  const teclas = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(x + 1, lista.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((x) => Math.max(x - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); ir(lista[i]); }
    else if (e.key === "Escape") cerrar();
  };

  if (!abierta) return null;
  return (
    <div className="entrar fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-sm" onClick={cerrar}>
      <div className="w-full max-w-xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Buscar o ir a">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Icono nombre="buscar" className="h-5 w-5 text-primary" />
          <input
            ref={entrada}
            value={q}
            onChange={(e) => { setQ(e.target.value); setI(0); }}
            onKeyDown={teclas}
            placeholder="¿A dónde quieres ir?"
            className="w-full bg-transparent py-4 text-base outline-none"
          />
          <kbd className="border border-border px-1.5 text-[11px] text-muted-foreground">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {lista.length === 0 && <li className="p-4 text-sm text-muted-foreground">Sin resultados.</li>}
          {lista.map((c, n) => (
            <li key={c.texto}>
              <button
                type="button"
                onMouseEnter={() => setI(n)}
                onClick={() => ir(c)}
                className={`flex w-full items-center gap-3 px-3 py-3 text-left text-sm transition ${n === i ? "bg-background text-foreground shadow-[inset_3px_0_0_var(--primary)]" : "text-muted-foreground"}`}
              >
                <Icono nombre={c.icono} className={`h-[18px] w-[18px] ${n === i ? "text-primary" : ""}`} />
                <span className="flex-1">{c.texto}</span>
                <span className="text-[11px] uppercase tracking-wider">{c.grupo}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
