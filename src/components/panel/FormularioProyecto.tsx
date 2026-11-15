import { guardarProyecto } from "@/lib/panel/acciones";
import { boton, campo, etiqueta, tarjeta } from "./estilos";

type Proyecto = {
  id?: string;
  titulo?: string;
  categoria?: string;
  ubicacion?: string | null;
  medidas?: string | null;
  descripcion?: string | null;
  estado?: string;
  orden?: number;
};

export function FormularioProyecto({ p }: { p?: Proyecto }) {
  return (
    <form action={guardarProyecto} className={`${tarjeta} grid gap-4 sm:grid-cols-2`}>
      {p?.id && <input type="hidden" name="id" value={p.id} />}
      <div className="sm:col-span-2">
        <label className={etiqueta}>Título del proyecto</label>
        <input name="titulo" required defaultValue={p?.titulo ?? ""} className={campo} />
      </div>
      <div>
        <label className={etiqueta}>Tipo de trabajo</label>
        <input name="categoria" list="categorias" defaultValue={p?.categoria ?? ""} className={campo} placeholder="Cubiertas, Estructuras..." />
        <datalist id="categorias">
          {["Cubiertas", "Estructuras", "Soldadura", "Portones"].map((c) => (<option key={c} value={c} />))}
        </datalist>
      </div>
      <div>
        <label className={etiqueta}>Medidas</label>
        <input name="medidas" defaultValue={p?.medidas ?? ""} className={campo} placeholder="Ej. 420 m²" />
      </div>
      <div className="sm:col-span-2">
        <label className={etiqueta}>Ubicación</label>
        <input name="ubicacion" defaultValue={p?.ubicacion ?? ""} className={campo} />
      </div>
      <div className="sm:col-span-2">
        <label className={etiqueta}>Descripción</label>
        <textarea name="descripcion" rows={4} defaultValue={p?.descripcion ?? ""} className={campo} />
      </div>
      <div>
        <label className={etiqueta}>Estado</label>
        <select name="estado" defaultValue={p?.estado ?? "borrador"} className={campo}>
          <option value="borrador">Borrador (no se ve en la página)</option>
          <option value="publicado">Publicado</option>
        </select>
      </div>
      <div>
        <label className={etiqueta}>Orden</label>
        <input name="orden" type="number" defaultValue={p?.orden ?? 0} className={campo} />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className={boton}>{p?.id ? "Guardar cambios" : "Crear proyecto"}</button>
      </div>
    </form>
  );
}
