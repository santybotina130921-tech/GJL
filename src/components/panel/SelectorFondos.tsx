"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FONDOS } from "@/lib/panel/tablas";
import { guardarAjuste } from "@/lib/panel/acciones";
import { SubidaImagen } from "./SubidaImagen";
import { tarjeta } from "./estilos";

export function SelectorFondos({
  valores,
  items = FONDOS,
  carpeta = "fondos",
}: {
  valores: Record<string, string>;
  items?: { clave: string; etiqueta: string }[];
  carpeta?: string;
}) {
  const router = useRouter();
  const [vals, setVals] = useState(valores);
  const [msg, setMsg] = useState<Record<string, string>>({});

  const cambiar = async (clave: string, url: string) => {
    setVals((v) => ({ ...v, [clave]: url }));
    const r = await guardarAjuste(clave, url);
    setMsg((m) => ({ ...m, [clave]: r.ok ? "Guardado" : "No se pudo guardar" }));
    router.refresh();
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((f) => (
        <div key={f.clave} className={tarjeta}>
          <p className="mb-3 font-display text-2xl uppercase">{f.etiqueta}</p>
          <SubidaImagen valor={vals[f.clave]} carpeta={carpeta} onCambio={(u) => cambiar(f.clave, u)} />
          {msg[f.clave] && <p className="mt-2 text-xs text-primary">{msg[f.clave]}</p>}
        </div>
      ))}
    </div>
  );
}
