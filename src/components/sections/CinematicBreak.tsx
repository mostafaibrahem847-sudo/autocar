"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicBreak() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden py-20 md:py-28"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[20%] h-[140%] w-full bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/brand-story-bg.webp)",
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.6)_0%,rgba(10,10,10,0.4)_50%,rgba(10,10,10,0.7)_100%)]" />
      <div className="soft-edge-top" />
      <div className="soft-edge-bottom" />

      <ScrollReveal className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <p className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
          The Autocar Experience
        </p>
        <h2
          className="text-5xl font-black leading-[0.92] md:text-7xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="block text-foreground">Not just cars.</span>
          <span className="gradient-text block">Experiences.</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <Button href="/contact" size="lg">
            Book a Private Viewing
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
