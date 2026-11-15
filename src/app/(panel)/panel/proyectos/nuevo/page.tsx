import { exigirAdmin } from "@/lib/panel/auth";
import { FormularioProyecto } from "@/components/panel/FormularioProyecto";
import { TituloPanel } from "@/components/panel/TituloPanel";

export default async function NuevoProyecto({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await exigirAdmin();
  const { error } = await searchParams;
  return (
    <>
      <TituloPanel titulo="Nuevo proyecto" ayuda="Primero guarda los datos. Después podrás subir las fotos y los videos." />
      {error && <p role="alert" className="mb-4 text-sm text-primary">Escribe un título para el proyecto.</p>}
      <FormularioProyecto />
    </>
  );
}
