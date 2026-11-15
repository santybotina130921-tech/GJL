const U = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const D = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const C = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

const apocopar = (s: string) => s.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un");

function centenas(x: number): string {
  if (x === 100) return "cien";
  const r = x % 100;
  let s = C[Math.floor(x / 100)];
  if (r < 30) {
    if (r) s += (s ? " " : "") + U[r];
  } else {
    s += (s ? " " : "") + D[Math.floor(r / 10)] + (r % 10 ? " y " + U[r % 10] : "");
  }
  return s;
}

export function numeroALetras(n: number): string {
  n = Math.floor(Math.abs(n));
  if (!n) return "cero";
  let o = "";
  const millones = Math.floor(n / 1e6);
  if (millones) o += (millones === 1 ? "un millón" : apocopar(numeroALetras(millones)) + " millones") + " ";
  n %= 1e6;
  const miles = Math.floor(n / 1000);
  if (miles) o += (miles === 1 ? "mil" : apocopar(centenas(miles)) + " mil") + " ";
  n %= 1000;
  if (n) o += centenas(n);
  return o.trim();
}

export const formatoCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
