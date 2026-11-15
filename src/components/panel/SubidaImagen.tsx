"use client";

import { useState } from "react";
import { crearClienteNavegador } from "@/lib/supabase/cliente";
import { comprimirImagen, nombreArchivo } from "@/lib/imagen";
import { botonBorde } from "./estilos";

export function SubidaImagen({
  valor,
  onCambio,
  carpeta,
}: {
  valor?: string | null;
  onCambio: (url: string) => void;
  carpeta: string;
}) {
  const [estado, setEstado] = useState("");

  const subir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    setEstado("Subiendo...");
    try {
      const blob = await comprimirImagen(archivo);
      const ruta = `${carpeta}/${nombreArchivo("webp")}`;
      const sb = crearClienteNavegador();
      const { error } = await sb.storage.from("sitio").upload(ruta, blob, { contentType: "image/webp" });
      if (error) throw error;
      onCambio(sb.storage.from("sitio").getPublicUrl(ruta).data.publicUrl);
      setEstado("Foto subida. Recuerda guardar.");
    } catch {
      setEstado("No se pudo subir la foto.");
    }
  };

  return (
    <div className="space-y-2">
      {valor && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={valor} alt="" className="h-28 w-full max-w-xs border border-border object-cover" />
      )}
      <div className="flex items-center gap-3">
        <label className={botonBorde}>
          {valor ? "Cambiar foto" : "Subir foto"}
          <input type="file" accept="image/*" onChange={subir} className="sr-only" />
        </label>
        {valor && (
          <button type="button" onClick={() => onCambio("")} className="text-xs text-muted-foreground hover:text-primary">
            Quitar
          </button>
        )}
      </div>
      {estado && <p className="text-xs text-muted-foreground">{estado}</p>}
    </div>
  );
}
