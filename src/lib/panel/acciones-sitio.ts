"use server";

import { z } from "zod";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { crearClienteDirecto } from "@/lib/supabase/publico";
import { fechasDisponibles, hoyBogota, HORAS } from "@/lib/agenda";
import { ipActual, limitar } from "@/lib/limite";

export async function horasOcupadas(fecha: string): Promise<string[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return [];
  if (limitar(`horas:${await ipActual()}`, 60, 10 * 60_000)) return [];
  const { data } = await crearClienteDirecto().rpc("horas_ocupadas", { f: fecha });
  return (data as string[] | null) ?? [];
}

const esquemaVisita = z.object({
  nombre: z.string().trim().min(2).max(80),
  whatsapp: z.string().trim().min(7).max(30),
  direccion: z.string().trim().min(3).max(160),
  notas: z.string().trim().max(400).optional().default(""),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string(),
  sitio_web: z.string().optional(),
});

export async function agendarVisita(datos: unknown): Promise<{ ok: boolean; motivo?: string }> {
  const bruto = datos as { sitio_web?: string } | null;
  if (bruto?.sitio_web) return { ok: true }; // bots
  if (limitar(`visita:${await ipActual()}`, 4, 30 * 60_000)) return { ok: false, motivo: "intentos" };

  const r = esquemaVisita.safeParse(datos);
  if (!r.success) return { ok: false, motivo: "datos" };
  const { sitio_web, ...v } = r.data;
  void sitio_web;
  if (!HORAS.includes(v.hora) || !fechasDisponibles(hoyBogota(), 14).includes(v.fecha)) {
    return { ok: false, motivo: "fecha" };
  }
  const { error } = await crearClienteAdmin().from("visitas").insert({ ...v, estado: "pendiente" });
  if (error) return { ok: false, motivo: error.code === "23505" ? "ocupado" : "error" };
  return { ok: true };
}

export async function responderCotizacion(
  token: string,
  decision: "aprobada" | "rechazada",
  nombre: string,
  comentario: string,
): Promise<{ ok: boolean }> {
  if (!/^[a-f0-9]{32}$/.test(token)) return { ok: false };
  if (limitar(`cot:${await ipActual()}`, 10, 10 * 60_000)) return { ok: false };
  if (nombre.trim().length < 2) return { ok: false };
  const { data } = await crearClienteDirecto().rpc("responder_cotizacion", {
    t: token,
    decision,
    quien: nombre.trim().slice(0, 80),
    comentario: comentario.trim().slice(0, 500),
  });
  return { ok: data === "ok" };
}

export async function calificarObra(
  codigo: string,
  estrellas: number,
  nombre: string,
  comentario: string,
  trampa: string,
): Promise<{ ok: boolean; motivo?: string }> {
  if (trampa) return { ok: true }; // bots
  if (!/^[A-Za-z0-9-]{6,20}$/.test(codigo)) return { ok: false, motivo: "codigo" };
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) return { ok: false, motivo: "datos" };
  if (limitar(`calif:${await ipActual()}`, 5, 30 * 60_000)) return { ok: false, motivo: "intentos" };
  const { data } = await crearClienteDirecto().rpc("calificar_obra", {
    c: codigo,
    e: estrellas,
    comentario: comentario.trim().slice(0, 500),
    quien: nombre.trim().slice(0, 60),
  });
  return data === "ok" ? { ok: true } : { ok: false, motivo: String(data ?? "error") };
}
