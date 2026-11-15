import { exigirAdmin } from "@/lib/panel/auth";
import { FormularioEntrada } from "@/components/panel/FormularioEntrada";
import { TituloPanel } from "@/components/panel/TituloPanel";

export default async function NuevaEntrada({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await exigirAdmin();
  const { error } = await searchParams;
  return (
    <>
      <TituloPanel titulo="Nueva entrada" />
      {error && <p role="alert" className="mb-4 text-sm text-primary">Escribe un título.</p>}
      <FormularioEntrada />
    </>
  );
}
