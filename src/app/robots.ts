import type { MetadataRoute } from "next";
import { urlBase } from "@/lib/codigos";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/panel", "/login", "/seguimiento", "/cotizacion"] }],
    sitemap: `${urlBase()}/sitemap.xml`,
  };
}
