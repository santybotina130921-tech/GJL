import { getAjustes } from "@/lib/datos";
import { crearEnlaceWhatsApp } from "@/lib/whatsapp";

export async function BotonWhatsApp() {
  const a = await getAjustes();
  return (
    <a
      href={crearEnlaceWhatsApp(a.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="anillo fixed right-5 z-30 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
    >
      WhatsApp
    </a>
  );
}
