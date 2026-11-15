import { guardarMovimiento } from "@/lib/panel/acciones";
import { CATEGORIAS_EGRESO, CATEGORIAS_INGRESO, METODOS } from "@/lib/finanzas";
import { boton, campo, etiqueta, tarjeta } from "./estilos";

export function FormularioMovimiento() {
  const hoy = new Date().toISOString().slice(0, 10);
  return (
    <form action={guardarMovimiento} className={`${tarjeta} grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
      <div>
        <label className={etiqueta}>Tipo</label>
        <select name="tipo" className={campo} defaultValue="ingreso">
          <option value="ingreso">Ingreso (entra dinero)</option>
          <option value="egreso">Egreso (sale dinero)</option>
        </select>
      </div>
      <div>
        <label className={etiqueta}>Fecha</label>
        <input name="fecha" type="date" required defaultValue={hoy} className={campo} />
      </div>
      <div className="sm:col-span-2">
        <label className={etiqueta}>Concepto</label>
        <input name="concepto" required maxLength={160} placeholder="Ej. Compra de perfiles tubulares" className={campo} />
      </div>
      <div>
        <label className={etiqueta}>Categoría</label>
        <select name="categoria" className={campo}>
          <optgroup label="Ingresos">{CATEGORIAS_INGRESO.map((c) => (<option key={c}>{c}</option>))}</optgroup>
          <optgroup label="Egresos">{CATEGORIAS_EGRESO.map((c) => (<option key={c}>{c}</option>))}</optgroup>
        </select>
      </div>
      <div>
        <label className={etiqueta}>Monto (COP)</label>
        <input name="monto" type="number" required min={1} step="any" className={campo} />
      </div>
      <div>
        <label className={etiqueta}>Método de pago</label>
        <select name="metodo" className={campo}>{METODOS.map((m) => (<option key={m}>{m}</option>))}</select>
      </div>
      <div>
        <label className={etiqueta}>Notas (opcional)</label>
        <input name="notas" maxLength={300} className={campo} />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <button type="submit" className={boton}>Registrar movimiento</button>
      </div>
    </form>
  );
}
