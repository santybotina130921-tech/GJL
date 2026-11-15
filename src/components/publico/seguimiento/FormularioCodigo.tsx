"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FormularioCodigo() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");

  const ir = (e: React.FormEvent) => {
    e.preventDefault();
    const c = codigo.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (c) router.push(`/seguimiento/${c}`);
  };

  return (
    <form onSubmit={ir} className="flex max-w-lg flex-col gap-3 sm:flex-row">
      <input
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Ej. JGL-7K3QXM9D"
        aria-label="Código de tu obra"
        autoComplete="off"
        className="w-full border border-border bg-background px-4 py-3 uppercase outline-none transition focus:border-primary"
      />
      <button type="submit" className="btn-jgl justify-center">
        Consultar <span className="flecha" aria-hidden="true">→</span>
      </button>
    </form>
  );
}
