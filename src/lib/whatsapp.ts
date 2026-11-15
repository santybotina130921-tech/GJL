export const normalizarTelefono = (n: string) => {
  const d = n.replace(/\D/g, "");
  return d.length === 10 ? `57${d}` : d;
};

export const crearEnlaceWhatsApp = (numero: string, mensaje = "Hola, quiero cotizar una obra") =>
  `https://wa.me/${normalizarTelefono(numero)}?text=${encodeURIComponent(mensaje)}`;
