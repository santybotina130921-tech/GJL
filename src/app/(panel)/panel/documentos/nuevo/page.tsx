import { exigirAdmin } from "@/lib/panel/auth";
import { EditorDocumento } from "@/components/panel/EditorDocumento";
import { TituloPanel } from "@/components/panel/TituloPanel";

export default async function NuevoDocumento({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await exigirAdmin();
  const { error } = await searchParams;
  return (
    <>
      <TituloPanel titulo="Nuevo documento" ayuda="El número consecutivo se asigna solo al guardar." />
      {error && <p role="alert" className="mb-4 text-sm text-primary">Revisa los datos: el cliente y al menos un ítem son obligatorios.</p>}
      <EditorDocumento />
    </>
  );
}
