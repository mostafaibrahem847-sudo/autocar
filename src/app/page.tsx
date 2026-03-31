import ScrollVideoPlayer from "@/components/ScrollVideoPlayer";
import HeroSection from "@/components/sections/HeroSection";
import ScrollDepthShowcase from "@/components/sections/ScrollDepthShowcase";
import FeaturedCars from "@/components/sections/FeaturedCars";
import BrandsSection from "@/components/sections/BrandsSection";
import CTASection from "@/components/sections/CTASection";
import ScrollRevealVideo from "@/components/sections/ScrollRevealVideo";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import Button from "@/components/ui/Button";
import { AetherFlowBackground } from "@/components/ui/aether-flow-hero";

function MobileQuickSection() {
  const highlights = [
    { value: "56+", label: "Vehicles Ready" },
    { value: "30+", label: "Premium Brands" },
    { value: "24/7", label: "Viewing Requests" },
  ];

  const categories = ["Supercars", "Luxury Sedans", "SUVs", "Electric GTs"];

  return (
    <section className="bg-background px-6 py-10 md:hidden">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
        <p className="mb-3 text-xs font-medium tracking-[0.34em] text-primary uppercase">
          Mobile Access
        </p>
        <h2
          className="mb-4 text-3xl font-black leading-tight text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Browse faster on mobile
        </h2>
        <p className="text-sm leading-7 text-foreground/62">
          We kept the mobile experience lighter here so visitors can jump straight to the
          inventory, book a viewing, and scan the key categories without the heavier desktop
          showcase sections.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-center"
            >
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="mt-1 text-[0.68rem] tracking-[0.24em] text-foreground/48 uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-primary/18 bg-primary/8 px-3 py-2 text-[0.68rem] font-medium tracking-[0.18em] text-foreground/74 uppercase"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button href="/cars" className="w-full">
            Browse Inventory
          </Button>
          <Button href="/contact" variant="outline" className="w-full">
            Book a Viewing
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <MobileQuickSection />

      <div className="hidden md:block">
        <ScrollDepthShowcase />
        <ScrollVideoPlayer sequenceBasePath="/video/porsche-sequence" frameCount={192} />
        <div className="section-divider" />
      </div>

      <BrandsSection />

      <div>
        <div className="section-divider" />
        <ScrollRevealVideo videoSrc="/video/Car_moving_through_202603271752.mp4" />
        <div className="section-divider" />
      </div>

      <section className="relative overflow-hidden bg-background md:hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,0.08),transparent_24%),linear-gradient(180deg,rgba(10,10,10,0.18)_0%,rgba(10,10,10,0.08)_26%,rgba(10,10,10,0.22)_100%)]" />
        <TestimonialsSection />
        <CTASection />
      </section>

      <section className="relative hidden overflow-hidden bg-background md:block">
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
