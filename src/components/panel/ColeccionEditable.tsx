"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TABLAS, type Campo } from "@/lib/panel/tablas";
import { borrarFila, guardarFila } from "@/lib/panel/acciones";
import { SubidaImagen } from "./SubidaImagen";
import { boton, botonBorde, campo, etiqueta, tarjeta } from "./estilos";

type Fila = Record<string, unknown> & { id?: string };

const inicial = (c: Campo, v: unknown): unknown => {
  if (c.tipo === "lista") return Array.isArray(v) ? (v as string[]).join("\n") : "";
  if (c.tipo === "booleano") return v ?? true;
  if (c.tipo === "numero") return v ?? 0;
  return v ?? "";
};

function Editor({ tabla, fila, alGuardar }: { tabla: string; fila: Fila; alGuardar?: () => void }) {
  const cfg = TABLAS[tabla];
  const router = useRouter();
  const [datos, setDatos] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(cfg.campos.map((c) => [c.nombre, inicial(c, fila[c.nombre])])),
  );
  const [msg, setMsg] = useState("");
  const [pend, inicio] = useTransition();
  const cambiar = (n: string, v: unknown) => setDatos((d) => ({ ...d, [n]: v }));

  const guardar = () =>
    inicio(async () => {
      const r = await guardarFila(tabla, fila.id ?? null, datos);
      setMsg(r.ok ? "Guardado" : (r.error ?? "Error"));
      if (r.ok) {
        router.refresh();
        alGuardar?.();
      }
    });

  const borrar = () => {
    if (!fila.id || !confirm("¿Borrar este elemento?")) return;
    inicio(async () => {
      const r = await borrarFila(tabla, fila.id!);
      setMsg(r.ok ? "" : (r.error ?? "Error"));
      router.refresh();
    });
  };

  return (
    <div className={`${tarjeta} space-y-4`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {cfg.campos.map((c) => (
          <div key={c.nombre} className={c.tipo === "largo" || c.tipo === "lista" || c.tipo === "imagen" ? "sm:col-span-2" : ""}>
            {c.tipo === "booleano" ? (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(datos[c.nombre])} onChange={(e) => cambiar(c.nombre, e.target.checked)} />
                {c.etiqueta}
              </label>
            ) : (
              <>
                <label className={etiqueta}>{c.etiqueta}</label>
                {c.tipo === "largo" || c.tipo === "lista" ? (
                  <textarea rows={c.tipo === "lista" ? 5 : 3} value={String(datos[c.nombre] ?? "")} onChange={(e) => cambiar(c.nombre, e.target.value)} className={campo} />
                ) : c.tipo === "imagen" ? (
                  <SubidaImagen valor={String(datos[c.nombre] ?? "")} onCambio={(u) => cambiar(c.nombre, u)} carpeta={tabla} />
                ) : (
                  <input type={c.tipo === "numero" ? "number" : "text"} value={String(datos[c.nombre] ?? "")} onChange={(e) => cambiar(c.nombre, e.target.value)} className={campo} />
                )}
                {c.ayuda && <p className="mt-1 text-xs text-muted-foreground">{c.ayuda}</p>}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={guardar} disabled={pend} className={boton}>
          {pend ? "Guardando..." : fila.id ? "Guardar cambios" : "Agregar"}
        </button>
        {fila.id && (
          <button type="button" onClick={borrar} disabled={pend} className={botonBorde}>Borrar</button>
        )}
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}

export function ColeccionEditable({ tabla, filas }: { tabla: string; filas: Fila[] }) {
  const cfg = TABLAS[tabla];
  const [nuevo, setNuevo] = useState(0);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 font-display text-2xl font-semibold uppercase">Agregar nuevo</h2>
        <Editor key={nuevo} tabla={tabla} fila={{}} alGuardar={() => setNuevo((n) => n + 1)} />
      </div>
      <div>
        <h2 className="mb-3 font-display text-2xl font-semibold uppercase">Actuales ({filas.length})</h2>
        {filas.length === 0 && <p className="text-sm text-muted-foreground">Todavía no hay elementos.</p>}
        <div className="space-y-4">
          {filas.map((f) => (
            <details key={f.id} className="group border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
                <span className="font-medium">{String(f[cfg.resumen] ?? "(sin título)")}</span>
                <span className="text-xs text-muted-foreground">
                  {f.activo === false ? "Oculto · " : ""}Editar <span className="inline-block transition-transform group-open:rotate-90">›</span>
                </span>
              </summary>
              <div className="border-t border-border p-4">
                <Editor tabla={tabla} fila={f} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
