import { cache } from "react";
import { crearClientePublico } from "@/lib/supabase/publico";
import { sitio } from "@/config/sitio";
import { servicios as serviciosBase, type Servicio } from "@/config/servicios";
import { proyectos as proyectosBase, type Proyecto } from "@/config/proyectos";
import { diapositivas as diapositivasBase } from "@/config/carrusel";
import type { Diapositiva } from "@/components/publico/Carrusel";

export type Ajustes = Record<string, string>;

const AJUSTES_BASE: Ajustes = {
  inicio_titulo: "Estructuras metálicas\ny soldadura\nque aguantan.",
  inicio_subtitulo:
    "Fabricamos, soldamos y montamos estructuras para obras civiles, bodegas y viviendas dándole forma al metal y a tus sueños.",
  whatsapp: sitio.whatsapp,
  telefono_visible: sitio.telefonoVisible,
  correo: sitio.correo,
  ciudad: sitio.ciudad,
  horario: sitio.horario,
  nosotros_texto:
    "Más que un taller, somos el equipo que convierte planos en estructuras seguras, bien soldadas y listas para durar décadas.",
  nosotros_mision:
    "Nuestra misión es simple: que cada unión soldada sostenga la confianza que el cliente puso en nosotros.",
};

export const getAjustes = cache(async (): Promise<Ajustes> => {
  try {
    const { data } = await crearClientePublico().from("ajustes").select("clave,valor");
    const mapa = { ...AJUSTES_BASE };
    data?.forEach((f) => {
      if (f.valor !== "" || f.clave.startsWith("fondo_")) mapa[f.clave] = f.valor;
    });
    return mapa;
  } catch {
    return AJUSTES_BASE;
  }
});

async function leer<T>(tabla: string, columnas: string, base: T[]): Promise<T[]> {
  try {
    const { data, error } = await crearClientePublico()
      .from(tabla)
      .select(columnas)
      .eq("activo", true)
      .order("orden");
    if (error || !data || data.length === 0) return base;
    return data as unknown as T[];
  } catch {
    return base;
  }
}

export const getServicios = cache(async (): Promise<Servicio[]> => {
  const filas = await leer<{ id: string; nombre: string; descripcion: string | null; capacidades: string[] | null }>(
    "servicios", "id,nombre,descripcion,capacidades", [],
  );
  if (!filas.length) return serviciosBase;
  return filas.map((f) => ({
    id: f.id,
    nombre: f.nombre,
    descripcion: f.descripcion ?? "",
    capacidades: f.capacidades ?? [],
  }));
});

export const getDiapositivas = cache(async (): Promise<Diapositiva[]> => {
  const filas = await leer<{ titulo: string; detalle: string; imagen_url: string | null }>(
    "diapositivas", "titulo,detalle,imagen_url", [],
  );
  if (!filas.length) return diapositivasBase;
  return filas.map((f) => ({ titulo: f.titulo, detalle: f.detalle, src: f.imagen_url ?? undefined }));
});

export const getEstadisticas = cache(() =>
  leer<{ valor: number; etiqueta: string }>("estadisticas", "valor,etiqueta", [
    { valor: 12, etiqueta: "años de experiencia" },
    { valor: 140, etiqueta: "proyectos entregados" },
    { valor: 85, etiqueta: "toneladas de acero trabajadas" },
  ]),
);

export const getHitos = cache(() =>
  leer<{ titulo: string; texto: string }>("hitos", "titulo,texto", [
    { titulo: "Los inicios", texto: "Un taller pequeño y la decisión de hacer cada soldadura bien." },
    { titulo: "Hoy", texto: "Estructuras para obras civiles, bodegas y viviendas, con entrega a tiempo." },
  ]),
);

export const getPreguntas = cache(() =>
  leer<{ pregunta: string; respuesta: string }>("preguntas", "pregunta,respuesta", [
    { pregunta: "¿Hacen visita técnica?", respuesta: "Sí. Escríbenos por WhatsApp y coordinamos el día y la hora." },
  ]),
);

export const getTestimonios = cache(() =>
  leer<{ nombre: string; cargo: string; texto: string }>("testimonios", "nombre,cargo,texto", []),
);

export const getProyectos = cache(async (): Promise<Proyecto[]> => {
  try {
    const sb = crearClientePublico();
    const { data, error } = await sb
      .from("proyectos")
      .select("id,slug,titulo,categoria,ubicacion,medidas,descripcion,antes_url,despues_url")
      .eq("estado", "publicado")
      .order("orden")
      .order("creado_en", { ascending: false });
    if (error || !data || data.length === 0) return proyectosBase;

    const { data: media } = await sb
      .from("proyecto_media")
      .select("proyecto_id,tipo,url,es_portada,orden")
      .in("proyecto_id", data.map((p) => p.id))
      .order("orden");

    return data.map((p) => {
      const m = (media ?? [])
        .filter((x) => x.proyecto_id === p.id)
        .sort((a, b) => Number(b.es_portada) - Number(a.es_portada) || a.orden - b.orden);
      return {
        slug: p.slug,
        titulo: p.titulo,
        categoria: p.categoria,
        ubicacion: p.ubicacion ?? "",
        medidas: p.medidas ?? "",
        descripcion: p.descripcion ?? "",
        imagen: m.find((x) => x.tipo === "foto")?.url,
        antes: p.antes_url ?? undefined,
        despues: p.despues_url ?? undefined,
        media: m.map((x) => ({ tipo: x.tipo as "foto" | "video", url: x.url })),
      };
    });
  } catch {
    return proyectosBase;
  }
});

export const getEquipo = cache(() =>
  leer<{ nombre: string; cargo: string; foto_url: string | null }>("equipo", "nombre,cargo,foto_url", [
    { nombre: "Nombre del integrante", cargo: "Soldador", foto_url: null },
    { nombre: "Nombre del integrante", cargo: "Maestro de obra", foto_url: null },
    { nombre: "Nombre del integrante", cargo: "Ayudante de taller", foto_url: null },
  ]),
);

export const getCertificaciones = cache(() =>
  leer<{ titulo: string; detalle: string }>("certificaciones", "titulo,detalle", [
    { titulo: "Garantía por escrito", detalle: "Cada obra se entrega con su garantía y un acta de recibo." },
    { titulo: "Personal afiliado", detalle: "Equipo con seguridad social y ARL al día." },
    { titulo: "Trabajo seguro", detalle: "Equipos de protección y normas de seguridad en cada obra." },
  ]),
);

export const getTarifas = cache(() =>
  leer<{ nombre: string; unidad: string; precio_min: number; precio_max: number }>(
    "tarifas", "nombre,unidad,precio_min,precio_max", [],
  ),
);

export const getProductos = cache(() =>
  leer<{ nombre: string; categoria: string; descripcion: string; imagen_url: string | null; precio_desde: number; medidas: string; unidad_precio: string }>(
    "productos", "nombre,categoria,descripcion,imagen_url,precio_desde,medidas,unidad_precio", [],
  ),
);

export type Entrada = {
  slug: string; titulo: string; resumen: string; contenido: string;
  imagen_url: string | null; publicada_en: string | null;
};

export const getEntradas = cache(async (): Promise<Entrada[]> => {
  try {
    const { data } = await crearClientePublico()
      .from("entradas")
      .select("slug,titulo,resumen,contenido,imagen_url,publicada_en")
      .eq("publicado", true)
      .order("publicada_en", { ascending: false });
    return (data as Entrada[] | null) ?? [];
  } catch {
    return [];
  }
});

export const getEntrada = cache(async (slug: string): Promise<Entrada | null> => {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  try {
    const { data } = await crearClientePublico()
      .from("entradas")
      .select("slug,titulo,resumen,contenido,imagen_url,publicada_en")
      .eq("slug", slug)
      .eq("publicado", true)
      .maybeSingle();
    return (data as Entrada | null) ?? null;
  } catch {
    return null;
  }
});

export const getAliados = cache(() =>
  leer<{ nombre: string; logo_url: string | null }>("aliados", "nombre,logo_url", [
    { nombre: "Ferrecortes", logo_url: null },
    { nombre: "Agofer", logo_url: null },
    { nombre: "Tornituercas", logo_url: null },
    { nombre: "Montajes Estructurales JJ", logo_url: null },
    { nombre: "Oxigenar", logo_url: null },
  ]),
);

export type Calificacion = { estrellas: number; comentario: string; nombre: string };

export const getCalificaciones = cache(async (): Promise<Calificacion[]> => {
  try {
    const { data } = await crearClientePublico()
      .from("calificaciones")
      .select("estrellas,comentario,nombre")
      .eq("aprobada", true)
      .order("creado_en", { ascending: false })
      .limit(30);
    return (data as Calificacion[] | null) ?? [];
  } catch {
    return [];
  }
});
