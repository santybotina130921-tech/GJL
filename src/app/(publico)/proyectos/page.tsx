import { Fondo } from "@/components/publico/Fondo";
import { GaleriaProyectos } from "@/components/publico/proyectos/GaleriaProyectos";
import { AntesDespuesSeccion } from "@/components/publico/proyectos/AntesDespuesSeccion";
import { SubNav } from "@/components/publico/SubNav";
import { CtaCotizar } from "@/components/publico/secciones/CtaCotizar";
import { getAjustes, getProyectos } from "@/lib/datos";

export const metadata = { title: "Proyectos | JGL Estructural" };
export const revalidate = 60;

const secciones = [
  { id: "galeria", texto: "Galería" },
  { id: "antes-despues", texto: "Antes y después" },
];

export default async function PaginaProyectos() {
  const [proyectos, a] = await Promise.all([getProyectos(), getAjustes()]);
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <Fondo clave="fondo_proyectos" />
        <p
          className="contorno pointer-events-none absolute bottom-0 right-4 -z-10 select-none font-display text-[clamp(7rem,22vw,18rem)] uppercase leading-[.8]"
          aria-hidden="true"
        >
          Obras
        </p>
        <div className="relative mx-auto max-w-6xl px-5 py-28">
          <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
          <h1 className="font-display text-6xl uppercase leading-none sm:text-8xl">
            Cada obra,<br />
            <span className="text-primary">una prueba.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Estructuras, cubiertas, soldadura y portones que ya están en pie. Filtra por tipo de trabajo y abre cada proyecto para ver los detalles.
          </p>
        </div>
      </section>
      <SubNav items={secciones} />
      <div id="galeria"><GaleriaProyectos proyectos={proyectos} whatsapp={a.whatsapp} /></div>
      <div id="antes-despues"><AntesDespuesSeccion proyectos={proyectos} /></div>
      <CtaCotizar />
    </>
  );
}
