import Link from "next/link";
import { EncabezadoPagina } from "@/components/publico/EncabezadoPagina";
import { GridCatalogo } from "@/components/publico/catalogo/GridCatalogo";
import { getAjustes, getProductos } from "@/lib/datos";

export const metadata = { title: "Catálogo | JGL Estructural" };
export const revalidate = 60;

export default async function Catalogo() {
  const [productos, a] = await Promise.all([getProductos(), getAjustes()]);
  return (
    <>
      <EncabezadoPagina linea1="Productos" linea2="a tu medida." texto="Portones, barandas, escaleras y más. Elige un modelo y te cotizamos con las medidas de tu espacio." />
      <section className="mx-auto max-w-6xl px-5 py-16">
        {productos.length > 0 ? (
          <>
            <GridCatalogo productos={productos} whatsapp={a.whatsapp} />
            <p className="mt-10 border-l-[3px] border-primary pl-4 text-sm text-muted-foreground">
              Los precios son aproximados y de referencia. El valor final depende de las medidas, los materiales y la visita técnica. Las imágenes son ilustrativas.
            </p>
          </>
        ) : (
          <div className="border border-border bg-card p-8">
            <p className="text-muted-foreground">Estamos preparando el catálogo. Cuéntanos qué necesitas y te lo fabricamos.</p>
            <Link href="/contacto" className="btn-jgl mt-6">Escribirnos <span className="flecha" aria-hidden="true">→</span></Link>
          </div>
        )}
      </section>
    </>
  );
}
