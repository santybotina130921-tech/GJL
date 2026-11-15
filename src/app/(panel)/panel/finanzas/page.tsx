import Link from "next/link";
import { exigirAdmin } from "@/lib/panel/auth";
import { borrarMovimiento } from "@/lib/panel/acciones";
import { formatoCOP } from "@/lib/documentos/letras";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { FormularioMovimiento } from "@/components/panel/FormularioMovimiento";
import { ExportarCSV } from "@/components/panel/ExportarCSV";
import { BotonRecordatorio } from "@/components/panel/BotonRecordatorio";
import { botonBorde, tarjeta } from "@/components/panel/estilos";

const pad = (n: number) => String(n).padStart(2, "0");
const clave = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const suma = (l: { monto: unknown }[]) => l.reduce((s, x) => s + Number(x.monto), 0);

export default async function Finanzas({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; tipo?: string; error?: string }>;
}) {
  const { mes: mp, tipo, error } = await searchParams;
  const { sb } = await exigirAdmin();

  const mes = /^\d{4}-\d{2}$/.test(mp ?? "") ? (mp as string) : clave(new Date());
  const [a, m] = mes.split("-").map(Number);
  const inicio = `${mes}-01`;
  const fin = `${clave(new Date(a, m, 1))}-01`;
  const desde = `${clave(new Date(a, m - 6, 1))}-01`;
  const anterior = clave(new Date(a, m - 2, 1));
  const siguiente = clave(new Date(a, m, 1));
  const nombreMes = new Date(a, m - 1, 1).toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  const [{ data: movs }, { data: seis }, { data: pend }] = await Promise.all([
    sb.from("movimientos").select("*").gte("fecha", inicio).lt("fecha", fin).order("fecha", { ascending: false }).order("creado_en", { ascending: false }),
    sb.from("movimientos").select("fecha,tipo,monto").gte("fecha", desde).lt("fecha", fin),
    sb.from("documentos").select("id,numero,cliente,cliente_whatsapp,fecha,total,forma_pago,cuenta,titular,ultimo_recordatorio").eq("tipo", "cuenta_cobro").eq("estado", "pendiente").order("fecha"),
  ]);

  const lista = movs ?? [];
  const ingresos = suma(lista.filter((x) => x.tipo === "ingreso"));
  const egresos = suma(lista.filter((x) => x.tipo === "egreso"));
  const balance = ingresos - egresos;
  const porCobrar = (pend ?? []).reduce((s, x) => s + Number(x.total), 0);

  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(a, m - 6 + i, 1);
    const k = clave(d);
    const del = (seis ?? []).filter((x) => String(x.fecha).startsWith(k));
    return {
      etiqueta: d.toLocaleDateString("es-CO", { month: "short" }),
      ing: suma(del.filter((x) => x.tipo === "ingreso")),
      egr: suma(del.filter((x) => x.tipo === "egreso")),
    };
  });
  const max = Math.max(1, ...meses.flatMap((x) => [x.ing, x.egr]));

  const porCategoria = Object.entries(
    lista
      .filter((x) => x.tipo === "egreso")
      .reduce<Record<string, number>>((acc, x) => {
        const c = x.categoria || "Sin categoría";
        acc[c] = (acc[c] ?? 0) + Number(x.monto);
        return acc;
      }, {}),
  ).sort((x, y) => y[1] - x[1]);

  const visibles = tipo === "ingreso" || tipo === "egreso" ? lista.filter((x) => x.tipo === tipo) : lista;
  const filtro = (t: string, texto: string) => (
    <Link
      key={t}
      href={`/panel/finanzas?mes=${mes}${t ? `&tipo=${t}` : ""}`}
      className={`border px-4 py-1.5 text-sm transition ${(tipo ?? "") === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}
    >
      {texto}
    </Link>
  );

  return (
    <div className="space-y-8">
      <TituloPanel titulo="Ingresos y egresos" ayuda="Controla el dinero que entra y sale. Las cuentas de cobro marcadas como pagadas se registran solas como ingreso.">
        <div className="flex items-center gap-2">
          <Link href={`/panel/finanzas?mes=${anterior}`} className={botonBorde} aria-label="Mes anterior">←</Link>
          <span className="min-w-40 text-center font-display text-2xl capitalize">{nombreMes}</span>
          <Link href={`/panel/finanzas?mes=${siguiente}`} className={botonBorde} aria-label="Mes siguiente">→</Link>
        </div>
      </TituloPanel>

      {error && <p role="alert" className="text-sm text-primary">Revisa los datos del movimiento: concepto, fecha y monto son obligatorios.</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Ingresos", ingresos, "text-emerald-400"],
          ["Egresos", egresos, "text-foreground"],
          ["Balance del mes", balance, balance >= 0 ? "text-emerald-400" : "text-amber-400"],
          ["Por cobrar (cuentas pendientes)", porCobrar, "text-primary"],
        ].map(([t, n, c]) => (
          <div key={String(t)} className={tarjeta}>
            <p className="text-sm text-muted-foreground">{t}</p>
            <p className={`mt-2 break-words font-display text-4xl leading-none ${c}`}>{formatoCOP(Number(n))}</p>
          </div>
        ))}
      </div>

      {(pend ?? []).length > 0 && (
        <section className={tarjeta}>
          <h2 className="mb-4 font-display text-2xl uppercase">Cuentas por cobrar</h2>
          <ul className="divide-y divide-border">
            {(pend ?? []).map((d) => {
              const dias = Math.max(0, Math.floor((Date.now() - new Date(d.fecha + "T12:00:00").getTime()) / 86400000));
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <Link href={`/panel/documentos/${d.id}`} className="font-medium hover:text-primary">N° {String(d.numero).padStart(3, "0")} · {d.cliente}</Link>
                    <p className="text-xs text-muted-foreground">{formatoCOP(Number(d.total))} · hace {dias} días</p>
                  </div>
                  <BotonRecordatorio
                    id={d.id}
                    whatsapp={d.cliente_whatsapp}
                    ultimo={d.ultimo_recordatorio}
                    mensaje={`Hola ${d.cliente}, te escribimos de JGL Estructural. Te recordamos la cuenta de cobro N° ${String(d.numero).padStart(3, "0")} por ${formatoCOP(Number(d.total))}. Puedes pagar por ${d.forma_pago}${d.cuenta ? " al " + d.cuenta : ""}${d.titular ? " (titular: " + d.titular + ")" : ""}. ¡Gracias!`}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className={tarjeta}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl uppercase">Últimos 6 meses</h2>
            <p className="flex gap-4 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-2 w-2 bg-emerald-400" />Ingresos</span>
              <span><span className="mr-1 inline-block h-2 w-2 bg-zinc-400" />Egresos</span>
            </p>
          </div>
          <div className="mt-6 flex h-44 items-end gap-3">
            {meses.map((x, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div className="barra w-1/2 bg-emerald-400" title={`Ingresos ${formatoCOP(x.ing)}`} style={{ height: `${Math.max(2, (x.ing / max) * 100)}%`, animationDelay: `${i * 80}ms` }} />
                  <div className="barra w-1/2 bg-zinc-400" title={`Egresos ${formatoCOP(x.egr)}`} style={{ height: `${Math.max(2, (x.egr / max) * 100)}%`, animationDelay: `${i * 80 + 40}ms` }} />
                </div>
                <span className="text-xs uppercase text-muted-foreground">{x.etiqueta}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={tarjeta}>
          <h2 className="font-display text-2xl uppercase">En qué se gasta</h2>
          {porCategoria.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Sin egresos este mes.</p>}
          <ul className="mt-4 space-y-3">
            {porCategoria.map(([c, v]) => (
              <li key={c}>
                <div className="flex justify-between text-sm"><span>{c}</span><span className="text-muted-foreground">{formatoCOP(v)}</span></div>
                <div className="mt-1 h-1.5 bg-border">
                  <div className="barra h-full origin-left bg-primary" style={{ width: `${(v / (egresos || 1)) * 100}%`, transformOrigin: "left", animationName: "none" }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="mb-3 font-display text-2xl uppercase">Registrar movimiento</h2>
        <FormularioMovimiento />
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl uppercase">Movimientos de {nombreMes}</h2>
          <div className="flex flex-wrap items-center gap-2">
            {filtro("", "Todos")}
            {filtro("ingreso", "Ingresos")}
            {filtro("egreso", "Egresos")}
            <ExportarCSV nombre={`movimientos-${mes}`} filas={visibles} />
          </div>
        </div>
        {visibles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay movimientos en este mes.</p>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-card text-muted-foreground">
                <tr><th className="p-3">Fecha</th><th className="p-3">Concepto</th><th className="p-3">Método</th><th className="p-3 text-right">Monto</th><th className="p-3" /></tr>
              </thead>
              <tbody>
                {visibles.map((x) => (
                  <tr key={x.id} className="border-t border-border transition hover:bg-card">
                    <td className="p-3 whitespace-nowrap">{x.fecha}</td>
                    <td className="p-3">{x.concepto}<span className="block text-xs text-muted-foreground">{x.categoria}</span></td>
                    <td className="p-3">{x.metodo}</td>
                    <td className={`p-3 text-right font-semibold whitespace-nowrap ${x.tipo === "ingreso" ? "text-emerald-400" : ""}`}>
                      {x.tipo === "ingreso" ? "+" : "−"} {formatoCOP(Number(x.monto))}
                    </td>
                    <td className="p-3 text-right">
                      <form action={borrarMovimiento}>
                        <input type="hidden" name="id" value={x.id} />
                        <input type="hidden" name="mes" value={mes} />
                        <button className="text-xs text-muted-foreground hover:text-primary">Borrar</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
