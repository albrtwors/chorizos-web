import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CurveTransition from "@/components/CurveTransition";
import AttributesScroll from "@/components/AttributesScroll";
import ProductShowcase from "@/components/ProductShowcase";
import FooterCTA from "@/components/FooterCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CurveTransition from="var(--ink)" to="var(--bone)" />
        <AttributesScroll />
        <CurveTransition
          from="var(--bone)"
          to="var(--sand)"
          variant="dip"
        />
        <ProductShowcase />
        <CurveTransition from="var(--sand)" to="var(--ink)" />
        <FooterCTA />
      </main>
    </>
  );
}
