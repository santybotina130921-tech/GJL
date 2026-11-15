import { Fondo } from "@/components/publico/Fondo";
import { ServiciosInteractivos } from "@/components/publico/servicios/ServiciosInteractivos";
import { ProcesosSoldadura } from "@/components/publico/servicios/ProcesosSoldadura";
import { Materiales } from "@/components/publico/servicios/Materiales";
import { PreguntasFrecuentes } from "@/components/publico/servicios/PreguntasFrecuentes";
import { CintaProcesos } from "@/components/publico/CintaProcesos";
import { SubNav } from "@/components/publico/SubNav";
import { CtaCotizar } from "@/components/publico/secciones/CtaCotizar";
import { getServicios } from "@/lib/datos";

export const metadata = { title: "Servicios | JGL Estructural" };
export const revalidate = 60;

const secciones = [
  { id: "servicios", texto: "Servicios" },
  { id: "procesos", texto: "Procesos de soldadura" },
  { id: "materiales", texto: "Materiales" },
  { id: "preguntas", texto: "Preguntas" },
];

export default async function PaginaServicios() {
  const servicios = await getServicios();
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <Fondo clave="fondo_servicios" velo="bg-background/80" />
        <div className="rejilla absolute inset-0 -z-10" aria-hidden="true" />
        <div className="resplandor absolute inset-0 -z-10" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 py-28">
          <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
          <h1 className="font-display text-6xl uppercase leading-none sm:text-8xl">
            Del plano<br />
            <span className="text-primary">a la estructura.</span>
          </h1>
        </div>
      </section>
      <SubNav items={secciones} />
      <div id="servicios"><ServiciosInteractivos servicios={servicios} /></div>
      <CintaProcesos />
      <div id="procesos"><ProcesosSoldadura /></div>
      <div id="materiales"><Materiales /></div>
      <div id="preguntas"><PreguntasFrecuentes /></div>
      <CtaCotizar />
    </>
  );
}
