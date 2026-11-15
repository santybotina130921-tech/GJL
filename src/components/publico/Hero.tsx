import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const lineas = ["Estructuras metálicas", "y soldadura", "que aguantan."];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:min-h-[80vh] md:grid-cols-[1.25fr_.75fr]">
      <div>
        <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-7xl lg:text-8xl">
          {lineas.map((l, i) => (
            <span key={l} className="linea-titulo">
              <span style={{ "--d": i } as React.CSSProperties}>{l}</span>
            </span>
          ))}
        </h1>

        <div className="cordon mt-7" aria-hidden="true" />

        <p className="aparece mt-6 max-w-md text-lg text-muted-foreground">
          Fabricamos, soldamos y montamos estructuras para obras civiles,
          bodegas y viviendas.
        </p>

        <div
          className="aparece mt-8 flex flex-wrap gap-3"
          style={{ "--retardo": "1s" } as React.CSSProperties}
        >
          <Link href="/cotizar" className={buttonVariants({ size: "lg" })}>
            Solicitar cotización
          </Link>
          <Link
            href="/proyectos"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Ver proyectos
          </Link>
        </div>
      </div>

      <div className="flex justify-center bg-[#e4e5e7] p-8">
        <Image
          src="/logo-jgl.jpg"
          alt="Logo de JGL Estructural"
          width={372}
          height={431}
          priority
          className="h-auto w-full max-w-[330px]"
        />
      </div>
    </section>
  );
}
