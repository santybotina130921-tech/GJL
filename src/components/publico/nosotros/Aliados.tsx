import Image from "next/image";
import { Revelar } from "@/components/publico/Revelar";
import { getAliados } from "@/lib/datos";

export async function Aliados() {
  const lista = await getAliados();
  return (
    <section className="mx-auto max-w-6xl px-5 pb-28">
      <Revelar>
        <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
        <h3 className="max-w-2xl font-display text-4xl uppercase leading-none sm:text-5xl">
          Contamos con el respaldo de nuestros aliados
        </h3>
      </Revelar>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {lista.map((a, i) => (
          <Revelar key={a.nombre} retardo={i * 80}>
            <li className="group grid h-28 place-items-center border border-border bg-card p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-primary">
              {a.logo_url ? (
                <div className="relative h-full w-full">
                  <Image src={a.logo_url} alt={a.nombre} fill sizes="200px" className="object-contain" />
                </div>
              ) : (
                <span className="font-display text-2xl uppercase leading-tight transition-colors group-hover:text-primary">{a.nombre}</span>
              )}
            </li>
          </Revelar>
        ))}
      </ul>
    </section>
  );
}
