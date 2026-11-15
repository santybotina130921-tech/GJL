"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { agregarAvance, borrarAvance } from "@/lib/panel/acciones-extra";
import { SubidaImagen } from "./SubidaImagen";
import { boton, botonBorde, campo, tarjeta } from "./estilos";

type Avance = { id: string; nota: string; foto_url: string | null; fecha: string };

export function GestorAvances({ obraId, avances }: { obraId: string; avances: Avance[] }) {
  const router = useRouter();
  const [nota, setNota] = useState("");
  const [foto, setFoto] = useState("");
  const [msg, setMsg] = useState("");
  const [pend, inicio] = useTransition();

  const agregar = () =>
    inicio(async () => {
      const r = await agregarAvance(obraId, nota, foto);
      if (r.ok) { setNota(""); setFoto(""); setMsg("Avance publicado."); router.refresh(); }
      else setMsg("Escribe una nota o sube una foto.");
    });

  return (
    <div className="space-y-6">
      <div className={`${tarjeta} space-y-4`}>
        <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={3} maxLength={500} placeholder="Ej. Hoy terminamos de soldar las cerchas." className={campo} />
        <SubidaImagen valor={foto} onCambio={setFoto} carpeta={`obras/${obraId}`} />
        <div className="flex items-center gap-4">
          <button type="button" onClick={agregar} disabled={pend} className={boton}>{pend ? "Publicando..." : "Publicar avance"}</button>
          {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
        </div>
      </div>
      <ul className="space-y-3">
        {avances.map((a) => (
          <li key={a.id} className={`${tarjeta} flex gap-4`}>
            {a.foto_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.foto_url} alt="" className="h-20 w-28 shrink-0 border border-border object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{a.fecha}</p>
              <p className="text-sm">{a.nota || "(solo foto)"}</p>
            </div>
            <button type="button" disabled={pend} onClick={() => confirm("¿Borrar este avance?") && inicio(async () => { await borrarAvance(a.id); router.refresh(); })} className={`${botonBorde} self-start`}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
