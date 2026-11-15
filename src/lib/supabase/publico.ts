import { createClient } from "@supabase/supabase-js";

// Lectura del contenido público (sin sesión). Las políticas RLS solo dejan ver lo publicado.
// Las respuestas se guardan 60 segundos en la caché de Next: la página carga rápido
// y, al guardar en el panel, se invalida sola.
export function crearClientePublico() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, next: { revalidate: 60 } } as RequestInit),
      },
    },
  );
}

// Sin caché: para datos que cambian y deben verse al instante (seguimiento, horarios, cotizaciones).
export function crearClienteDirecto() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { ...init, cache: "no-store" }) },
    },
  );
}
