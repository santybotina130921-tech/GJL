"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { guardarAjuste } from "@/lib/panel/acciones";
import { TEMAS } from "@/lib/temas";

export function SelectorTema({ actual }: { actual: string }) {
  const router = useRouter();
  const [sel, setSel] = useState(actual);
  const [msg, setMsg] = useState("");

  const elegir = async (id: string) => {
    setSel(id);
    document.documentElement.dataset.tema = id; // vista previa inmediata
    const r = await guardarAjuste("tema", id);
    setMsg(r.ok ? "Color guardado en toda la página." : "No se pudo guardar.");
    router.refresh();
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {TEMAS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => elegir(t.id)}
            aria-pressed={sel === t.id}
            className={`relative border bg-card/90 p-4 text-left transition duration-300 hover:-translate-y-1 ${sel === t.id ? "border-primary shadow-[0_0_32px_-12px_var(--primary)]" : "border-border hover:border-muted-foreground"}`}
          >
            <div className="mb-3 flex h-16 items-end justify-between p-2" style={{ background: `linear-gradient(135deg, ${t.color}33, transparent 70%)`, border: `1px solid ${t.color}55` }}>
              <span className="px-2 py-1 text-[10px] font-bold uppercase" style={{ background: t.color, color: t.texto }}>Cotizar</span>
              <span className="h-6 w-6 rounded-full" style={{ background: t.color, boxShadow: `0 0 18px ${t.color}` }} />
            </div>
            <p className="font-display text-xl uppercase leading-none">{t.nombre}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            {sel === t.id && <span className="absolute right-2 top-2 bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">Activo</span>}
          </button>
        ))}
      </div>
      {msg && <p className="mt-3 text-sm text-primary">{msg}</p>}
    </div>
  );
}
