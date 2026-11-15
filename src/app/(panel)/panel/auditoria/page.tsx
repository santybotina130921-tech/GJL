import Link from "next/link";
import { exigirAdmin } from "@/lib/panel/auth";
import { TituloPanel } from "@/components/panel/TituloPanel";

type Json = Record<string, unknown> | null;
const corto = (v: unknown) => { const s = JSON.stringify(v) ?? "—"; return s.length > 70 ? s.slice(0, 70) + "…" : s; };

function cambios(antes: Json, despues: Json): string[] {
  if (antes && despues) {
    return Object.keys(despues)
      .filter((k) => JSON.stringify(antes[k]) !== JSON.stringify(despues[k]))
      .map((k) => `${k}: ${corto(antes[k])} → ${corto(despues[k])}`);
  }
  const fila = despues ?? antes;
  return fila ? Object.entries(fila).slice(0, 8).map(([k, v]) => `${k}: ${corto(v)}`) : [];
}

const ACCION: Record<string, string> = { INSERT: "Creó", UPDATE: "Modificó", DELETE: "Borró" };

export default async function Auditoria({ searchParams }: { searchParams: Promise<{ tabla?: string }> }) {
  const { tabla } = await searchParams;
  const { sb } = await exigirAdmin();
  let q = sb.from("auditoria").select("*").order("creado_en", { ascending: false }).limit(200);
  if (tabla && /^[a-z_]{1,40}$/.test(tabla)) q = q.eq("tabla", tabla);
  const { data } = await q;
  const tablas = ["", "proyectos", "documentos", "movimientos", "obras", "ajustes", "perfiles", "entradas", "visitas", "cotizaciones"];

  return (
    <>
      <TituloPanel titulo="Registro de cambios" ayuda="Quién creó, modificó o borró cada cosa y cuándo. Se guardan los últimos 200 movimientos." />
      <div className="mb-6 flex flex-wrap gap-2">
        {tablas.map((t) => (
          <Link key={t} href={t ? `/panel/auditoria?tabla=${t}` : "/panel/auditoria"} className={`border px-3 py-1 text-sm transition ${(tabla ?? "") === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}>{t || "Todo"}</Link>
        ))}
      </div>
      {!data?.length && <p className="text-muted-foreground">Aún no hay movimientos.</p>}
      <ul className="space-y-2">
        {data?.map((r) => (
          <li key={r.id} className="border border-border bg-card/90">
            <details>
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                <span className="text-xs text-muted-foreground">{new Date(r.creado_en).toLocaleString("es-CO")}</span>
                <span><b>{r.email ?? "Sistema (visitante)"}</b> {ACCION[r.accion] ?? r.accion} en <b>{r.tabla}</b></span>
              </summary>
              <ul className="space-y-1 border-t border-border px-4 py-3 font-mono text-xs text-muted-foreground">
                {cambios(r.antes, r.despues).map((c, i) => (<li key={i} className="break-all">{c}</li>))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
