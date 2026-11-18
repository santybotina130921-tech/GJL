import Image from "next/image";
import Link from "next/link";
import { Boton } from "@/components/publico/Boton";
import { getAjustes } from "@/lib/datos";
import { crearEnlaceWhatsApp, normalizarTelefono } from "@/lib/whatsapp";

const explora = [
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/proyectos", texto: "Proyectos" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/blog", texto: "Blog" },
];
const clientes = [
  { href: "/visita", texto: "Agendar visita técnica" },
  { href: "/seguimiento", texto: "Seguimiento de obra" },
  { href: "/cotizador", texto: "Cotizador rápido" },
  { href: "/contacto", texto: "Contacto" },
];

const enlace = "w-fit text-sm text-muted-foreground transition-all duration-200 hover:translate-x-1 hover:text-primary";
const redBase =
  "grid h-10 w-10 place-items-center border border-border text-muted-foreground transition duration-200 hover:-translate-y-1 hover:border-primary hover:text-primary";

export async function Footer() {
  const a = await getAjustes();
  const anio = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-border bg-card">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden="true" />
      <div className="resplandor absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <p
        className="contorno pointer-events-none absolute -bottom-6 right-4 -z-10 select-none font-display text-[clamp(6rem,18vw,14rem)] uppercase leading-[.8]"
        aria-hidden="true"
      >
        JGL
      </p>

      <div className="mx-auto max-w-6xl px-5">
        {/* Llamado a la acción */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border py-14">
          <h2 className="max-w-xl font-display text-4xl uppercase leading-none sm:text-5xl">
            ¿Listo para empezar <span className="text-primary">tu obra?</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            <Boton href="/visita">Agendar visita</Boton>
            <Boton href={crearEnlaceWhatsApp(a.whatsapp)} externo variante="borde">WhatsApp</Boton>
          </div>
        </div>

        {/* Columnas */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <div className="w-24 overflow-hidden bg-[#e4e5e7] p-2">
              <Image src="/logo-jgl.jpg" alt="Logo de JGL Estructural" width={372} height={431} className="h-auto w-full" />
            </div>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              Fabricamos, soldamos y montamos estructuras metálicas para obras civiles, bodegas y viviendas.
            </p>
            <div className="mt-5 flex gap-2">
              {a.instagram && (
                <a href={a.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={redBase}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" /></svg>
                </a>
              )}
              {a.tiktok && (
                <a href={a.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={redBase}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.4 2.6 2.1 4.3 4.5 4.6" /></svg>
                </a>
              )}
              {a.facebook && (
                <a href={a.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={redBase}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Explora" className="flex flex-col gap-3">
            <p className="font-display text-xl uppercase leading-none">Explora</p>
            {explora.map((e) => (<Link key={e.href} href={e.href} className={enlace}>{e.texto}</Link>))}
          </nav>

          <nav aria-label="Clientes" className="flex flex-col gap-3">
            <p className="font-display text-xl uppercase leading-none">Clientes</p>
            {clientes.map((e) => (<Link key={e.href} href={e.href} className={enlace}>{e.texto}</Link>))}
          </nav>

          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p className="font-display text-xl uppercase leading-none text-foreground">Contacto</p>
            <a href={`tel:+${normalizarTelefono(a.whatsapp)}`} className="w-fit transition-colors hover:text-primary">{a.telefono_visible}</a>
            <a href={`mailto:${a.correo}`} className="w-fit break-all transition-colors hover:text-primary">{a.correo}</a>
            <p>{a.ciudad}</p>
            <p>{a.horario}</p>
          </div>
        </div>

        {/* Barra final */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground">
          <p>© {anio} JGL Estructural. Todos los derechos reservados.</p>
          <p className="flex items-center gap-4">
            <span>Welding &amp; Steel Structures</span>
            <Link href="/login" className="transition-colors hover:text-primary">Acceso del equipo</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
