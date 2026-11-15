import { exigirAdmin } from "@/lib/panel/auth";
import { guardarAjustes } from "@/lib/panel/acciones";
import { AJUSTES_CAMPOS } from "@/lib/panel/tablas";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { boton, campo, etiqueta, tarjeta } from "@/components/panel/estilos";

export default async function Ajustes({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("ajustes").select("clave,valor");
  const v = Object.fromEntries((data ?? []).map((f) => [f.clave, f.valor]));

  return (
    <>
      <TituloPanel titulo="Datos y textos" ayuda="Teléfono, correo, horario y los textos de Nosotros." />
      {ok && <p className="mb-4 text-sm text-primary">Cambios guardados.</p>}
      <form action={guardarAjustes} className={`${tarjeta} max-w-2xl space-y-4`}>
        {AJUSTES_CAMPOS.map((c) => (
          <div key={c.nombre}>
            <label className={etiqueta}>{c.etiqueta}</label>
            {c.largo ? (
              <textarea name={c.nombre} rows={3} defaultValue={v[c.nombre] ?? ""} className={campo} />
            ) : (
              <input name={c.nombre} defaultValue={v[c.nombre] ?? ""} className={campo} />
            )}
          </div>
        ))}
        <button type="submit" className={boton}>Guardar</button>
      </form>
    </>
  );
}
