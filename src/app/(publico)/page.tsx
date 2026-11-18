import { Hero } from "@/components/publico/secciones/Hero";
import { CintaProcesos } from "@/components/publico/CintaProcesos";
import { Estadisticas } from "@/components/publico/secciones/Estadisticas";
import { AccesosRapidos } from "@/components/publico/secciones/AccesosRapidos";
import { TeaserNosotros } from "@/components/publico/secciones/TeaserNosotros";
import { TeaserProyectos } from "@/components/publico/secciones/TeaserProyectos";
import { Testimonios } from "@/components/publico/secciones/Testimonios";
import { TeaserServicios } from "@/components/publico/secciones/TeaserServicios";
import { CtaCotizar } from "@/components/publico/secciones/CtaCotizar";

export const revalidate = 60;

export default function Inicio() {
  return (
    <>
      <Hero />
      <CintaProcesos />
      <Estadisticas />
      <AccesosRapidos />
      <TeaserNosotros />
      <TeaserProyectos />
      <Testimonios />
      <TeaserServicios />
      <CtaCotizar />
    </>
  );
}
