export type Tema = { id: string; nombre: string; desc: string; color: string; texto: string };

export const TEMAS: Tema[] = [
  { id: "naranja", nombre: "Naranja soldadura", desc: "Cálido y fuerte, como la chispa del arco.", color: "#ff7a1a", texto: "#15110b" },
  { id: "amarillo", nombre: "Amarillo industrial", desc: "Maquinaria y seguridad en obra.", color: "#f5c518", texto: "#14110a" },
  { id: "verde", nombre: "Verde cálido", desc: "Oscuro y sobrio, con un brillo suave.", color: "#8db63c", texto: "#0f1507" },
  { id: "rojo", nombre: "Rojo fuego", desc: "Intenso y de mucha presencia.", color: "#e5122d", texto: "#ffffff" },
  { id: "azul", nombre: "Azul acero", desc: "Serio, técnico y confiable.", color: "#2f7df6", texto: "#ffffff" },
  { id: "blanco", nombre: "Blanco plata", desc: "Sobrio y elegante, casi monocromático.", color: "#f2f2f3", texto: "#0e0e10" },
  { id: "cian", nombre: "Cian eléctrico", desc: "Moderno, como un arco TIG.", color: "#1ec8c8", texto: "#04191a" },
  { id: "morado", nombre: "Morado", desc: "Diferente y creativo.", color: "#9b6bff", texto: "#0f0a1a" },
  { id: "dorado", nombre: "Dorado", desc: "Premium y ejecutivo.", color: "#d4a437", texto: "#17120a" },
  { id: "rosa", nombre: "Rosa fucsia", desc: "Atrevido y llamativo.", color: "#ff4f9a", texto: "#1a0510" },
];

export const IDS_TEMAS = TEMAS.map((t) => t.id);
