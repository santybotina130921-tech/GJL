"use client";

import { crearEnlaceWhatsApp } from "@/lib/whatsapp";
import { botonBorde, tarjeta } from "./estilos";

export function PedirCalificacion({ codigo, base, whatsapp, cliente, nombre }: {
  codigo: string; base: string; whatsapp: string; cliente: string; nombre: string;
}) {
  const mensaje = `Hola ${cliente}, gracias por confiar en JGL Estructural para "${nombre}". Nos ayudaría mucho que calificaras tu obra aquí: ${base}/seguimiento/${codigo}`;
  return (
    <div className={`${tarjeta} flex flex-wrap items-center justify-between gap-4`}>
      <p className="text-sm text-muted-foreground">La obra está terminada: ya puedes pedirle al cliente que la califique.</p>
      <a href={crearEnlaceWhatsApp(whatsapp, mensaje)} target="_blank" rel="noopener noreferrer" className={botonBorde}>Pedir calificación por WhatsApp</a>
    </div>
  );
}
