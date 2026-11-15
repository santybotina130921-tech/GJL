"use client";

import { useState } from "react";
import { crearDocumento } from "@/lib/panel/acciones";
import { calcular, VistaDocumento, type DatosDoc } from "./VistaDocumento";
import { boton, botonBorde, campo, etiqueta } from "./estilos";

const CATALOGO = [
  { d: "Perfil tubular estructural 6 m", v: 85000 },
  { d: "Lámina de acero 3 mm", v: 230000 },
  { d: "Electrodo 6013 (kg)", v: 14000 },
  { d: "Mano de obra de soldador (día)", v: 120000 },
  { d: "Transporte", v: 150000 },
];

export function EditorDocumento() {
  const [d, setD] = useState<DatosDoc>({
    tipo: "cuenta_cobro",
    fecha: new Date().toISOString().slice(0, 10),
    prestador: "JGL Estructural",
    identificacion: "",
    cliente: "",
    concepto: "",
    items: [{ d: "", q: 1, v: 0 }],
    iva: 0,
    forma_pago: "Transferencia bancaria",
    cuenta: "",
    titular: "",
    validez: 15,
    entrega: "20 días hábiles",
  });
  const poner = <K extends keyof DatosDoc>(k: K, v: DatosDoc[K]) => setD((x) => ({ ...x, [k]: v }));
  const item = (i: number, k: "d" | "q" | "v", v: string) =>
    setD((x) => ({
      ...x,
      items: x.items.map((it, n) => (n === i ? { ...it, [k]: k === "d" ? v : Number(v) } : it)),
    }));
  const { total } = calcular(d);

  return (
    <form action={crearDocumento} className="grid gap-8 xl:grid-cols-2">
      <div className="space-y-5">
        <div className="flex gap-2">
          {(["cuenta_cobro", "cotizacion"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => poner("tipo", t)}
              className={`border px-4 py-2 text-sm transition ${d.tipo === t ? "border-primary bg-primary text-white" : "border-border hover:border-primary"}`}
            >
              {t === "cuenta_cobro" ? "Cuenta de cobro" : "Cotización"}
            </button>
          ))}
        </div>
        <input type="hidden" name="tipo" value={d.tipo} />
        <input type="hidden" name="items" value={JSON.stringify(d.items)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={etiqueta}>Fecha</label><input name="fecha" type="date" value={d.fecha} onChange={(e) => poner("fecha", e.target.value)} className={campo} /></div>
          <div><label className={etiqueta}>Identificación (NIT o cédula)</label><input name="identificacion" value={d.identificacion} onChange={(e) => poner("identificacion", e.target.value)} className={campo} /></div>
          <div className="sm:col-span-2"><label className={etiqueta}>Prestador del servicio</label><input name="prestador" value={d.prestador} onChange={(e) => poner("prestador", e.target.value)} className={campo} /></div>
          <div className="sm:col-span-2"><label className={etiqueta}>Cliente</label><input name="cliente" required value={d.cliente} onChange={(e) => poner("cliente", e.target.value)} className={campo} /></div>
          <div className="sm:col-span-2"><label className={etiqueta}>WhatsApp del cliente (para enlaces y recordatorios)</label><input name="cliente_whatsapp" type="tel" className={campo} /></div>
          <div className="sm:col-span-2"><label className={etiqueta}>Concepto</label><input name="concepto" value={d.concepto} onChange={(e) => poner("concepto", e.target.value)} className={campo} /></div>
        </div>

        <div>
          <label className={etiqueta}>Detalle del servicio</label>
          <div className="space-y-2">
            {d.items.map((it, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_120px_auto] gap-2">
                <input value={it.d} onChange={(e) => item(i, "d", e.target.value)} placeholder="Descripción" className={campo} aria-label="Descripción" />
                <input type="number" min={0} value={it.q} onChange={(e) => item(i, "q", e.target.value)} className={campo} aria-label="Cantidad" />
                <input type="number" min={0} value={it.v} onChange={(e) => item(i, "v", e.target.value)} className={campo} aria-label="Valor unitario" />
                <button type="button" onClick={() => setD((x) => ({ ...x, items: x.items.filter((_, n) => n !== i) }))} className={botonBorde} aria-label="Quitar">×</button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" onClick={() => setD((x) => ({ ...x, items: [...x.items, { d: "", q: 1, v: 0 }] }))} className={botonBorde}>Agregar ítem</button>
            <select
              value=""
              onChange={(e) => {
                const c = CATALOGO[Number(e.target.value)];
                if (c) setD((x) => ({ ...x, items: [...x.items.filter((i) => i.d || i.v), { d: c.d, q: 1, v: c.v }] }));
              }}
              className={`${campo} w-auto`}
            >
              <option value="">Agregar del catálogo…</option>
              {CATALOGO.map((c, i) => (<option key={c.d} value={i}>{c.d}</option>))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={etiqueta}>IVA %</label><input name="iva" type="number" min={0} max={100} value={d.iva} onChange={(e) => poner("iva", Number(e.target.value))} className={campo} /></div>
          <div>
            <label className={etiqueta}>Forma de pago</label>
            <select name="forma_pago" value={d.forma_pago} onChange={(e) => poner("forma_pago", e.target.value)} className={campo}>
              {["Transferencia bancaria", "Nequi", "Daviplata", "Efectivo"].map((f) => (<option key={f}>{f}</option>))}
            </select>
          </div>
          <div><label className={etiqueta}>Cuenta o celular</label><input name="cuenta" value={d.cuenta} onChange={(e) => poner("cuenta", e.target.value)} className={campo} /></div>
          <div><label className={etiqueta}>Titular</label><input name="titular" value={d.titular} onChange={(e) => poner("titular", e.target.value)} className={campo} /></div>
          {d.tipo === "cotizacion" ? (
            <>
              <div><label className={etiqueta}>Validez (días)</label><input name="validez" type="number" value={d.validez} onChange={(e) => poner("validez", Number(e.target.value))} className={campo} /></div>
              <div><label className={etiqueta}>Tiempo de entrega</label><input name="entrega" value={d.entrega} onChange={(e) => poner("entrega", e.target.value)} className={campo} /></div>
            </>
          ) : (
            <>
              <input type="hidden" name="validez" value={d.validez} />
              <input type="hidden" name="entrega" value={d.entrega} />
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className={boton}>Guardar documento</button>
          <span className="text-sm text-muted-foreground">Total: {new Intl.NumberFormat("es-CO").format(total)} COP</span>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Vista previa</p>
        <VistaDocumento d={d} />
      </div>
    </form>
  );
}
