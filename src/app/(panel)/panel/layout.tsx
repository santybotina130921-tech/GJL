import "./panel.css";
import { exigirAdmin } from "@/lib/panel/auth";
import { cerrarSesion } from "@/lib/panel/acciones";
import { MenuPanel } from "@/components/panel/MenuPanel";
import { CabeceraPanel } from "@/components/panel/CabeceraPanel";

export const metadata = { title: "Panel | JGL Estructural" };

export default async function LayoutPanel({ children }: { children: React.ReactNode }) {
  const { sb, user } = await exigirAdmin();
  const [{ count }, { data: av }] = await Promise.all([
    sb.from("cotizaciones").select("*", { count: "exact", head: true }).eq("estado", "nueva"),
    sb.from("ajustes").select("valor").eq("clave", "panel_avatar"),
  ]);
  const nuevos = count ?? 0;
  const correo = user.email ?? "";
  const avatar = av?.[0]?.valor || undefined;

  return (
    <div className="fondo-panel min-h-screen md:grid md:grid-cols-[272px_1fr]">
      <MenuPanel correo={correo} salir={cerrarSesion} nuevos={nuevos} avatar={avatar} />
      <div className="min-w-0">
        <CabeceraPanel correo={correo} nuevos={nuevos} avatar={avatar} />
        <main className="p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
