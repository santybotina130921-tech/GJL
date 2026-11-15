export function TituloPanel({
  titulo,
  ayuda,
  children,
}: {
  titulo: string;
  ayuda?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="mb-3 block h-1 w-10 bg-primary" aria-hidden="true" />
        <h1 className="font-display text-5xl font-bold uppercase leading-none">{titulo}</h1>
        {ayuda && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{ayuda}</p>}
      </div>
      {children}
    </div>
  );
}
