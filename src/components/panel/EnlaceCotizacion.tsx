"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generarEnlaceCotizacion } from "@/lib/panel/acciones-extra";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";
import { boton, botonBorde, tarjeta } from "./estilos";

const TEXTO: Record<string, string> = {
  sin_enviar: "Sin enviar",
  pendiente: "Esperando respuesta del cliente",
  aprobada: "Aprobada por el cliente",
  rechazada: "Rechazada por el cliente",
};

export function EnlaceCotizacion({ id, token, aprobacion, aprobadaPor, comentario, whatsapp, cliente, numero, base }: {
  id: string; token: string | null; aprobacion: string; aprobadaPor: string | null; comentario: string | null;
  whatsapp: string; cliente: string; numero: number; base: string;
}) {
  const router = useRouter();
  const [pend, inicio] = useTransition();
  const [copiado, setCopiado] = useState(false);
  const enlace = token ? `${base}/cotizacion/${token}` : "";
  const mensaje = `Hola ${cliente}, te enviamos la cotización N° ${String(numero).padStart(3, "0")} de JGL Estructural. Puedes revisarla y aprobarla aquí: ${enlace}`;

  return (
    <div className={`${tarjeta} mb-6 space-y-3 text-sm`}>
      <p>Aprobación por enlace: <b className={aprobacion === "aprobada" ? "text-emerald-400" : ""}>{TEXTO[aprobacion] ?? aprobacion}</b>{aprobadaPor ? ` · ${aprobadaPor}` : ""}</p>
      {comentario && <p className="text-muted-foreground">Comentario del cliente: {comentario}</p>}
      {token ? (
        <>
          <p className="break-all text-muted-foreground">{enlace}</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={boton} onClick={async () => { await navigator.clipboard.writeText(enlace); setCopiado(true); setTimeout(() => setCopiado(false), 2000); }}>{copiado ? "¡Copiado!" : "Copiar enlace"}</button>
            <a href={crearEnlaceWhatsApp(whatsapp, mensaje)} target="_blank" rel="noopener noreferrer" className={botonBorde}>Enviar por WhatsApp</a>
            <button type="button" disabled={pend} className={botonBorde} onClick={() => confirm("Se creará un enlace nuevo y el anterior dejará de funcionar. ¿Continuar?") && inicio(async () => { await generarEnlaceCotizacion(id); router.refresh(); })}>Generar enlace nuevo</button>
          </div>
        </>
      ) : (
        <button type="button" disabled={pend} className={boton} onClick={() => inicio(async () => { await generarEnlaceCotizacion(id); router.refresh(); })}>Generar enlace de aprobación</button>
      )}
    </div>
  );
}
