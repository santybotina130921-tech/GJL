export type Proyecto = {
  slug: string;
  titulo: string;
  categoria: string;
  ubicacion: string;
  medidas: string;
  descripcion: string;
  imagen?: string;
  media?: { tipo: "foto" | "video"; url: string }[];
  antes?: string;
  despues?: string;
};

// Respaldo con las fotos reales de las obras. Solo se usa mientras la base de datos no tenga
// proyectos publicados; después los proyectos se administran desde el panel.
export const proyectos: Proyecto[] = [
  {
    slug: "casa-estructura-metalica",
    titulo: "Casa en estructura metálica",
    categoria: "Estructuras",
    ubicacion: "",
    medidas: "",
    descripcion: "Vivienda campestre con estructura metálica, ventanales con perfilería de acero y terraza con baranda.",
    imagen: "/proyectos/casa/04.webp",
    media: [{ tipo: "foto", url: "/proyectos/casa/01.webp" }, { tipo: "foto", url: "/proyectos/casa/02.webp" }, { tipo: "foto", url: "/proyectos/casa/03.webp" }, { tipo: "foto", url: "/proyectos/casa/04.webp" }, { tipo: "foto", url: "/proyectos/casa/05.webp" }, { tipo: "foto", url: "/proyectos/casa/06.webp" }, { tipo: "foto", url: "/proyectos/casa/07.webp" }, { tipo: "foto", url: "/proyectos/casa/08.webp" }, { tipo: "foto", url: "/proyectos/casa/09.webp" }],
  },
  {
    slug: "cubierta-gran-luz",
    titulo: "Cubierta metálica de gran luz",
    categoria: "Cubiertas",
    ubicacion: "",
    medidas: "",
    descripcion: "Estructura de cubierta metálica con grandes voladizos, montada con grúa sobre columnas.",
    imagen: "/proyectos/cubierta/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/cubierta/01.webp" }, { tipo: "foto", url: "/proyectos/cubierta/02.webp" }, { tipo: "foto", url: "/proyectos/cubierta/03.webp" }, { tipo: "foto", url: "/proyectos/cubierta/04.webp" }, { tipo: "foto", url: "/proyectos/cubierta/05.webp" }, { tipo: "foto", url: "/proyectos/cubierta/06.webp" }],
  },
  {
    slug: "cerchas-cubierta",
    titulo: "Cerchas y estructura de cubierta",
    categoria: "Cubiertas",
    ubicacion: "",
    medidas: "",
    descripcion: "Cerchas metálicas para cubierta, fabricadas y montadas en obra.",
    imagen: "/proyectos/cerchas/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/cerchas/01.webp" }, { tipo: "foto", url: "/proyectos/cerchas/02.webp" }, { tipo: "foto", url: "/proyectos/cerchas/03.webp" }],
  },
  {
    slug: "estructura-edificacion",
    titulo: "Estructura metálica para edificación",
    categoria: "Estructuras",
    ubicacion: "",
    medidas: "",
    descripcion: "Columnas y vigas metálicas para edificación, con detalle de anclaje en placa base.",
    imagen: "/proyectos/edificacion/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/edificacion/01.webp" }, { tipo: "foto", url: "/proyectos/edificacion/02.webp" }, { tipo: "foto", url: "/proyectos/edificacion/03.webp" }, { tipo: "foto", url: "/proyectos/edificacion/04.webp" }, { tipo: "foto", url: "/proyectos/edificacion/05.webp" }],
  },
  {
    slug: "marquesina-fachada-lamas",
    titulo: "Marquesina y fachada en lamas de madera",
    categoria: "Fachadas",
    ubicacion: "",
    medidas: "",
    descripcion: "Estructura metálica combinada con revestimiento en lamas de madera, para marquesina de acceso y fachada.",
    imagen: "/proyectos/marquesina/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/marquesina/01.webp" }, { tipo: "foto", url: "/proyectos/marquesina/02.webp" }, { tipo: "foto", url: "/proyectos/marquesina/03.webp" }, { tipo: "foto", url: "/proyectos/marquesina/04.webp" }, { tipo: "foto", url: "/proyectos/marquesina/05.webp" }, { tipo: "foto", url: "/proyectos/marquesina/06.webp" }],
  },
  {
    slug: "escaleras-acero-madera",
    titulo: "Escaleras en acero y madera",
    categoria: "Escaleras",
    ubicacion: "",
    medidas: "",
    descripcion: "Escaleras interiores con estructura en acero: modelo en caracol, de zanca central con peldaños de madera y flotante.",
    imagen: "/proyectos/escaleras-interiores/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/escaleras-interiores/01.webp" }, { tipo: "foto", url: "/proyectos/escaleras-interiores/02.webp" }, { tipo: "foto", url: "/proyectos/escaleras-interiores/03.webp" }],
  },
  {
    slug: "escaleras-exteriores-industriales",
    titulo: "Escaleras exteriores e industriales",
    categoria: "Escaleras",
    ubicacion: "",
    medidas: "",
    descripcion: "Escaleras metálicas exteriores y de acceso industrial, con barandas.",
    imagen: "/proyectos/escaleras-exteriores/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/escaleras-exteriores/01.webp" }, { tipo: "foto", url: "/proyectos/escaleras-exteriores/02.webp" }, { tipo: "foto", url: "/proyectos/escaleras-exteriores/03.webp" }],
  },
  {
    slug: "acero-inoxidable-diseno",
    titulo: "Acero inoxidable y diseño",
    categoria: "Inoxidable",
    ubicacion: "",
    medidas: "",
    descripcion: "Escalera en caracol con baranda en acero inoxidable y base geométrica en acero para mobiliario.",
    imagen: "/proyectos/inoxidable/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/inoxidable/01.webp" }, { tipo: "foto", url: "/proyectos/inoxidable/02.webp" }],
  },
  {
    slug: "cerramiento-metalico",
    titulo: "Cerramiento metálico",
    categoria: "Portones",
    ubicacion: "",
    medidas: "",
    descripcion: "Cerramiento y reja metálica en perfilería, instalada junto a fachada en piedra.",
    imagen: "/proyectos/cerramiento/01.webp",
    media: [{ tipo: "foto", url: "/proyectos/cerramiento/01.webp" }],
  },
];
