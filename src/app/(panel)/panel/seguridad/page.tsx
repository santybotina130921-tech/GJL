import { exigirAdmin } from "@/lib/panel/auth";
import { Configurar2FA } from "@/components/panel/Configurar2FA";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde, tarjeta } from "@/components/panel/estilos";

export default async function Seguridad() {
  await exigirAdmin();
  return (
    <>
      <TituloPanel titulo="Seguridad y respaldo" ayuda="Protege tu cuenta y guarda una copia de los datos." />
      <div className="space-y-8">
        <Configurar2FA />

        <section className={`${tarjeta} space-y-3`}>
          <h2 className="font-display text-2xl uppercase leading-none">Copia de seguridad</h2>
          <p className="text-sm text-muted-foreground">
            Descarga todos los datos (proyectos, documentos, finanzas, obras, textos…) en un archivo. Guárdalo en un lugar seguro: contiene información de clientes. Las fotos y videos viven en Supabase Storage y no van en este archivo.
          </p>
          <a href="/panel/respaldo" className={botonBorde}>Descargar copia de seguridad</a>
        </section>

        <section className={`${tarjeta} space-y-2 text-sm text-muted-foreground`}>
          <h2 className="font-display text-2xl uppercase leading-none text-foreground">Buenas prácticas</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Usa una clave larga y única, y activa la verificación en dos pasos.</li>
            <li>No compartas tu cuenta. Crea usuarios con rol de empleado para otras personas.</li>
            <li>Descarga una copia de seguridad cada semana o activa la copia automática (ver guía de despliegue).</li>
            <li>Revisa el Registro de cambios si ves algo raro.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
