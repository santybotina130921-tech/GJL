import { HeroNosotros } from "@/components/publico/nosotros/HeroNosotros";
import { LineaTiempo } from "@/components/publico/nosotros/LineaTiempo";
import { Valores } from "@/components/publico/nosotros/Valores";
import { Equipo } from "@/components/publico/nosotros/Equipo";
import { Certificaciones } from "@/components/publico/nosotros/Certificaciones";
import { Proceso } from "@/components/publico/nosotros/Proceso";
import { SubNav } from "@/components/publico/SubNav";
import { CtaCotizar } from "@/components/publico/secciones/CtaCotizar";

export const metadata = { title: "Nosotros | JGL Estructural" };
export const revalidate = 60;

const secciones = [
  { id: "historia", texto: "Historia" },
  { id: "valores", texto: "Valores" },
  { id: "equipo", texto: "Equipo" },
  { id: "certificaciones", texto: "Garantías" },
  { id: "proceso", texto: "Cómo trabajamos" },
];

export default function PaginaNosotros() {
  return (
    <>
      <HeroNosotros />
      <SubNav items={secciones} />
      <div id="historia"><LineaTiempo /></div>
      <div id="valores"><Valores /></div>
      <div id="equipo"><Equipo /></div>
      <div id="certificaciones"><Certificaciones /></div>
      <div id="proceso"><Proceso /></div>
      <CtaCotizar />
    </>
  );
}
