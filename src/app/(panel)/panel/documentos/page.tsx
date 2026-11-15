import Link from "next/link";
import { exigirAdmin } from "@/lib/panel/auth";
import { formatoCOP } from "@/lib/documentos/letras";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { boton } from "@/components/panel/estilos";

export default async function Documentos() {
  const { sb } = await exigirAdmin();
  const { data } = await sb
    .from("documentos")
    .select("id,tipo,numero,cliente,fecha,total,estado")
    .order("creado_en", { ascending: false });

  return (
    <>
      <TituloPanel titulo="Cuentas de cobro y cotizaciones" ayuda="Crea documentos con consecutivo automático y guárdalos como PDF.">
        <Link href="/panel/documentos/nuevo" className={boton}>Nuevo documento</Link>
      </TituloPanel>
      {!data?.length ? (
        <p className="text-muted-foreground">Todavía no hay documentos.</p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-card text-muted-foreground">
              <tr>
                <th className="p-3">Tipo</th><th className="p-3">N°</th><th className="p-3">Cliente</th>
                <th className="p-3">Fecha</th><th className="p-3">Estado</th><th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-card">
                  <td className="p-3">{d.tipo === "cotizacion" ? "Cotización" : "Cuenta de cobro"}</td>
                  <td className="p-3"><Link href={`/panel/documentos/${d.id}`} className="text-primary hover:underline">{String(d.numero).padStart(3, "0")}</Link></td>
                  <td className="p-3">{d.cliente}</td>
                  <td className="p-3">{d.fecha}</td>
                  <td className="p-3"><span className={`border px-2 py-0.5 text-xs ${d.estado === "pagado" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-border text-muted-foreground"}`}>{d.estado}</span></td>
                  <td className="p-3 text-right">{formatoCOP(Number(d.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
