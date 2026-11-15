"use client";

import { botonBorde } from "./estilos";

type Fila = Record<string, string | number | null>;
const COLUMNAS = ["fecha", "tipo", "concepto", "categoria", "monto", "metodo", "notas"];

// Evita que una celda que empiece por = + - @ se interprete como fórmula en Excel.
const celda = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

export function ExportarCSV({ filas, nombre }: { filas: Fila[]; nombre: string }) {
  const descargar = () => {
    const csv =
      "\uFEFF" +
      [COLUMNAS.join(","), ...filas.map((f) => COLUMNAS.map((c) => celda(f[c])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nombre}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" onClick={descargar} disabled={!filas.length} className={botonBorde}>
      Descargar Excel (CSV)
    </button>
  );
}
