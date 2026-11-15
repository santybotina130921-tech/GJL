"use client";

import { useState } from "react";
import { SubidaImagen } from "./SubidaImagen";

export function CampoImagen({ name, valor, carpeta }: { name: string; valor?: string | null; carpeta: string }) {
  const [v, setV] = useState(valor ?? "");
  return (
    <>
      <input type="hidden" name={name} value={v} />
      <SubidaImagen valor={v} onCambio={setV} carpeta={carpeta} />
    </>
  );
}
