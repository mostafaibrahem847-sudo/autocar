import HeroSection from "@/components/sections/HeroSection";
import ScrollDepthShowcase from "@/components/sections/ScrollDepthShowcase";
import FeaturedCars from "@/components/sections/FeaturedCars";
import BrandsSection from "@/components/sections/BrandsSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollDepthShowcase />
      <div className="section-divider" />
      <BrandsSection />
      <div className="section-divider" />
      <WhyChooseUs />
      <div className="section-divider" />
      <StatsSection />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <CTASection />
      <div className="section-divider" />
      <FeaturedCars />
    </>
  );
}
