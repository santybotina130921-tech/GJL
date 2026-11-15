"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { regenerarCodigo } from "@/lib/panel/acciones-extra";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";
import { boton, botonBorde, tarjeta } from "./estilos";

export function EnlaceObra({ id, codigo, base, whatsapp, nombre, cliente }: {
  id: string; codigo: string; base: string; whatsapp: string; nombre: string; cliente: string;
}) {
  const router = useRouter();
  const [copiado, setCopiado] = useState(false);
  const [pend, inicio] = useTransition();
  const enlace = `${base}/seguimiento/${codigo}`;
  const mensaje = `Hola ${cliente}, aquí puedes ver el avance de tu obra "${nombre}": ${enlace}\nTambién puedes entrar a ${base}/seguimiento y escribir el código ${codigo}.`;

  const copiar = async () => {
    await navigator.clipboard.writeText(enlace);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className={`${tarjeta} space-y-4`}>
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Código de la obra</p>
          <p className="font-display text-4xl tracking-wider text-primary">{codigo}</p>
        </div>
        <p className="min-w-0 flex-1 break-all text-sm text-muted-foreground">{enlace}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copiar} className={boton}>{copiado ? "¡Copiado!" : "Copiar enlace"}</button>
        <a href={crearEnlaceWhatsApp(whatsapp, mensaje)} target="_blank" rel="noopener noreferrer" className={botonBorde}>Enviar por WhatsApp</a>
        <button
          type="button"
          disabled={pend}
          onClick={() => confirm("El enlace anterior dejará de funcionar. ¿Generar un código nuevo?") && inicio(async () => { await regenerarCodigo(id); router.refresh(); })}
          className={botonBorde}
        >
          Generar código nuevo
        </button>
      </div>
    </div>
  );
}
