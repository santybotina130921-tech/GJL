import { sitio } from "@/config/sitio";

export function BarraSuperior() {
  return (
    <div className="hidden border-b border-border bg-card text-xs text-muted-foreground sm:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
        <p>{sitio.horario}</p>
        <p className="flex gap-5">
          <a href={`tel:${sitio.telefono}`} className="hover:text-foreground">
            {sitio.telefonoVisible}
          </a>
          <a href={`mailto:${sitio.correo}`} className="hover:text-foreground">
            {sitio.correo}
          </a>
        </p>
      </div>
    </div>
  );
}
