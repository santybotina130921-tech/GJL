import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variante?: "solido" | "borde" | "oscuro";
  externo?: boolean;
  className?: string;
};

export function Boton({ href, children, variante = "solido", externo, className = "" }: Props) {
  const extra =
    variante === "borde" ? "btn-jgl-o" : variante === "oscuro" ? "btn-jgl-d" : "";
  const clases = `btn-jgl ${extra} ${className}`;
  const contenido = (
    <>
      {children}
      <span className="flecha" aria-hidden="true">→</span>
    </>
  );
  return externo ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={clases}>
      {contenido}
    </a>
  ) : (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  );
}
