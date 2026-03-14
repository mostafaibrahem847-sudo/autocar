import ScrollReveal from "@/components/animations/ScrollReveal";
import TeamSection from "@/components/sections/TeamSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Autocar",
  description: "Learn about Autocar's story, mission, and commitment to automotive excellence.",
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/about-hero.webp)` }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-black"
              style={{ fontFamily: "var(--font-heading)" }}>
            About Autocar
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="w-full py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
              <div>
                <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
                  Since 2009
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ fontFamily: "var(--font-heading)" }}>
                  Our Journey
                </h2>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  Autocar was founded with a simple yet bold vision: to redefine the car
                  buying experience. What began as a small showroom has grown into one of
                  the most trusted names in premium automotive retail.
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  Over 15 years and thousands of satisfied customers later, we continue to
                  set new standards for quality, transparency, and customer service in the
                  automotive industry.
                </p>
              </div>
              <div className="h-80 rounded-2xl bg-surface-light overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(/images/about-story.webp)` }}
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Mission & Values */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
                What Drives Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}>
                Mission &amp; Values
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              {
                title: "Excellence",
                description:
                  "We pursue excellence in every vehicle we showcase and every interaction with our customers.",
              },
              {
                title: "Integrity",
                description:
                  "Transparent pricing, honest assessments, and a commitment to doing right by every customer.",
              },
              {
                title: "Passion",
                description:
                  "We are genuine enthusiasts who understand the emotional connection between a driver and their car.",
              },
            ].map((value, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="p-8 rounded-2xl bg-surface-light border border-border text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 text-xl font-bold"
                       style={{ fontFamily: "var(--font-heading)" }}>
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <TeamSection />

          {/* Brand Philosophy */}
          <ScrollReveal>
            <div className="rounded-2xl bg-surface p-12 md:p-16 border border-border text-center">
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
                Philosophy
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 max-w-2xl mx-auto leading-relaxed"
                  style={{ fontFamily: "var(--font-heading)" }}>
                &ldquo;A car is more than transportation — it&apos;s an expression of who you are.&rdquo;
              </h2>
              <p className="text-foreground/50 max-w-xl mx-auto leading-relaxed">
                At Autocar, we believe every vehicle in our collection carries a story
                waiting to become part of yours. That&apos;s why we curate only the finest
                automobiles for the most discerning drivers.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
