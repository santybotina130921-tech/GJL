import { cache } from "react";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

/**
 * Solo deja pasar a administradores. Devuelve el cliente de Supabase con su sesión.
 * Si el administrador activó la verificación en dos pasos, exige haberla completado.
 * Está envuelta en cache(): el layout y la página comparten el resultado en una misma petición.
 */
export const exigirAdmin = cache(async () => {
  const sb = await crearClienteServidor();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") redirect("/login?mfa=1");

  const { data: perfil } = await sb.from("perfiles").select("rol").eq("id", user.id).single();
  if (perfil?.rol !== "admin") redirect("/");
  return { sb, user };
});
