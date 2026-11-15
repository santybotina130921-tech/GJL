/** Convierte texto sencillo en contenido: "## " = subtítulo, "- " = lista. Nunca inserta HTML. */
export function ContenidoBlog({ texto }: { texto: string }) {
  const bloques = texto.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-lg leading-relaxed">
      {bloques.map((b, i) => {
        if (b.startsWith("## ")) {
          return <h2 key={i} className="mt-10 font-display text-4xl uppercase leading-none">{b.slice(3)}</h2>;
        }
        const lineas = b.split("\n");
        if (lineas.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6">
              {lineas.map((l, j) => (<li key={j}>{l.slice(2)}</li>))}
            </ul>
          );
        }
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}
