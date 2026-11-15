import { randomBytes, randomInt } from "crypto";

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
