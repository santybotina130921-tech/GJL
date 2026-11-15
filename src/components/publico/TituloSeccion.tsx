export function TituloSeccion({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <span className="mb-4 block h-1 w-14 bg-primary" aria-hidden="true" />
      <h2 className="font-display text-4xl font-semibold uppercase leading-none sm:text-6xl">
        {children}
      </h2>
    </div>
  );
}
