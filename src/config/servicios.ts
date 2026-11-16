export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  capacidades: string[];
};

export const servicios: Servicio[] = [
  {
    id: "estructuras",
    nombre: "Estructuras metálicas",
    descripcion:
      "Diseño, fabricación y montaje de columnas, vigas, entrepisos y naves en perfilería estructural.",
    capacidades: [
      "Columnas y vigas en perfil estructural",
      "Naves industriales y bodegas",
      "Entrepisos metálicos",
      "Pórticos y marcos",
      "Montaje en obra con personal calificado",
    ],
  },
  {
    id: "soldadura",
    nombre: "Soldadura industrial",
    descripcion:
      "Procesos SMAW, MIG y TIG según el material y la exigencia de cada unión.",
    capacidades: [
      "MIG para taller y producción",
      "TIG para acabados de precisión",
      "Electrodo revestido para obra y exteriores",
      "Reparación y refuerzo de estructuras",
    ],
  },
  {
    id: "cubiertas",
    nombre: "Cubiertas y cerchas",
    descripcion:
      "Cerchas y cubiertas para bodegas, parqueaderos y viviendas, con acabado anticorrosivo.",
    capacidades: [
      "Cerchas en perfil tubular",
      "Cubiertas para bodegas y parqueaderos",
      "Marquesinas y voladizos",
      "Acabado anticorrosivo y pintura",
    ],
  },
  {
    id: "portones",
    nombre: "Portones y cerramientos",
    descripcion:
      "Portones, rejas, barandas y cerramientos a la medida, instalados en tu obra.",
    capacidades: [
      "Portones batientes y corredizos",
      "Rejas y cerramientos",
      "Barandas y escaleras",
      "Instalación incluida",
    ],
  },
  {
    id: "inoxidable",
    nombre: "Trabajos en acero inoxidable",
    descripcion:
      "Fabricación y soldadura en acero inoxidable, con acabados limpios, resistentes y duraderos.",
    capacidades: [
      "Soldadura TIG en acero inoxidable",
      "Barandas, pasamanos y escaleras en inox",
      "Mesones y estructuras para cocinas y alimentos",
      "Tanques y soportes",
    ],
  },
];
