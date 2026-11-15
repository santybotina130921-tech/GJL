import type { MetadataRoute } from "next";
import { getEntradas } from "@/lib/datos";
import { urlBase } from "@/lib/codigos";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = urlBase();
  const fijas = ["", "/nosotros", "/proyectos", "/servicios", "/catalogo", "/blog", "/cotizador", "/visita", "/contacto"];
  const entradas = await getEntradas();
  return [
    ...fijas.map((r) => ({ url: `${base}${r}`, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 })),
    ...entradas.map((e) => ({
      url: `${base}/blog/${e.slug}`,
      lastModified: e.publicada_en ?? undefined,
      priority: 0.6,
    })),
  ];
}
