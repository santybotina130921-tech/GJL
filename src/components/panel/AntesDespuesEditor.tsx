"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarAntesDespues } from "@/lib/panel/acciones";
import { SubidaImagen } from "./SubidaImagen";
import { boton, tarjeta } from "./estilos";

export function AntesDespuesEditor({ id, antes, despues }: { id: string; antes: string; despues: string }) {
  const router = useRouter();
  const [a, setA] = useState(antes);
  const [d, setD] = useState(despues);
  const [msg, setMsg] = useState("");
  const [pend, inicio] = useTransition();

  const guardar = () =>
    inicio(async () => {
      const r = await guardarAntesDespues(id, a, d);
      setMsg(r.ok ? "Guardado. Ya aparece en la página." : (r.error ?? "Error"));
      router.refresh();
    });

  return (
    <div className={`${tarjeta} space-y-5`}>
      <p className="text-sm text-muted-foreground">
        Sube una foto de cómo estaba la obra y otra de cómo quedó. La página las muestra con un deslizador para compararlas.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Antes</p>
          <SubidaImagen valor={a} onCambio={setA} carpeta={`proyectos/${id}`} />
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Después</p>
          <SubidaImagen valor={d} onCambio={setD} carpeta={`proyectos/${id}`} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={guardar} disabled={pend} className={boton}>{pend ? "Guardando..." : "Guardar antes y después"}</button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}
