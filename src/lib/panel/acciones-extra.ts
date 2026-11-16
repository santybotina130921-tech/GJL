"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirAdmin } from "@/lib/panel/auth";
import { codigoObra, tokenAleatorio, urlSegura } from "@/lib/codigos";
import { crearSlug } from "@/lib/slug";

const txt = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const refrescar = () => revalidatePath("/", "layout");

/* ---------- Obras (seguimiento por código) ---------- */
const ETAPAS_BASE = [
  { nombre: "Corte y habilitado", avance: 0 },
  { nombre: "Soldadura y armado", avance: 0 },
  { nombre: "Pintura y acabados", avance: 0 },
  { nombre: "Montaje e instalación", avance: 0 },
];

export async function crearObra(formData: FormData) {
  const { sb } = await exigirAdmin();
  const nombre = txt(formData, "nombre");
  const cliente = txt(formData, "cliente");
  if (!nombre || !cliente) redirect("/panel/obras?error=1");

  for (let intento = 0; intento < 4; intento++) {
    const { data, error } = await sb
      .from("obras")
      .insert({ nombre, cliente, codigo: codigoObra(), etapas: ETAPAS_BASE })
      .select("id")
      .single();
    if (data) redirect(`/panel/obras/${data.id}`);
    if (error?.code !== "23505") break; // si solo chocó el código, se reintenta
  }
  redirect("/panel/obras?error=1");
}

const esquemaObra = z.object({
  nombre: z.string().trim().min(1).max(120),
  cliente: z.string().trim().min(1).max(120),
  cliente_whatsapp: z.string().max(30),
  descripcion: z.string().max(600),
  estado: z.enum(["en_proceso", "pausada", "terminada"]),
  avance: z.coerce.number().int().min(0).max(100),
  fecha_inicio: z.string().optional(),
  fecha_estimada: z.string().optional(),
  etapas: z.array(z.object({ nombre: z.string().trim().min(1).max(60), avance: z.coerce.number().min(0).max(100) })).max(12),
});

export async function guardarObra(formData: FormData) {
  const { sb } = await exigirAdmin();
  const id = txt(formData, "id");
  let etapas: unknown = [];
  try { etapas = JSON.parse(txt(formData, "etapas")); } catch {}
  const r = esquemaObra.safeParse({ ...Object.fromEntries(formData), etapas });
  if (!r.success) redirect(`/panel/obras/${id}?error=1`);
  const d = r.data;
  await sb.from("obras").update({
    ...d,
    fecha_inicio: d.fecha_inicio || null,
    fecha_estimada: d.fecha_estimada || null,
    publica: formData.get("publica") === "on",
  }).eq("id", id);
  refrescar();
  redirect(`/panel/obras/${id}?ok=1`);
}

export async function regenerarCodigo(id: string) {
  const { sb } = await exigirAdmin();
  await sb.from("obras").update({ codigo: codigoObra() }).eq("id", id);
  refrescar();
}

export async function borrarObra(formData: FormData) {
  const { sb } = await exigirAdmin();
  await sb.from("obras").delete().eq("id", txt(formData, "id"));
  refrescar();
  redirect("/panel/obras");
}

export async function agregarAvance(obraId: string, nota: string, foto: string) {
  const { sb } = await exigirAdmin();
  const n = nota.trim().slice(0, 500);
  const f = foto ? urlSegura(foto) : null;
  if (!n && !f) return { ok: false };
  await sb.from("avances_obra").insert({ obra_id: obraId, nota: n, foto_url: f });
  refrescar();
  return { ok: true };
}

export async function borrarAvance(id: string) {
  const { sb } = await exigirAdmin();
  await sb.from("avances_obra").delete().eq("id", id);
  refrescar();
}

/* ---------- Visitas ---------- */
export async function actualizarVisita(formData: FormData) {
  const { sb } = await exigirAdmin();
  const estado = txt(formData, "estado");
  if (!["pendiente", "confirmada", "realizada", "cancelada"].includes(estado)) return;
  await sb.from("visitas").update({ estado }).eq("id", txt(formData, "id"));
  revalidatePath("/panel/visitas");
}

export async function borrarVisita(formData: FormData) {
  const { sb } = await exigirAdmin();
  await sb.from("visitas").delete().eq("id", txt(formData, "id"));
  revalidatePath("/panel/visitas");
}

/* ---------- Blog ---------- */
export async function guardarEntrada(formData: FormData) {
  const { sb } = await exigirAdmin();
  const id = txt(formData, "id");
  const titulo = txt(formData, "titulo");
  if (!titulo) redirect(id ? `/panel/blog/${id}?error=1` : "/panel/blog/nuevo?error=1");
  const publicado = formData.get("publicado") === "on";
  const imagen = txt(formData, "imagen_url");
  const datos = {
    titulo: titulo.slice(0, 160),
    resumen: txt(formData, "resumen").slice(0, 300),
    contenido: txt(formData, "contenido").slice(0, 20000),
    imagen_url: imagen ? urlSegura(imagen) : null,
    publicado,
  };

  let destino = id;
  if (id) {
    const { data: actual } = await sb.from("entradas").select("publicada_en").eq("id", id).single();
    await sb.from("entradas").update({
      ...datos,
      publicada_en: publicado ? (actual?.publicada_en ?? new Date().toISOString()) : actual?.publicada_en ?? null,
    }).eq("id", id);
  } else {
    const { data } = await sb.from("entradas").insert({
      ...datos,
      slug: crearSlug(titulo),
      publicada_en: publicado ? new Date().toISOString() : null,
    }).select("id").single();
    destino = data?.id ?? "";
  }
  refrescar();
  redirect(destino ? `/panel/blog/${destino}?ok=1` : "/panel/blog");
}

export async function borrarEntrada(formData: FormData) {
  const { sb } = await exigirAdmin();
  await sb.from("entradas").delete().eq("id", txt(formData, "id"));
  refrescar();
  redirect("/panel/blog");
}

/* ---------- Cotizaciones por enlace y recordatorios ---------- */
export async function generarEnlaceCotizacion(id: string) {
  const { sb } = await exigirAdmin();
  await sb
    .from("documentos")
    .update({ token_aprobacion: tokenAleatorio(), aprobacion: "pendiente", aprobada_en: null, aprobada_por: null, comentario_cliente: null })
    .eq("id", id)
    .eq("tipo", "cotizacion");
  revalidatePath(`/panel/documentos/${id}`);
}

export async function registrarRecordatorio(id: string) {
  const { sb } = await exigirAdmin();
  await sb.from("documentos").update({ ultimo_recordatorio: new Date().toISOString().slice(0, 10) }).eq("id", id);
  revalidatePath("/panel", "layout");
}


/* ---------- Editar y duplicar documentos ---------- */
const itemDoc = z.object({ d: z.string().max(200), q: z.coerce.number().min(0), v: z.coerce.number().min(0) });
const esquemaEditar = z.object({
  fecha: z.string().min(8),
  prestador: z.string().max(120),
  identificacion: z.string().max(40),
  cliente: z.string().trim().min(1).max(120),
  cliente_whatsapp: z.string().max(30).default(""),
  concepto: z.string().max(200),
  iva: z.coerce.number().min(0).max(100),
  forma_pago: z.string().max(60),
  cuenta: z.string().max(60),
  titular: z.string().max(80),
  validez: z.coerce.number().int().min(0).max(365),
  entrega: z.string().max(80),
  valor_cotizacion: z.coerce.number().min(0).max(1e10).default(0),
  items: z.array(itemDoc).min(1),
});

export async function actualizarDocumento(formData: FormData) {
  const { sb } = await exigirAdmin();
  const id = txt(formData, "id");
  let items: unknown = [];
  try { items = JSON.parse(txt(formData, "items")); } catch {}
  const r = esquemaEditar.safeParse({ ...Object.fromEntries(formData), items });
  if (!r.success) redirect(`/panel/documentos/${id}/editar?error=1`);

  const d = r.data;
  const subtotal = d.items.reduce((a, x) => a + x.q * x.v, 0);
  const total = Math.round(subtotal * (1 + d.iva / 100));

  // Si ya había una respuesta del cliente, el enlace anterior deja de valer: hay que generar uno nuevo.
  const { data: actual } = await sb.from("documentos").select("tipo,aprobacion").eq("id", id).single();
  const respondida = actual?.tipo === "cotizacion" && ["aprobada", "rechazada"].includes(actual.aprobacion);
  const extra = respondida
    ? { aprobacion: "sin_enviar", token_aprobacion: null, aprobada_en: null, aprobada_por: null, comentario_cliente: null }
    : {};

  await sb.from("documentos").update({ ...d, total, ...extra }).eq("id", id);
  revalidatePath("/panel", "layout");
  redirect(`/panel/documentos/${id}`);
}

export async function duplicarDocumento(formData: FormData) {
  const { sb } = await exigirAdmin();
  const id = txt(formData, "id");
  const { data: o } = await sb.from("documentos").select("*").eq("id", id).single();
  if (!o) redirect("/panel/documentos");

  const { data: ultimo } = await sb
    .from("documentos").select("numero").eq("tipo", o.tipo).order("numero", { ascending: false }).limit(1);
  const numero = (ultimo?.[0]?.numero ?? 0) + 1;

  const { data: nuevo } = await sb.from("documentos").insert({
    tipo: o.tipo,
    numero,
    fecha: new Date().toISOString().slice(0, 10),
    prestador: o.prestador,
    identificacion: o.identificacion,
    cliente: o.cliente,
    cliente_whatsapp: o.cliente_whatsapp,
    concepto: o.concepto,
    items: o.items,
    iva: o.iva,
    forma_pago: o.forma_pago,
    cuenta: o.cuenta,
    titular: o.titular,
    validez: o.validez,
    entrega: o.entrega,
    valor_cotizacion: o.valor_cotizacion,
    total: o.total,
  }).select("id").single();

  revalidatePath("/panel", "layout");
  redirect(nuevo ? `/panel/documentos/${nuevo.id}/editar` : "/panel/documentos");
}
