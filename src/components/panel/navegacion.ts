import type { IconoNombre } from "./iconos";

export type ItemNav = { href: string; texto: string; icono: IconoNombre; grupo: string };

export const NAV: ItemNav[] = [
  { href: "/panel", texto: "Resumen", icono: "resumen", grupo: "General" },
  { href: "/panel/mensajes", texto: "Mensajes", icono: "mensajes", grupo: "General" },
  { href: "/panel/visitas", texto: "Visitas técnicas", icono: "visitas", grupo: "General" },
  { href: "/panel/obras", texto: "Obras (seguimiento)", icono: "obras", grupo: "General" },
  { href: "/panel/calificaciones", texto: "Calificaciones", icono: "testimonios", grupo: "General" },
  { href: "/panel/proyectos", texto: "Proyectos", icono: "proyectos", grupo: "General" },
  { href: "/panel/documentos", texto: "Cuentas de cobro y cotizaciones", icono: "documentos", grupo: "General" },
  { href: "/panel/finanzas", texto: "Ingresos y egresos", icono: "finanzas", grupo: "General" },
  { href: "/panel/blog", texto: "Blog", icono: "blog", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/productos", texto: "Catálogo de productos", icono: "catalogo", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/tarifas", texto: "Tarifas del cotizador", icono: "cifras", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/servicios", texto: "Servicios", icono: "servicios", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/diapositivas", texto: "Carrusel del inicio", icono: "carrusel", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/estadisticas", texto: "Cifras del inicio", icono: "cifras", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/hitos", texto: "Historia", icono: "historia", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/equipo", texto: "Equipo", icono: "usuarios", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/aliados", texto: "Aliados", icono: "usuarios", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/preguntas", texto: "Preguntas frecuentes", icono: "preguntas", grupo: "Contenido del sitio" },
  { href: "/panel/contenido/testimonios", texto: "Testimonios", icono: "testimonios", grupo: "Contenido del sitio" },
  { href: "/panel/ajustes", texto: "Datos y redes", icono: "ajustes", grupo: "Contenido del sitio" },
  { href: "/panel/fondos", texto: "Colores y fondos", icono: "apariencia", grupo: "Contenido del sitio" },
  { href: "/panel/usuarios", texto: "Usuarios", icono: "usuarios", grupo: "Seguridad" },
  { href: "/panel/seguridad", texto: "Seguridad y respaldo", icono: "seguridad", grupo: "Seguridad" },
  { href: "/panel/auditoria", texto: "Registro de cambios", icono: "auditoria", grupo: "Seguridad" },
];
