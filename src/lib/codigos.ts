import { randomBytes, randomInt } from "crypto";
import { headers } from "next/headers";

// Sin letras ni números que se confunden (O, 0, I, 1, L).
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export const codigoObra = () =>
  "JGL-" + Array.from({ length: 8 }, () => ALFABETO[randomInt(ALFABETO.length)]).join("");

export const tokenAleatorio = () => randomBytes(16).toString("hex");

export const urlBase = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Solo se aceptan fotos que vengan del almacén de Supabase. */
export function urlSegura(u: string): string | null {
  try {
    const x = new URL(u);
    return x.protocol === "https:" && x.hostname.endsWith(".supabase.co") ? x.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Dirección real del sitio para armar enlaces (seguimiento, cotizaciones).
 * Usa NEXT_PUBLIC_SITE_URL si está bien configurada; si no (o si apunta a localhost),
 * toma la dirección desde la que estás entrando, así el enlace nunca sale con localhost en producción.
 */
export async function urlSitio(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && !env.includes("localhost")) return env.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
