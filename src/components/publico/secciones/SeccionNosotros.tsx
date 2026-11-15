import Image from "next/image";
import { TextoRevelado } from "@/components/publico/TextoRevelado";

const presentacion =
  "Trabajamos el acero con precisión de taller y disciplina de obra. Desde una cercha hasta una nave completa, entregamos estructuras seguras, bien soldadas y listas para durar décadas.";

// Para usar una foto real de fondo: guárdala en public/ y pásala aquí.
// Ejemplo: <SeccionNosotros imagen="/nosotros.jpg" />
export function SeccionNosotros({ imagen }: { imagen?: string }) {
  return (
    <section
      id="nosotros"
      className="relative isolate flex min-h-[85vh] items-center overflow-hidden border-b border-border"
    >
      {imagen ? (
        <Image src={imagen} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      ) : (
        <div className="placeholder-acero absolute inset-0 -z-20" aria-hidden="true" />
      )}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/75 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-24">
        <h2 className="max-w-3xl font-display text-5xl font-bold uppercase leading-none sm:text-7xl lg:text-8xl">
          Somos el acero detrás de cada obra
        </h2>

        <div className="mt-10 max-w-2xl border-l-[3px] border-foreground pl-5">
          <TextoRevelado
            texto={presentacion}
            className="text-xl font-medium leading-snug sm:text-3xl"
          />
        </div>

        <div className="mt-6 max-w-xl border-l-[3px] border-foreground pl-5 text-muted-foreground">
          <p>
            Nuestra misión es simple: que cada unión soldada sostenga la
            confianza que el cliente puso en nosotros.
          </p>
        </div>
      </div>
    </section>
  );
}
