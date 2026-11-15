"use client";

import { boton } from "./estilos";

export function BotonImprimir() {
  return (
    <button type="button" onClick={() => window.print()} className={boton}>
      Descargar PDF / Imprimir
    </button>
  );
}
