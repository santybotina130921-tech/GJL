// Se vuelve a montar en cada navegación: así cada página del panel entra con animación.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="entrar">{children}</div>;
}
