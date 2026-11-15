import Image from "next/image";
import Link from "next/link";
import { getAjustes } from "@/lib/datos";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

export async function Footer() {
  const a = await getAjustes();
  return (
    <footer className="relative border-t border-border">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-primary via-transparent to-transparent" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 text-sm text-muted-foreground md:grid-cols-[auto_1fr_1fr_1fr]">
        <div className="w-28 overflow-hidden bg-[#e4e5e7] p-3">
          <Image src="/logo-jgl.jpg" alt="Logo de JGL Estructural" width={372} height={431} className="h-auto w-full" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold uppercase text-foreground">JGL Estructural</p>
          <p>Welding &amp; Steel Structures</p>
        </div>
        <div className="space-y-1">
          <p>WhatsApp: <a className="text-foreground hover:text-primary" href={crearEnlaceWhatsApp(a.whatsapp)}>{a.telefono_visible}</a></p>
          <p>Correo: <a className="text-foreground hover:text-primary" href={`mailto:${a.correo}`}>{a.correo}</a></p>
          <p>{a.ciudad}</p>
          <p>{a.horario}</p>
        </div>
        <div className="flex flex-col gap-1">
          {["nosotros", "proyectos", "servicios", "catalogo", "blog", "cotizador", "visita", "seguimiento", "contacto"].map((r) => (
            <Link key={r} href={`/${r}`} className="capitalize hover:text-foreground">{r === "catalogo" ? "catálogo" : r === "visita" ? "agendar visita" : r === "seguimiento" ? "seguimiento de obra" : r}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
