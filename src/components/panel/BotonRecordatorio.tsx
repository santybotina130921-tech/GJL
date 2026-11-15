"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registrarRecordatorio } from "@/lib/panel/acciones-extra";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";
import { boton } from "./estilos";

export function BotonRecordatorio({ id, whatsapp, mensaje, ultimo }: {
  id: string; whatsapp: string; mensaje: string; ultimo: string | null;
}) {
  const router = useRouter();
  const [pend, inicio] = useTransition();
  const [aviso, setAviso] = useState("");

  const enviar = () => {
    if (!whatsapp) { setAviso("Falta el WhatsApp del cliente en el documento."); return; }
    window.open(crearEnlaceWhatsApp(whatsapp, mensaje), "_blank", "noopener,noreferrer");
    inicio(async () => { await registrarRecordatorio(id); router.refresh(); });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={enviar} disabled={pend} className={boton}>Enviar recordatorio por WhatsApp</button>
      <span className="text-xs text-muted-foreground">{aviso || (ultimo ? `Último recordatorio: ${ultimo}` : "Aún no se ha enviado recordatorio")}</span>
    </div>
  );
}
