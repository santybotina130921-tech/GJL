import { exigirAdmin } from "@/lib/panel/auth";
import { cambiarRol } from "@/lib/panel/acciones";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { TituloPanel } from "@/components/panel/TituloPanel";
import { botonBorde, campo } from "@/components/panel/estilos";

export default async function Usuarios() {
  const { user } = await exigirAdmin();
  let filas: { id: string; email: string; rol: string }[] = [];
  let problema = false;

  try {
    const admin = crearClienteAdmin();
    const [{ data: lista }, { data: perfiles }] = await Promise.all([
      admin.auth.admin.listUsers({ perPage: 200 }),
      admin.from("perfiles").select("id,rol"),
    ]);
    filas = (lista?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? "",
      rol: perfiles?.find((p) => p.id === u.id)?.rol ?? "cliente",
    }));
  } catch {
    problema = true;
  }

  return (
    <>
      <TituloPanel
        titulo="Usuarios"
        ayuda="Quién puede entrar al panel. Los usuarios nuevos se crean en Supabase (Authentication) y aquí les das el rol."
      />
      {problema && (
        <p role="alert" className="mb-4 text-sm text-primary">
          No se pudo leer la lista. Revisa que SUPABASE_SERVICE_ROLE_KEY esté en el archivo .env.
        </p>
      )}
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-card text-muted-foreground">
            <tr><th className="p-3">Correo</th><th className="p-3">Rol</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.id} className="border-t border-border">
                <td className="p-3">{f.email}{f.id === user.id && <span className="ml-2 text-xs text-primary">(tú)</span>}</td>
                <td className="p-3" colSpan={2}>
                  {f.id === user.id ? (
                    <span className="text-muted-foreground">{f.rol}</span>
                  ) : (
                    <form action={cambiarRol} className="flex gap-2">
                      <input type="hidden" name="id" value={f.id} />
                      <select name="rol" defaultValue={f.rol} className={`${campo} w-auto`}>
                        <option value="admin">admin</option>
                        <option value="empleado">empleado</option>
                        <option value="cliente">cliente</option>
                      </select>
                      <button className={botonBorde}>Cambiar</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Solo el rol admin entra a este panel.</p>
    </>
  );
}
