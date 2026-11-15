export type Campo = {
  nombre: string;
  etiqueta: string;
  tipo: "texto" | "largo" | "numero" | "imagen" | "lista" | "booleano";
  requerido?: boolean;
  ayuda?: string;
};
export type ConfigTabla = { titulo: string; ayuda: string; resumen: string; campos: Campo[] };

const orden: Campo = { nombre: "orden", etiqueta: "Orden", tipo: "numero", ayuda: "Menor número = aparece primero" };
const activo: Campo = { nombre: "activo", etiqueta: "Visible en la página", tipo: "booleano" };

export const TABLAS: Record<string, ConfigTabla> = {
  servicios: {
    titulo: "Servicios",
    ayuda: "Lo que ofrece la empresa. Aparece en Inicio y en la página Servicios.",
    resumen: "nombre",
    campos: [
      { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
      { nombre: "descripcion", etiqueta: "Descripción", tipo: "largo" },
      { nombre: "capacidades", etiqueta: "Qué incluye", tipo: "lista", ayuda: "Una por línea" },
      orden, activo,
    ],
  },
  diapositivas: {
    titulo: "Carrusel del inicio",
    ayuda: "Las fotos grandes que cambian solas en la portada.",
    resumen: "titulo",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", requerido: true },
      { nombre: "detalle", etiqueta: "Texto corto", tipo: "texto" },
      { nombre: "imagen_url", etiqueta: "Foto", tipo: "imagen" },
      orden, activo,
    ],
  },
  estadisticas: {
    titulo: "Cifras del inicio",
    ayuda: "Los números que suben al hacer scroll (años, proyectos, toneladas).",
    resumen: "etiqueta",
    campos: [
      { nombre: "valor", etiqueta: "Número", tipo: "numero" },
      { nombre: "etiqueta", etiqueta: "Qué significa", tipo: "texto", requerido: true },
      orden, activo,
    ],
  },
  hitos: {
    titulo: "Historia (Nosotros)",
    ayuda: "La línea de tiempo de la página Nosotros.",
    resumen: "titulo",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", requerido: true },
      { nombre: "texto", etiqueta: "Texto", tipo: "largo" },
      orden, activo,
    ],
  },
  preguntas: {
    titulo: "Preguntas frecuentes",
    ayuda: "Preguntas y respuestas de la página Servicios.",
    resumen: "pregunta",
    campos: [
      { nombre: "pregunta", etiqueta: "Pregunta", tipo: "texto", requerido: true },
      { nombre: "respuesta", etiqueta: "Respuesta", tipo: "largo", requerido: true },
      orden, activo,
    ],
  },
  testimonios: {
    titulo: "Testimonios",
    ayuda: "Opiniones de clientes. Si no hay ninguno, la sección no se muestra.",
    resumen: "nombre",
    campos: [
      { nombre: "nombre", etiqueta: "Nombre del cliente", tipo: "texto", requerido: true },
      { nombre: "cargo", etiqueta: "Empresa o cargo", tipo: "texto" },
      { nombre: "texto", etiqueta: "Opinión", tipo: "largo", requerido: true },
      orden, activo,
    ],
  },
};

TABLAS.equipo = {
  titulo: "Equipo",
  ayuda: "Las personas que aparecen en la página Nosotros.",
  resumen: "nombre",
  campos: [
    { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
    { nombre: "cargo", etiqueta: "Cargo", tipo: "texto" },
    { nombre: "foto_url", etiqueta: "Foto", tipo: "imagen" },
    { nombre: "orden", etiqueta: "Orden", tipo: "numero", ayuda: "Menor número = aparece primero" },
    { nombre: "activo", etiqueta: "Visible en la página", tipo: "booleano" },
  ],
};
TABLAS.certificaciones = {
  titulo: "Certificaciones y garantías",
  ayuda: "Certificados, garantías y seguridad que muestra la página Nosotros.",
  resumen: "titulo",
  campos: [
    { nombre: "titulo", etiqueta: "Título", tipo: "texto", requerido: true },
    { nombre: "detalle", etiqueta: "Detalle", tipo: "largo" },
    { nombre: "orden", etiqueta: "Orden", tipo: "numero", ayuda: "Menor número = aparece primero" },
    { nombre: "activo", etiqueta: "Visible en la página", tipo: "booleano" },
  ],
};

TABLAS.tarifas = {
  titulo: "Tarifas del cotizador",
  ayuda: "Rango de precio por unidad para el cotizador de la página. Solo se muestran las que estén activas. Ponle los precios reales y actívalas.",
  resumen: "nombre",
  campos: [
    { nombre: "nombre", etiqueta: "Trabajo", tipo: "texto", requerido: true },
    { nombre: "unidad", etiqueta: "Unidad (m², metro lineal, unidad)", tipo: "texto" },
    { nombre: "precio_min", etiqueta: "Precio mínimo por unidad (COP)", tipo: "numero" },
    { nombre: "precio_max", etiqueta: "Precio máximo por unidad (COP)", tipo: "numero" },
    { nombre: "orden", etiqueta: "Orden", tipo: "numero" },
    { nombre: "activo", etiqueta: "Visible en el cotizador", tipo: "booleano" },
  ],
};
TABLAS.productos = {
  titulo: "Catálogo de productos",
  ayuda: "Productos estándar que se muestran en la página Catálogo. Solo aparecen los activos.",
  resumen: "nombre",
  campos: [
    { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
    { nombre: "categoria", etiqueta: "Categoría", tipo: "texto" },
    { nombre: "descripcion", etiqueta: "Descripción", tipo: "largo" },
    { nombre: "imagen_url", etiqueta: "Foto", tipo: "imagen" },
    { nombre: "precio_desde", etiqueta: "Precio desde (COP, 0 = no mostrar)", tipo: "numero" },
    { nombre: "orden", etiqueta: "Orden", tipo: "numero" },
    { nombre: "activo", etiqueta: "Visible en la página", tipo: "booleano" },
  ],
};

export const FOTOS_PANEL = [
  { clave: "panel_banner", etiqueta: "Foto de portada del Resumen" },
  { clave: "panel_avatar", etiqueta: "Tu foto de perfil" },
];

export const AJUSTES_CAMPOS: { nombre: string; etiqueta: string; largo?: boolean }[] = [
  { nombre: "whatsapp", etiqueta: "WhatsApp (solo números; con el 57 al inicio)" },
  { nombre: "telefono_visible", etiqueta: "Teléfono que se muestra en la página" },
  { nombre: "correo", etiqueta: "Correo de contacto" },
  { nombre: "ciudad", etiqueta: "Ciudad" },
  { nombre: "horario", etiqueta: "Horario de atención" },
  { nombre: "nosotros_texto", etiqueta: "Texto principal de Nosotros", largo: true },
  { nombre: "nosotros_mision", etiqueta: "Misión", largo: true },
  { nombre: "instagram", etiqueta: "Instagram (enlace completo, opcional: si lo llenas aparece flotando)" },
  { nombre: "tiktok", etiqueta: "TikTok (enlace completo, opcional)" },
  { nombre: "facebook", etiqueta: "Facebook (enlace completo, opcional)" },
];

export const FONDOS = [
  { clave: "fondo_inicio", etiqueta: "Inicio (detrás del título)" },
  { clave: "fondo_nosotros", etiqueta: "Nosotros" },
  { clave: "fondo_proyectos", etiqueta: "Proyectos" },
  { clave: "fondo_servicios", etiqueta: "Servicios" },
  { clave: "fondo_contacto", etiqueta: "Contacto" },
  { clave: "fondo_cta", etiqueta: "Banda roja de cotización" },
];
