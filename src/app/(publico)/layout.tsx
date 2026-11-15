import { BarraProgreso } from "@/components/publico/BarraProgreso";
import { Navbar } from "@/components/publico/Navbar";
import { Footer } from "@/components/publico/Footer";
import { RedesFlotantes } from "@/components/publico/RedesFlotantes";

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraProgreso />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <RedesFlotantes />
    </>
  );
}
