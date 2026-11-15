export const sitio = {
  nombre: "JGL Estructural",
  lema: "Welding & Steel Structures",
  whatsapp: "573195562698", // para enlaces de WhatsApp: sin + ni espacios
  telefono: "+573195562698", // para enlaces tel:
  telefonoVisible: "+57 319 556 2698",
  correo: "santybotina130921@gmail.com",
  ciudad: "Ciudad, Colombia",
  horario: "Lunes a sábado, 7 a. m. a 5 p. m.",
} as const;

export const enlaceWhatsApp = (mensaje = "Hola, quiero cotizar una obra") =>
  `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
