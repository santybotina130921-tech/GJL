import { formatoCOP, numeroALetras } from "@/lib/documentos/letras";

export type DatosDoc = {
  tipo: "cuenta_cobro" | "cotizacion";
  numero?: number;
  fecha: string;
  prestador: string;
  identificacion: string;
  cliente: string;
  concepto: string;
  items: { d: string; q: number; v: number }[];
  iva: number;
  forma_pago: string;
  cuenta: string;
  titular: string;
  validez: number;
  entrega: string;
  valor_cotizacion?: number;
};

export function calcular(d: Pick<DatosDoc, "items" | "iva">) {
  const subtotal = d.items.reduce((a, x) => a + (Number(x.q) || 0) * (Number(x.v) || 0), 0);
  const iva = (subtotal * (Number(d.iva) || 0)) / 100;
  return { subtotal, iva, total: Math.round(subtotal + iva) };
}

export function VistaDocumento({ d }: { d: DatosDoc }) {
  const { subtotal, iva, total } = calcular(d);
  const cot = d.tipo === "cotizacion";
  return (
    <div id="documento" className="doc-papel mx-auto w-full max-w-3xl p-8 text-sm shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-bold uppercase leading-none">{cot ? "Cotización" : "Cuenta de cobro"}</h2>
          <p className="mt-1 text-neutral-600">
            N° {d.numero ? String(d.numero).padStart(3, "0") : "(se asigna al guardar)"} · {d.fecha}
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-jgl.jpg" alt="JGL Estructural" className="h-20 w-auto" />
      </div>

      <div className="mt-6 space-y-1">
        <p><b>Prestador:</b> {d.prestador} {d.identificacion && `· ${d.identificacion}`}</p>
        <p><b>Cliente:</b> {d.cliente}</p>
        <p><b>Concepto:</b> {d.concepto}</p>
      </div>

      <table className="my-6 w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-800 text-left">
            <th className="py-2">Detalle</th>
            <th className="py-2">Cant.</th>
            <th className="py-2">V. unitario</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {d.items.map((x, i) => (
            <tr key={i} className="border-b border-neutral-300">
              <td className="py-2">{x.d}</td>
              <td className="py-2">{x.q}</td>
              <td className="py-2">{formatoCOP(Number(x.v))}</td>
              <td className="py-2 text-right">{formatoCOP((Number(x.q) || 0) * (Number(x.v) || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-1 text-right">
        <p>Subtotal {formatoCOP(subtotal)}</p>
        <p>IVA {d.iva} %: {formatoCOP(iva)}</p>
        <p className="text-xl font-bold">Total a pagar: {formatoCOP(total)}</p>
      </div>

      <p className="mt-4"><b>Valor en letras:</b> {numeroALetras(total)} pesos m/cte.</p>
      <p className="mt-1"><b>Forma de pago:</b> {d.forma_pago} · {d.cuenta} · Titular: {d.titular}</p>
      {cot && <p className="mt-1"><b>Validez de la oferta:</b> {d.validez} días · <b>Entrega:</b> {d.entrega}</p>}
      {cot && (d.valor_cotizacion ?? 0) > 0 && (
        <p className="mt-4 border-t border-neutral-300 pt-3">
          <b>Valor de esta cotización (se cobra aparte del trabajo):</b> {formatoCOP(Number(d.valor_cotizacion))}
        </p>
      )}
    </div>
  );
}
