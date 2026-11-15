import { createClient } from "@supabase/supabase-js";

// Solo para código de servidor. Usa la clave secreta: nunca importar desde el navegador.
export function crearClienteAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
