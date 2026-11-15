"use client";

import { useCallback, useEffect, useState } from "react";
import { crearClienteNavegador } from "@/lib/supabase/cliente";
import { boton, botonBorde, campo, tarjeta } from "./estilos";

type Factor = { id: string; status: string; friendly_name?: string | null };

export function Configurar2FA() {
  const [factores, setFactores] = useState<Factor[]>([]);
  const [enrol, setEnrol] = useState<{ id: string; qr: string; secreto: string } | null>(null);
  const [codigo, setCodigo] = useState("");
  const [msg, setMsg] = useState("");

  const cargar = useCallback(async () => {
    const { data } = await crearClienteNavegador().auth.mfa.listFactors();
    setFactores((data?.all ?? []) as Factor[]);
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const verificados = factores.filter((f) => f.status === "verified");

  const iniciar = async () => {
    setMsg("");
    const sb = crearClienteNavegador();
    // Limpia intentos anteriores sin terminar
    for (const f of factores.filter((x) => x.status !== "verified")) await sb.auth.mfa.unenroll({ factorId: f.id });
    const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp", friendlyName: `Celular ${new Date().toISOString().slice(0, 10)}` });
    if (error || !data) { setMsg("No se pudo iniciar. ¿Está activada la verificación en dos pasos en Supabase?"); return; }
    setEnrol({ id: data.id, qr: data.totp.qr_code, secreto: data.totp.secret });
  };

  const confirmar = async () => {
    if (!enrol) return;
    const sb = crearClienteNavegador();
    const { data: ch, error: e1 } = await sb.auth.mfa.challenge({ factorId: enrol.id });
    if (e1 || !ch) { setMsg("No se pudo verificar."); return; }
    const { error } = await sb.auth.mfa.verify({ factorId: enrol.id, challengeId: ch.id, code: codigo.trim() });
    if (error) { setMsg("Código incorrecto. Inténtalo de nuevo."); return; }
    setEnrol(null); setCodigo(""); setMsg("¡Listo! La verificación en dos pasos quedó activa."); cargar();
  };

  const quitar = async (id: string) => {
    if (!confirm("Al quitarla, tu cuenta quedará protegida solo con la clave. ¿Seguro?")) return;
    const { error } = await crearClienteNavegador().auth.mfa.unenroll({ factorId: id });
    setMsg(error ? "No se pudo quitar. Vuelve a iniciar sesión e inténtalo." : "Verificación en dos pasos desactivada.");
    cargar();
  };

  return (
    <div className={`${tarjeta} space-y-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl uppercase leading-none">Verificación en dos pasos</h2>
          <p className="mt-1 text-sm text-muted-foreground">Además de la clave, te pide un código de 6 dígitos de una app (Google Authenticator, Microsoft Authenticator o Authy).</p>
        </div>
        <span className={`border px-3 py-1 text-xs uppercase ${verificados.length ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-primary text-primary"}`}>
          {verificados.length ? "Activa" : "Desactivada"}
        </span>
      </div>

      {!enrol && verificados.length === 0 && <button type="button" onClick={iniciar} className={boton}>Activar</button>}

      {enrol && (
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enrol.qr} alt="Código QR para la app de autenticación" className="h-44 w-44 bg-white p-2" />
          <div className="space-y-3">
            <p className="text-sm">1. Abre la app y escanea el QR.<br />2. Escribe aquí el código de 6 dígitos que aparece.</p>
            <p className="break-all text-xs text-muted-foreground">Si no puedes escanear, usa esta clave: {enrol.secreto}</p>
            <div className="flex gap-3">
              <input value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="000000" className={`${campo} max-w-40 tracking-[0.3em]`} />
              <button type="button" onClick={confirmar} disabled={codigo.length !== 6} className={boton}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {verificados.map((f) => (
        <div key={f.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
          <span>{f.friendly_name || "Aplicación de autenticación"}</span>
          <button type="button" onClick={() => quitar(f.id)} className={botonBorde}>Quitar</button>
        </div>
      ))}
      {msg && <p className="text-sm text-primary">{msg}</p>}
    </div>
  );
}
