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

// Ejemplos que solo se muestran mientras no haya proyectos publicados desde el panel.
export const proyectos: Proyecto[] = [
  { slug: "cubierta-bodega", titulo: "Cubierta para bodega", categoria: "Cubiertas", ubicacion: "Ciudad, Colombia", medidas: "420 m²", descripcion: "Cerchas en perfil tubular con cubierta metálica y acabado anticorrosivo." },
  { slug: "nave-industrial", titulo: "Nave industrial", categoria: "Estructuras", ubicacion: "Zona industrial", medidas: "900 m²", descripcion: "Pórticos en perfiles H soldados en taller y montados en obra." },
  { slug: "entrepiso-local", titulo: "Entrepiso metálico", categoria: "Estructuras", ubicacion: "Ciudad, Colombia", medidas: "180 m²", descripcion: "Entrepiso con vigas IPE y lámina colaborante para local comercial." },
  { slug: "tanque-inox", titulo: "Tanque y soportes", categoria: "Soldadura", ubicacion: "Planta de procesos", medidas: "12 m³", descripcion: "Soldadura TIG en acero inoxidable con prueba de estanqueidad." },
  { slug: "parqueadero", titulo: "Parqueadero cubierto", categoria: "Cubiertas", ubicacion: "Ciudad, Colombia", medidas: "260 m²", descripcion: "Columnas y cubierta en voladizo para 14 vehículos." },
  { slug: "porton-corredizo", titulo: "Portón corredizo", categoria: "Portones", ubicacion: "Zona residencial", medidas: "5 m de luz", descripcion: "Portón corredizo con riel y acabado en pintura electrostática." },
];
