import Image from "next/image";
import { getAjustes } from "@/lib/datos";

/** Foto de fondo editable desde el panel. El contenedor debe ser "relative isolate". */
export async function Fondo({
  clave,
  velo = "bg-gradient-to-r from-background via-background/80 to-background/40",
}: {
  clave: string;
  velo?: string;
}) {
  const url = (await getAjustes())[clave];
  return (
    <>
      {url ? (
        <Image src={url} alt="" fill sizes="100vw" className="-z-30 object-cover" />
      ) : (
        <div className="placeholder-acero absolute inset-0 -z-30" aria-hidden="true" />
      )}
      <div className={`absolute inset-0 -z-20 ${velo}`} aria-hidden="true" />
    </>
  );
}
