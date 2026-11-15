import Link from "next/link";
import { VistaObra, type ObraPublica } from "@/components/publico/seguimiento/VistaObra";
import { FormularioCodigo } from "@/components/publico/seguimiento/FormularioCodigo";
import { crearClienteDirecto } from "@/lib/supabase/publico";
import { ipActual, limitar } from "@/lib/limite";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tu obra | JGL Estructural", robots: { index: false, follow: false } };

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="font-display text-5xl uppercase leading-none">{titulo}</h1>
      <p className="mb-8 mt-4 text-muted-foreground">{texto}</p>
      <FormularioCodigo />
      <Link href="/contacto" className="mt-6 inline-block text-sm text-primary hover:underline">¿Necesitas ayuda? Escríbenos →</Link>
    </section>
  );
}

export default async function ObraPorCodigo({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  if (limitar(`obra:${await ipActual()}`, 30, 10 * 60_000)) {
    return <Aviso titulo="Demasiados intentos" texto="Espera unos minutos e inténtalo de nuevo." />;
  }
  if (!/^[A-Za-z0-9-]{6,20}$/.test(codigo)) {
    return <Aviso titulo="No encontramos esa obra" texto="Revisa que el código esté bien escrito." />;
  }
  const { data } = await crearClienteDirecto().rpc("obra_por_codigo", { c: codigo });
  if (!data) return <Aviso titulo="No encontramos esa obra" texto="Revisa que el código esté bien escrito o que el enlace siga activo." />;
  return <VistaObra obra={data as ObraPublica} />;
}
