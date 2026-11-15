import type { Ajustes } from "@/lib/datos";
import { normalizarTelefono } from "@/lib/whatsapp";

export function InfoContacto({ a }: { a: Ajustes }) {
  return (
    <dl className="mt-10 space-y-6">
      <div>
        <dt className="text-sm text-muted-foreground">WhatsApp y teléfono</dt>
        <dd>
          <a href={`tel:+${normalizarTelefono(a.whatsapp)}`} className="font-display text-4xl font-semibold transition-colors hover:text-primary">
            {a.telefono_visible}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Correo</dt>
        <dd>
          <a href={`mailto:${a.correo}`} className="break-all text-lg transition-colors hover:text-primary">{a.correo}</a>
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Ubicación y horario</dt>
        <dd className="text-lg">
          {a.ciudad}
          <br />
          <span className="text-muted-foreground">{a.horario}</span>
        </dd>
      </div>
    </dl>
  );
}
