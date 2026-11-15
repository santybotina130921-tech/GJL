import { guardarEntrada } from "@/lib/panel/acciones-extra";
import { CampoImagen } from "./CampoImagen";
import { boton, campo, etiqueta, tarjeta } from "./estilos";

type Entrada = { id?: string; titulo?: string; resumen?: string; contenido?: string; imagen_url?: string | null; publicado?: boolean };

export function FormularioEntrada({ e }: { e?: Entrada }) {
  return (
    <form action={guardarEntrada} className={`${tarjeta} space-y-4`}>
      {e?.id && <input type="hidden" name="id" value={e.id} />}
      <div><label className={etiqueta}>Título</label><input name="titulo" required maxLength={160} defaultValue={e?.titulo ?? ""} className={campo} /></div>
      <div><label className={etiqueta}>Resumen (aparece en la lista y en Google)</label><textarea name="resumen" rows={2} maxLength={300} defaultValue={e?.resumen ?? ""} className={campo} /></div>
      <div>
        <label className={etiqueta}>Contenido</label>
        <textarea name="contenido" rows={16} defaultValue={e?.contenido ?? ""} className={`${campo} font-mono`} />
        <p className="mt-1 text-xs text-muted-foreground">Separa los párrafos con una línea en blanco. Empieza una línea con <b>## </b> para un subtítulo y con <b>- </b> para una lista.</p>
      </div>
      <div><label className={etiqueta}>Foto de portada</label><CampoImagen name="imagen_url" valor={e?.imagen_url} carpeta="blog" /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="publicado" defaultChecked={e?.publicado ?? false} /> Publicado (visible en la página)</label>
      <button type="submit" className={boton}>{e?.id ? "Guardar cambios" : "Crear entrada"}</button>
    </form>
  );
}
