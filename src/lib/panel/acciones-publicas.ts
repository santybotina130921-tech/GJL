"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { crearClienteAdmin } from "@/lib/supabase/admin";

const esquema = z.object({
  nombre: z.string().trim().min(2).max(80),
  whatsapp: z.string().trim().min(7).max(30),
  tipo_trabajo: z.string().trim().max(60),
  medidas: z.string().trim().max(60).optional(),
  descripcion: z.string().trim().max(1000).optional(),
});

// Límite sencillo por IP: 5 solicitudes cada 10 minutos.
const intentos = new Map<string, number[]>();
function limitado(ip: string) {
  const ahora = Date.now();
  const lista = (intentos.get(ip) ?? []).filter((t) => ahora - t < 10 * 60_000);
  if (lista.length >= 5) {
    intentos.set(ip, lista);
    return true;
  }
  lista.push(ahora);
  intentos.set(ip, lista);
  if (intentos.size > 5000) intentos.clear();
  return false;
}

/** Guarda la solicitud del formulario público para que aparezca en el panel. */
export async function enviarSolicitud(datos: unknown) {
  // Campo trampa: los bots lo llenan, las personas no lo ven.
  if (datos && typeof datos === "object" && (datos as { sitio_web?: string }).sitio_web) {
    return { ok: true };
  }
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "desconocida").split(",")[0].trim();
  if (limitado(ip)) return { ok: false };

  const r = esquema.safeParse(datos);
  if (!r.success) return { ok: false };
  try {
    const { error } = await crearClienteAdmin().from("cotizaciones").insert(r.data);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
