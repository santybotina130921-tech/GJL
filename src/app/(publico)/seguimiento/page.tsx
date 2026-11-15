import { EncabezadoPagina } from "@/components/publico/EncabezadoPagina";
import { FormularioCodigo } from "@/components/publico/seguimiento/FormularioCodigo";

export const metadata = { title: "Seguimiento de obra | JGL Estructural", robots: { index: false } };

export default function Seguimiento() {
  return (
    <>
      <EncabezadoPagina linea1="Sigue tu obra" linea2="paso a paso." texto="Escribe el código que te enviamos por WhatsApp para ver el avance, las etapas y las fotos de tu obra. No necesitas registrarte." />
      <section className="mx-auto max-w-6xl px-5 py-16">
        <FormularioCodigo />
      </section>
    </>
  );
}
