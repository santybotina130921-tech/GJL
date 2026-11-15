export const HORAS = ["8:00 a. m.", "9:00 a. m.", "10:00 a. m.", "11:00 a. m.", "2:00 p. m.", "3:00 p. m.", "4:00 p. m."];

export const hoyBogota = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

/** Próximos días hábiles (lunes a sábado), empezando mañana. */
export function fechasDisponibles(hoy: string, cuantas = 14): string[] {
  const [a, m, d] = hoy.split("-").map(Number);
  const lista: string[] = [];
  for (let i = 1; lista.length < cuantas && i < 60; i++) {
    const f = new Date(Date.UTC(a, m - 1, d + i));
    if (f.getUTCDay() !== 0) lista.push(f.toISOString().slice(0, 10));
  }
  return lista;
}

export const etiquetaFecha = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
