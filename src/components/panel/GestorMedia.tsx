"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase/cliente";
import { comprimirImagen, nombreArchivo } from "@/lib/imagen";
import { agregarMedia, borrarMedia, moverMedia, portadaMedia } from "@/lib/panel/acciones";
import { boton, botonBorde, tarjeta } from "./estilos";

type Media = { id: string; tipo: "foto" | "video"; url: string; es_portada: boolean };

export function GestorMedia({ proyectoId, media }: { proyectoId: string; media: Media[] }) {
  const router = useRouter();
  const [estado, setEstado] = useState("");
  const [pend, inicio] = useTransition();

  const subir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!archivos.length) return;
    const sb = crearClienteNavegador();
    let n = 0;
    for (const f of archivos) {
      n++;
      setEstado(`Subiendo ${n} de ${archivos.length}...`);
      try {
        const esVideo = f.type.startsWith("video/");
        if (esVideo && f.size > 50 * 1024 * 1024) {
          setEstado("Un video pesa más de 50 MB. Redúcelo antes de subirlo.");
          continue;
        }
        const cuerpo = esVideo ? f : await comprimirImagen(f);
        const ext = esVideo ? (f.name.split(".").pop() ?? "mp4").toLowerCase() : "webp";
        const ruta = `proyectos/${proyectoId}/${nombreArchivo(ext)}`;
        const { error } = await sb.storage
          .from("sitio")
          .upload(ruta, cuerpo, { contentType: esVideo ? f.type : "image/webp" });
        if (error) throw error;
        const url = sb.storage.from("sitio").getPublicUrl(ruta).data.publicUrl;
        await agregarMedia(proyectoId, esVideo ? "video" : "foto", url);
      } catch {
        setEstado("Una de las subidas falló.");
      }
    }
    setEstado("Listo");
    router.refresh();
  };

  const accion = (fn: () => Promise<unknown>) =>
    inicio(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className={`${tarjeta} space-y-5`}>
      <div className="flex flex-wrap items-center gap-4">
        <label className={boton}>
          Subir fotos o videos
          <input type="file" accept="image/*,video/*" multiple onChange={subir} className="sr-only" />
        </label>
        <p className="text-sm text-muted-foreground">
          Las fotos se reducen solas. Videos: máximo 50 MB cada uno.
        </p>
      </div>
      {estado && <p className="text-sm text-muted-foreground">{estado}</p>}

      {media.length === 0 ? (
        <p className="text-sm text-muted-foreground">Este proyecto todavía no tiene fotos ni videos.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m, i) => (
            <div key={m.id} className="border border-border bg-background">
              <div className="relative aspect-video bg-black">
                {m.tipo === "video" ? (
                  <video src={m.url} controls preload="metadata" className="h-full w-full" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                )}
                {m.es_portada && (
                  <span className="absolute left-2 top-2 bg-primary px-2 py-1 text-xs font-semibold text-white">Portada</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 p-3">
                {m.tipo === "foto" && !m.es_portada && (
                  <button type="button" disabled={pend} onClick={() => accion(() => portadaMedia(m.id, proyectoId))} className={botonBorde}>Portada</button>
                )}
                <button type="button" disabled={pend || i === 0} onClick={() => accion(() => moverMedia(m.id, proyectoId, -1))} className={botonBorde} aria-label="Mover antes">↑</button>
                <button type="button" disabled={pend || i === media.length - 1} onClick={() => accion(() => moverMedia(m.id, proyectoId, 1))} className={botonBorde} aria-label="Mover después">↓</button>
                <button
                  type="button"
                  disabled={pend}
                  onClick={() => confirm("¿Borrar este archivo?") && accion(() => borrarMedia(m.id))}
                  className={botonBorde}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
