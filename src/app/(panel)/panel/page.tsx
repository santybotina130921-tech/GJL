import Link from "next/link";
import { exigirAdmin } from "@/lib/panel/auth";
import { Contador } from "@/components/publico/Contador";
import { Icono, type IconoNombre } from "@/components/panel/iconos";
import { TarjetaBrillo } from "@/components/panel/TarjetaBrillo";
import { formatoCOP } from "@/lib/documentos/letras";

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export default async function Resumen() {
  const { sb, user } = await exigirAdmin();

  const contar = async (tabla: string, col?: string, val?: string) => {
    let q = sb.from(tabla).select("*", { count: "exact", head: true });
    if (col && val) q = q.eq(col, val);
    return (await q).count ?? 0;
  };
  const desde = new Date();
  desde.setDate(desde.getDate() - 6);
  desde.setHours(0, 0, 0, 0);

  const [nuevos, publicados, borradores, cobros, cots, conFoto, fondos, testimonios, semana, recientes, ultimos] =
    await Promise.all([
      contar("cotizaciones", "estado", "nueva"),
      contar("proyectos", "estado", "publicado"),
      contar("proyectos", "estado", "borrador"),
      contar("documentos", "tipo", "cuenta_cobro"),
      contar("documentos", "tipo", "cotizacion"),
      sb.from("diapositivas").select("*", { count: "exact", head: true }).not("imagen_url", "is", null).neq("imagen_url", "").then((r) => r.count ?? 0),
      sb.from("ajustes").select("*", { count: "exact", head: true }).like("clave", "fondo_%").neq("valor", "").then((r) => r.count ?? 0),
      contar("testimonios"),
      sb.from("cotizaciones").select("creado_en").gte("creado_en", desde.toISOString()).then((r) => r.data ?? []),
      sb.from("cotizaciones").select("id,nombre,tipo_trabajo,estado,creado_en").order("creado_en", { ascending: false }).limit(5).then((r) => r.data ?? []),
      sb.from("documentos").select("id,tipo,numero,cliente,total").order("creado_en", { ascending: false }).limit(4).then((r) => r.data ?? []),
    ]);

  // Finanzas del mes y portada del panel
  const mesActual = new Date().toISOString().slice(0, 7);
  const [{ data: movMes }, { data: pendientes }, { data: ajPanel }] = await Promise.all([
    sb.from("movimientos").select("tipo,monto").gte("fecha", `${mesActual}-01`),
    sb.from("documentos").select("total").eq("tipo", "cuenta_cobro").eq("estado", "pendiente"),
    sb.from("ajustes").select("valor").eq("clave", "panel_banner"),
  ]);
  const balanceMes = (movMes ?? []).reduce((a, m) => a + (m.tipo === "ingreso" ? 1 : -1) * Number(m.monto), 0);
  const porCobrar = (pendientes ?? []).reduce((a, d) => a + Number(d.total), 0);
  const banner = ajPanel?.[0]?.valor ?? "";

  // Mensajes de los últimos 7 días
  const barras = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(desde);
    d.setDate(desde.getDate() + i);
    const n = semana.filter((m) => new Date(m.creado_en).toDateString() === d.toDateString()).length;
    return { dia: DIAS[d.getDay()], n };
  });
  const max = Math.max(1, ...barras.map((b) => b.n));
  const totalSemana = barras.reduce((a, b) => a + b.n, 0);

  // Primeros pasos
  const pasos = [
    { t: "Publicar tu primer proyecto", ok: publicados > 0, href: "/panel/proyectos/nuevo" },
    { t: "Subir fotos al carrusel del inicio", ok: conFoto > 0, href: "/panel/contenido/diapositivas" },
    { t: "Poner fotos de fondo", ok: fondos > 0, href: "/panel/fondos" },
    { t: "Agregar un testimonio", ok: testimonios > 0, href: "/panel/contenido/testimonios" },
    { t: "Crear tu primer documento", ok: cobros + cots > 0, href: "/panel/documentos/nuevo" },
  ];
  const hechos = pasos.filter((p) => p.ok).length;
  const prog = hechos / pasos.length;
  const C = 2 * Math.PI * 38;

  const hora = Number(new Intl.DateTimeFormat("es-CO", { hour: "numeric", hour12: false, timeZone: "America/Bogota" }).format(new Date()));
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const nombre = (user.email ?? "").split("@")[0];

  const kpis: { t: string; n: number; href: string; icono: IconoNombre; moneda?: boolean }[] = [
    { t: "Mensajes nuevos", n: nuevos, href: "/panel/mensajes", icono: "mensajes" },
    { t: "Proyectos publicados", n: publicados, href: "/panel/proyectos", icono: "proyectos" },
    { t: "Balance del mes", n: balanceMes, href: "/panel/finanzas", icono: "finanzas", moneda: true },
    { t: "Por cobrar", n: porCobrar, href: "/panel/finanzas", icono: "documentos", moneda: true },
  ];
  const atajos: { t: string; d: string; href: string; icono: IconoNombre }[] = [
    { t: "Nuevo proyecto", d: "Sube fotos y publícalo", href: "/panel/proyectos/nuevo", icono: "proyectos" },
    { t: "Nuevo documento", d: "Cuenta de cobro o cotización", href: "/panel/documentos/nuevo", icono: "documentos" },
    { t: "Colores y fondos", d: "Cambia el look de la página", href: "/panel/fondos", icono: "apariencia" },
    { t: "Servicios", d: "Edita lo que ofreces", href: "/panel/contenido/servicios", icono: "servicios" },
  ];

  return (
    <div className="space-y-10">
      <div className="relative isolate flex flex-wrap items-end justify-between gap-4 overflow-hidden border border-border p-6">
        {banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/70 to-background/30" aria-hidden="true" />
        <div>
          <p className="text-sm text-muted-foreground">{saludo},</p>
          <h1 className="font-display text-6xl font-bold uppercase leading-none">
            <span className="text-primary">{nombre}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Todo lo que cambies aquí se actualiza en la página pública.</p>
        </div>
        <Link href="/panel/proyectos/nuevo" className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_var(--primary)] active:scale-95">
          <Icono nombre="mas" className="h-4 w-4" /> Nuevo proyecto
        </Link>
      </div>

      {publicados === 0 && (
        <div className="border border-primary/50 bg-primary/10 p-4 text-sm">
          Todavía no hay proyectos publicados, así que la página muestra proyectos de ejemplo.{" "}
          <Link href="/panel/proyectos/nuevo" className="font-semibold text-primary underline">Crear el primero</Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <TarjetaBrillo key={k.t} href={k.href} className="p-5">
            <div className="flex items-start justify-between">
              <Icono nombre={k.icono} className="h-6 w-6 text-primary" />
              <Icono nombre="flecha" className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className={`mt-5 break-words font-display leading-none ${k.moneda ? "text-4xl" : "text-6xl"}`}>{k.moneda ? formatoCOP(k.n) : <Contador hasta={k.n} prefijo="" />}</p>
            <p className="mt-1 text-sm text-muted-foreground">{k.t}</p>
          </TarjetaBrillo>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="border border-border bg-card/90 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase">Solicitudes de la semana</h2>
              <p className="text-sm text-muted-foreground">{totalSemana} en los últimos 7 días</p>
            </div>
          </div>
          <div className="mt-6 flex h-44 items-end gap-3">
            {barras.map((b, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${b.n} solicitudes`}>
                <span className="text-xs text-muted-foreground">{b.n}</span>
                <div
                  className="barra w-full bg-gradient-to-t from-primary/40 to-primary"
                  style={{ height: `${Math.max(6, (b.n / max) * 100)}%`, animationDelay: `${i * 90}ms` }}
                />
                <span className="text-xs uppercase text-muted-foreground">{b.dia}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border bg-card/90 p-6">
          <div className="flex items-center gap-5">
            <svg viewBox="0 0 90 90" className="anillo-progreso h-24 w-24 shrink-0 -rotate-90" aria-hidden="true">
              <circle cx="45" cy="45" r="38" fill="none" stroke="var(--border)" strokeWidth="7" />
              <circle
                className="v"
                cx="45" cy="45" r="38" fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round"
                style={{ "--c": C, "--off": C * (1 - prog) } as React.CSSProperties}
              />
            </svg>
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase leading-none">Primeros pasos</h2>
              <p className="mt-1 text-sm text-muted-foreground">{hechos} de {pasos.length} listos</p>
            </div>
          </div>
          <ul className="mt-5 space-y-1">
            {pasos.map((p) => (
              <li key={p.t}>
                <Link href={p.href} className="group flex items-center gap-3 px-2 py-2 text-sm transition hover:bg-background">
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${p.ok ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {p.ok && <Icono nombre="check" className="h-3 w-3" />}
                  </span>
                  <span className={p.ok ? "text-muted-foreground line-through" : ""}>{p.t}</span>
                  <Icono nombre="flecha" className="ml-auto h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold uppercase">Atajos</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {atajos.map((a) => (
            <TarjetaBrillo key={a.t} href={a.href} className="flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center border border-border bg-background text-primary">
                <Icono nombre={a.icono} className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-semibold">{a.t}</span>
                <span className="text-sm text-muted-foreground">{a.d}</span>
              </span>
            </TarjetaBrillo>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border border-border bg-card/90 p-6">
          <h2 className="mb-4 font-display text-2xl font-semibold uppercase">Últimos mensajes</h2>
          {recientes.length === 0 && <p className="text-sm text-muted-foreground">Aún no han llegado solicitudes.</p>}
          <ul className="relative space-y-4 border-l border-border pl-5">
            {recientes.map((m) => (
              <li key={m.id} className="relative">
                <span className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full ${m.estado === "nueva" ? "punto-vivo bg-primary" : "bg-border"}`} />
                <p className="text-sm"><b>{m.nombre}</b> <span className="text-muted-foreground">· {m.tipo_trabajo}</span></p>
                <p className="text-xs text-muted-foreground">{new Date(m.creado_en).toLocaleString("es-CO")} · {m.estado}</p>
              </li>
            ))}
          </ul>
          <Link href="/panel/mensajes" className="mt-4 inline-block text-sm text-primary hover:underline">Ver todos →</Link>
        </section>

        <section className="border border-border bg-card/90 p-6">
          <h2 className="mb-4 font-display text-2xl font-semibold uppercase">Últimos documentos</h2>
          {ultimos.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay documentos.</p>}
          <ul className="divide-y divide-border">
            {ultimos.map((d) => (
              <li key={d.id}>
                <Link href={`/panel/documentos/${d.id}`} className="flex items-center justify-between gap-3 py-3 text-sm transition hover:text-primary">
                  <span>{d.tipo === "cotizacion" ? "Cotización" : "Cuenta de cobro"} {String(d.numero).padStart(3, "0")} · {d.cliente}</span>
                  <span className="shrink-0 font-semibold">{formatoCOP(Number(d.total))}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/panel/documentos/nuevo" className="mt-4 inline-block text-sm text-primary hover:underline">Crear documento →</Link>
        </section>
      </div>
    </div>
  );
}
