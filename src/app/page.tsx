import ScrollVideoPlayer from "@/components/ScrollVideoPlayer";
import HeroSection from "@/components/sections/HeroSection";
import ScrollDepthShowcase from "@/components/sections/ScrollDepthShowcase";
import FeaturedCars from "@/components/sections/FeaturedCars";
import BrandsSection from "@/components/sections/BrandsSection";
import CTASection from "@/components/sections/CTASection";
import ScrollRevealVideo from "@/components/sections/ScrollRevealVideo";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { AetherFlowBackground } from "@/components/ui/aether-flow-hero";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollDepthShowcase />
      <ScrollVideoPlayer sequenceBasePath="/video/porsche-sequence" frameCount={192} />
      <div className="section-divider" />
      <BrandsSection />
      <div className="section-divider" />
      <ScrollRevealVideo videoSrc="/video/Car_moving_through_202603271752.mp4" />
      <div className="section-divider" />
      <section className="relative overflow-hidden bg-background">
        <AetherFlowBackground
          className="opacity-70"
          density={104}
          distribution="edges"
          mouseEnabled={false}
          particleColor="rgba(212, 175, 55, 0.5)"
          connectionColor="rgba(212, 175, 55, 0.15)"
          hoverConnectionColor="rgba(255, 248, 230, 0.32)"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.03),transparent_18%),radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_22%),linear-gradient(180deg,rgba(10,10,10,0.2)_0%,rgba(10,10,10,0.08)_20%,rgba(10,10,10,0.08)_80%,rgba(10,10,10,0.24)_100%)]" />
        <TestimonialsSection />
        <div className="pointer-events-none relative z-10 mx-auto h-10 max-w-5xl bg-[radial-gradient(circle_at_center,rgba(232,200,74,0.06),transparent_72%)] blur-3xl md:h-12" />
        <CTASection />
      </section>
      <div className="section-divider" />
      <FeaturedCars />
    </>
  );
}
