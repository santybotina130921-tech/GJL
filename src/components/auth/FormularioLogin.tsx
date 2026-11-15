"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase/cliente";

const campo = "mt-2 w-full border border-border bg-background px-4 py-3 outline-none transition focus:border-primary";

export function FormularioLogin({ pedirCodigo = false }: { pedirCodigo?: boolean }) {
  const router = useRouter();
  const [paso, setPaso] = useState<"clave" | "codigo">(pedirCodigo ? "codigo" : "clave");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => { if (pedirCodigo) setPaso("codigo"); }, [pedirCodigo]);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const sb = crearClienteNavegador();
      const { error } = await sb.auth.signInWithPassword({ email: correo, password: clave });
      if (error) { setError("Correo o clave incorrectos."); return; }
      const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") { setPaso("codigo"); return; }
      router.push("/panel");
      router.refresh();
    } catch {
      setError("No se pudo conectar. Revisa las claves de Supabase en el archivo .env.");
    } finally {
      setCargando(false);
    }
  };

  const verificar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const sb = crearClienteNavegador();
      const { data } = await sb.auth.mfa.listFactors();
      const factor = data?.totp?.[0];
      if (!factor) { setError("No hay un método de verificación activo. Inicia sesión de nuevo."); return; }
      const { data: ch, error: e1 } = await sb.auth.mfa.challenge({ factorId: factor.id });
      if (e1 || !ch) { setError("No se pudo verificar. Inténtalo de nuevo."); return; }
      const { error: e2 } = await sb.auth.mfa.verify({ factorId: factor.id, challengeId: ch.id, code: codigo.trim() });
      if (e2) { setError("Código incorrecto."); return; }
      router.push("/panel");
      router.refresh();
    } catch {
      setError("No se pudo verificar. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  if (paso === "codigo") {
    return (
      <form onSubmit={verificar} className="mt-8 space-y-5">
        <p className="text-sm text-muted-foreground">Escribe el código de 6 dígitos de tu app de autenticación.</p>
        <label className="block text-sm text-muted-foreground">
          Código
          <input value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" autoFocus placeholder="000000" className={`${campo} tracking-[0.4em]`} />
        </label>
        {error && <p role="alert" className="text-sm text-primary">{error}</p>}
        <button type="submit" disabled={cargando || codigo.length !== 6} className="btn-jgl w-full justify-center disabled:opacity-60">
          {cargando ? "Verificando..." : "Verificar"} <span className="flecha" aria-hidden="true">→</span>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={entrar} className="mt-8 space-y-5">
      <label className="block text-sm text-muted-foreground">
        Correo
        <input type="email" required autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className={campo} />
      </label>
      <label className="block text-sm text-muted-foreground">
        Clave
        <input type="password" required autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} className={campo} />
      </label>
      {error && <p role="alert" className="text-sm text-primary">{error}</p>}
      <button type="submit" disabled={cargando} className="btn-jgl w-full justify-center disabled:opacity-60">
        {cargando ? "Entrando..." : "Entrar"} <span className="flecha" aria-hidden="true">→</span>
      </button>
    </form>
  );
}
