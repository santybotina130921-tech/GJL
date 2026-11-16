"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirAdmin } from "@/lib/panel/auth";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { TABLAS, AJUSTES_CAMPOS, FONDOS, FOTOS_PANEL } from "@/lib/panel/tablas";
import { IDS_TEMAS } from "@/lib/temas";
import { crearSlug } from "@/lib/slug";

type Resultado = { ok: boolean; error?: string };
const refrescar = () => revalidatePath("/", "layout");
const txt = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

// Redes sociales: solo se aceptan enlaces https de la red correspondiente.
const DOMINIOS_RED: Record<string, string> = {
  instagram: "instagram.com",
  tiktok: "tiktok.com",
  facebook: "facebook.com",
};
function limpiarAjuste(clave: string, valor: string): string {
  const dominio = DOMINIOS_RED[clave];
  if (!dominio || !valor) return valor;
  try {
    const u = new URL(valor);
    const ok = u.protocol === "https:" && (u.hostname === dominio || u.hostname.endsWith("." + dominio));
    return ok ? u.toString() : "";
  } catch {
    return "";
  }
}

export async function cerrarSesion() {
  const sb = await crearClienteServidor();
  await sb.auth.signOut();
  redirect("/login");
}

/* ---------- Colecciones (servicios, carrusel, preguntas...) ---------- */
export async function guardarFila(
  tabla: string,
  id: string | null,
  datos: Record<string, unknown>,
): Promise<Resultado> {
  const cfg = TABLAS[tabla];
  if (!cfg) return { ok: false, error: "Tabla no válida" };
  const { sb } = await exigirAdmin();

  const fila: Record<string, unknown> = {};
  for (const c of cfg.campos) {
    const v = datos[c.nombre];
    if (c.tipo === "numero") fila[c.nombre] = Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : 0;
    else if (c.tipo === "booleano") fila[c.nombre] = Boolean(v);
    else if (c.tipo === "lista")
      fila[c.nombre] = String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    else if (c.tipo === "imagen") fila[c.nombre] = v ? String(v) : null;
    else fila[c.nombre] = String(v ?? "").trim();
    if (c.requerido && !fila[c.nombre]) return { ok: false, error: `Falta: ${c.etiqueta}` };
  }

  const { error } = id
    ? await sb.from(tabla).update(fila).eq("id", id)
    : await sb.from(tabla).insert(fila);
  if (error) return { ok: false, error: "No se pudo guardar" };
  refrescar();
  return { ok: true };
}

export async function borrarFila(tabla: string, id: string): Promise<Resultado> {
  if (!TABLAS[tabla]) return { ok: false, error: "Tabla no válida" };
  const { sb } = await exigirAdmin();
  const { error } = await sb.from(tabla).delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo borrar" };
  refrescar();
  return { ok: true };
}

/* ---------- Datos y textos / fondos ---------- */
export async function guardarAjustes(formData: FormData) {
  const { sb } = await exigirAdmin();
  const filas = AJUSTES_CAMPOS.map((c) => ({
    clave: c.nombre,
    valor: limpiarAjuste(c.nombre, txt(formData, c.nombre)),
    actualizado: new Date().toISOString(),
  }));
  await sb.from("ajustes").upsert(filas, { onConflict: "clave" });
  refrescar();
  redirect("/panel/ajustes?ok=1");
}

export async function guardarAjuste(clave: string, valor: string): Promise<Resultado> {
  const permitidas = [
    ...AJUSTES_CAMPOS.map((c) => c.nombre),
    ...FONDOS.map((f) => f.clave),
    ...FOTOS_PANEL.map((f) => f.clave),
    "tema",
  ];
  if (clave === "tema" && !IDS_TEMAS.includes(valor)) return { ok: false, error: "Color no válido" };
  valor = limpiarAjuste(clave, valor);
  if (!permitidas.includes(clave)) return { ok: false, error: "Ajuste no válido" };
  const { sb } = await exigirAdmin();
  const { error } = await sb
    .from("ajustes")
    .upsert({ clave, valor, actualizado: new Date().toISOString() }, { onConflict: "clave" });
  if (error) return { ok: false, error: "No se pudo guardar" };
  refrescar();
  return { ok: true };
}

/* ---------- Mensajes (solicitudes del formulario) ---------- */
export async function cambiarEstadoMensaje(formData: FormData) {
  const { sb } = await exigirAdmin();
  const estado = txt(formData, "estado");
  if (!["nueva", "atendida", "descartada"].includes(estado)) return;
  await sb.from("cotizaciones").update({ estado }).eq("id", txt(formData, "id"));
  revalidatePath("/panel", "layout");
}
export async function borrarMensaje(formData: FormData) {
  const { sb } = await exigirAdmin();
  await sb.from("cotizaciones").delete().eq("id", txt(formData, "id"));
  revalidatePath("/panel", "layout");
}

/* ---------- Proyectos ---------- */
export async function guardarProyecto(formData: FormData) {
  const { sb } = await exigirAdmin();
  const id = txt(formData, "id");
  const datos = {
    titulo: txt(formData, "titulo"),
    categoria: txt(formData, "categoria") || "Otros",
    ubicacion: txt(formData, "ubicacion"),
    medidas: txt(formData, "medidas"),
    descripcion: txt(formData, "descripcion"),
    estado: txt(formData, "estado") === "publicado" ? "publicado" : "borrador",
    orden: Math.trunc(Number(txt(formData, "orden"))) || 0,
  };
  if (!datos.titulo) redirect(id ? `/panel/proyectos/${id}?error=1` : "/panel/proyectos/nuevo?error=1");

  let destino = id;
  if (id) {
    await sb.from("proyectos").update(datos).eq("id", id);
  } else {
    const { data } = await sb
      .from("proyectos")
      .insert({ ...datos, slug: crearSlug(datos.titulo) })
      .select("id")
      .single();
    destino = data?.id ?? "";
  }
  refrescar();
  redirect(destino ? `/panel/proyectos/${destino}?ok=1` : "/panel/proyectos");
}

export async function borrarProyecto(formData: FormData) {
  const { sb } = await exigirAdmin();
  const id = txt(formData, "id");
  const { data: media } = await sb.from("proyecto_media").select("url").eq("proyecto_id", id);
  const rutas = (media ?? [])
    .map((m) => m.url.split("/object/public/sitio/")[1])
    .filter(Boolean);
  if (rutas.length) await sb.storage.from("sitio").remove(rutas);
  await sb.from("proyectos").delete().eq("id", id);
  refrescar();
  redirect("/panel/proyectos");
}

export async function agregarMedia(proyectoId: string, tipo: "foto" | "video", url: string) {
  const { sb } = await exigirAdmin();
  const { count } = await sb
    .from("proyecto_media")
    .select("*", { count: "exact", head: true })
    .eq("proyecto_id", proyectoId);
  await sb.from("proyecto_media").insert({
    proyecto_id: proyectoId,
    tipo,
    url,
    orden: count ?? 0,
    es_portada: tipo === "foto" && (count ?? 0) === 0,
  });
  refrescar();
}

export async function portadaMedia(id: string, proyectoId: string) {
  const { sb } = await exigirAdmin();
  await sb.from("proyecto_media").update({ es_portada: false }).eq("proyecto_id", proyectoId);
  await sb.from("proyecto_media").update({ es_portada: true }).eq("id", id);
  refrescar();
}

export async function moverMedia(id: string, proyectoId: string, delta: number) {
  const { sb } = await exigirAdmin();
  const { data } = await sb
    .from("proyecto_media")
    .select("id")
    .eq("proyecto_id", proyectoId)
    .order("orden")
    .order("id");
  const ids = (data ?? []).map((x) => x.id as string);
  const i = ids.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((m, n) => sb.from("proyecto_media").update({ orden: n }).eq("id", m)));
  refrescar();
}

export async function borrarMedia(id: string) {
  const { sb } = await exigirAdmin();
  const { data } = await sb.from("proyecto_media").select("url").eq("id", id).single();
  await sb.from("proyecto_media").delete().eq("id", id);
  const ruta = data?.url?.split("/object/public/sitio/")[1];
  if (ruta) await sb.storage.from("sitio").remove([ruta]);
  refrescar();
}

/* ---------- Documentos (cuentas de cobro y cotizaciones) ---------- */
const item = z.object({
  d: z.string().max(200),
  q: z.coerce.number().min(0),
  v: z.coerce.number().min(0),
});
const esquemaDoc = z.object({
  tipo: z.enum(["cuenta_cobro", "cotizacion"]),
  fecha: z.string().min(8),
  prestador: z.string().max(120),
  identificacion: z.string().max(40),
  cliente: z.string().trim().min(1).max(120),
  cliente_whatsapp: z.string().max(30).default(""),
  valor_cotizacion: z.coerce.number().min(0).max(1e10).default(0),
  concepto: z.string().max(200),
  iva: z.coerce.number().min(0).max(100),
  forma_pago: z.string().max(60),
  cuenta: z.string().max(60),
  titular: z.string().max(80),
  validez: z.coerce.number().int().min(0).max(365),
  entrega: z.string().max(80),
  items: z.array(item).min(1),
});

export async function crearDocumento(formData: FormData) {
  const { sb } = await exigirAdmin();
  let items: unknown = [];
  try {
    items = JSON.parse(txt(formData, "items"));
  } catch {}
  const r = esquemaDoc.safeParse({ ...Object.fromEntries(formData), items });
  if (!r.success) redirect("/panel/documentos/nuevo?error=1");

  const d = r.data;
  const subtotal = d.items.reduce((a, x) => a + x.q * x.v, 0);
  const total = Math.round(subtotal * (1 + d.iva / 100));

  const { data: ultimo } = await sb
    .from("documentos")
    .select("numero")
    .eq("tipo", d.tipo)
    .order("numero", { ascending: false })
    .limit(1);
  const numero = (ultimo?.[0]?.numero ?? 0) + 1;

  const { data, error } = await sb
    .from("documentos")
    .insert({ ...d, numero, total })
    .select("id")
    .single();
  if (error || !data) redirect("/panel/documentos/nuevo?error=1");
  revalidatePath("/panel", "layout");
  redirect(`/panel/documentos/${data.id}`);
}

export async function borrarDocumento(formData: FormData) {
  const { sb } = await exigirAdmin();
  await sb.from("documentos").delete().eq("id", txt(formData, "id"));
  revalidatePath("/panel", "layout");
  redirect("/panel/documentos");
}

/* ---------- Usuarios ---------- */
export async function cambiarRol(formData: FormData) {
  const { user } = await exigirAdmin();
  const id = txt(formData, "id");
  const rol = txt(formData, "rol");
  if (id === user.id || !["admin", "empleado", "cliente"].includes(rol)) return;
  await crearClienteAdmin().from("perfiles").update({ rol }).eq("id", id);
  revalidatePath("/panel/usuarios");
}


/* ---------- Antes y después de un proyecto ---------- */
export async function guardarAntesDespues(id: string, antes: string, despues: string): Promise<Resultado> {
  const { sb } = await exigirAdmin();
  const { error } = await sb
    .from("proyectos")
    .update({ antes_url: antes || null, despues_url: despues || null })
    .eq("id", id);
  if (error) return { ok: false, error: "No se pudo guardar" };
  refrescar();
  return { ok: true };
}

/* ---------- Ingresos y egresos ---------- */
const esquemaMov = z.object({
  tipo: z.enum(["ingreso", "egreso"]),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  concepto: z.string().trim().min(1).max(160),
  categoria: z.string().trim().max(40),
  monto: z.coerce.number().positive().max(1e12),
  metodo: z.string().trim().max(40),
  notas: z.string().trim().max(300),
});

export async function guardarMovimiento(formData: FormData) {
  const { sb } = await exigirAdmin();
  const r = esquemaMov.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect("/panel/finanzas?error=1");
  await sb.from("movimientos").insert(r.data);
  revalidatePath("/panel", "layout");
  redirect(`/panel/finanzas?mes=${r.data.fecha.slice(0, 7)}`);
}

export async function borrarMovimiento(formData: FormData) {
  const { sb } = await exigirAdmin();
  await sb.from("movimientos").delete().eq("id", txt(formData, "id"));
  revalidatePath("/panel", "layout");
  const mes = txt(formData, "mes");
  redirect(/^\d{4}-\d{2}$/.test(mes) ? `/panel/finanzas?mes=${mes}` : "/panel/finanzas");
}

/** Marca una cuenta de cobro como pagada y registra el ingreso automáticamente. */
export async function marcarPagado(formData: FormData) {
  const { sb } = await exigirAdmin();
  const id = txt(formData, "id");
  const { data: doc } = await sb.from("documentos").select("*").eq("id", id).single();
  if (doc && doc.estado !== "pagado") {
    await sb.from("documentos").update({ estado: "pagado" }).eq("id", id);
    await sb.from("movimientos").insert({
      tipo: "ingreso",
      fecha: new Date().toISOString().slice(0, 10),
      concepto: `Pago cuenta de cobro ${String(doc.numero).padStart(3, "0")} · ${doc.cliente}`,
      categoria: "Cuenta de cobro",
      monto: doc.total,
      metodo: doc.forma_pago,
      documento_id: id,
    });
  }
  revalidatePath("/panel", "layout");
  redirect(`/panel/documentos/${id}`);
}
