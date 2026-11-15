export function Chispas({ cantidad = 28 }: { cantidad?: number }) {
  const lista = Array.from({ length: cantidad }, (_, i) => ({
    izq: (i * 37) % 100,
    tam: 2 + ((i * 7) % 4),
    dur: 5 + ((i * 13) % 7),
    ret: (-((i * 9) % 90) / 10).toFixed(1),
    x: ((i * 53) % 90) - 45,
    color: i % 3 === 0 ? "var(--acento-2)" : "var(--primary)",
  }));

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {lista.map((p, i) => (
        <span
          key={i}
          className="chispa-p"
          style={
            {
              left: `${p.izq}%`,
              "--s": `${p.tam}px`,
              "--t": `${p.dur}s`,
              "--d": `${p.ret}s`,
              "--x": `${p.x}px`,
              "--c": p.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
