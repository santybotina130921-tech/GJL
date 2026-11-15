import Image from "next/image";
import Link from "next/link";
import { Chispas } from "@/components/publico/Chispas";
import { FormularioLogin } from "@/components/auth/FormularioLogin";

export const metadata = { title: "Ingresar | JGL Estructural" };

export default async function PaginaLogin({ searchParams }: { searchParams: Promise<{ mfa?: string }> }) {
  const { mfa } = await searchParams;
  return (
    <div className="grid min-h-screen md:grid-cols-[1.1fr_.9fr]">
      <aside className="relative isolate hidden overflow-hidden border-r border-border bg-card md:block">
        <div className="rejilla absolute inset-0 -z-10" aria-hidden="true" />
        <div className="resplandor absolute inset-0 -z-10" aria-hidden="true" />
        <Chispas />
        <div className="flex h-full flex-col justify-between p-12">
          <Link href="/" className="w-28 bg-[#e4e5e7] p-3 transition-transform hover:scale-105">
            <Image src="/logo-jgl.jpg" alt="JGL Estructural, volver al inicio" width={372} height={431} className="h-auto w-full" />
          </Link>
          <div>
            <p className="contorno font-display text-[9rem] font-bold uppercase leading-none">Panel</p>
            <p className="font-display text-5xl font-bold uppercase leading-none">
              Tu obra, <span className="text-primary">bajo control.</span>
            </p>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-16">
        <div className="entrar w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
            ← Volver al sitio
          </Link>
          <h1 className="font-display text-5xl font-bold uppercase leading-none">Ingresar</h1>
          <p className="mt-2 text-sm text-muted-foreground">Acceso para el equipo y los clientes de JGL.</p>
          <FormularioLogin pedirCodigo={mfa === "1"} />
        </div>
      </main>
    </div>
  );
}
