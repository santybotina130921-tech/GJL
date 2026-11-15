import { exigirAdmin } from "@/lib/panel/auth";
import { FOTOS_PANEL } from "@/lib/panel/tablas";
import { SelectorFondos } from "@/components/panel/SelectorFondos";
import { SelectorTema } from "@/components/panel/SelectorTema";
import { TituloPanel } from "@/components/panel/TituloPanel";

export default async function Apariencia() {
  const { sb } = await exigirAdmin();
  const { data } = await sb
    .from("ajustes")
    .select("clave,valor")
    .or("clave.like.fondo_%,clave.like.panel_%,clave.eq.tema");
  const v = Object.fromEntries((data ?? []).map((f) => [f.clave, f.valor]));
  return (
    <>
      <TituloPanel titulo="Colores y fondos" ayuda="Elige el color de la marca y las fotos de la página y del panel. Todo se aplica al instante." />
      <h2 className="mb-4 font-display text-3xl uppercase">Color de la marca</h2>
      <SelectorTema actual={v.tema || "naranja"} />
      <h2 className="mb-4 mt-12 font-display text-3xl uppercase">Fotos de este panel</h2>
      <SelectorFondos valores={v} items={FOTOS_PANEL} carpeta="panel" />
      <h2 className="mb-4 mt-12 font-display text-3xl uppercase">Fotos de fondo de la página</h2>
      <SelectorFondos valores={v} />
    </>
  );
}
