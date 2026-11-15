import { TituloSeccion } from "@/components/publico/TituloSeccion";
import { buttonVariants } from "@/components/ui/button";
import { sitio, enlaceWhatsApp } from "@/config/sitio";

export function Contacto() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <TituloSeccion>Contacto</TituloSeccion>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">WhatsApp y teléfono</p>
          <a
            href={`tel:${sitio.telefono}`}
            className="mt-2 block font-display text-3xl font-semibold"
          >
            {sitio.telefonoVisible}
          </a>
          <a
            href={enlaceWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({ size: "sm" })} mt-5`}
          >
            Escribir por WhatsApp
          </a>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Correo</p>
          <a
            href={`mailto:${sitio.correo}`}
            className="mt-2 block break-all text-lg"
          >
            {sitio.correo}
          </a>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Ubicación y horario</p>
          <p className="mt-2 text-lg">{sitio.ciudad}</p>
          <p className="text-muted-foreground">{sitio.horario}</p>
        </div>
      </div>
    </section>
  );
}
