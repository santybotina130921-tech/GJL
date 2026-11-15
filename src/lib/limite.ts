import { headers } from "next/headers";

// Límite sencillo en memoria. Para producción con varias instancias conviene Upstash Redis.
const cubos = new Map<string, number[]>();

/** Devuelve true si se superó el máximo de intentos dentro de la ventana. */
export function limitar(clave: string, max: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const lista = (cubos.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
  const excedido = lista.length >= max;
  if (!excedido) lista.push(ahora);
  cubos.set(clave, lista);
  if (cubos.size > 5000) cubos.clear();
  return excedido;
}

export async function ipActual(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
}
