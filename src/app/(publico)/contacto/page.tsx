import { Fondo } from "@/components/publico/Fondo";
import { FormularioContacto } from "@/components/publico/contacto/FormularioContacto";
import { InfoContacto } from "@/components/publico/contacto/InfoContacto";
import { getAjustes } from "@/lib/datos";

export const metadata = { title: "Contacto | JGL Estructural" };
export const revalidate = 60;

export default async function PaginaContacto() {
  const a = await getAjustes();
  return (
    <section className="relative isolate overflow-hidden">
      <Fondo clave="fondo_contacto" velo="bg-background/85" />
      <div className="resplandor absolute inset-0 -z-10" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-2">
        <div>
          <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
          <h1 className="font-display text-6xl font-bold uppercase leading-none sm:text-8xl">
            Hablemos de <span className="text-primary">tu obra.</span>
          </h1>
          <InfoContacto a={a} />
        </div>
        <FormularioContacto whatsapp={a.whatsapp} />
      </div>
    </section>
  );
}
