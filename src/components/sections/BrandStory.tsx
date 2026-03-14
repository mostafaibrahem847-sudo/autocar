"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
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
    <section ref={sectionRef} className="relative w-full py-32 md:py-44 overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[140%] -top-[20%] bg-cover bg-center"
        style={{
          backgroundImage: `url(/images/brand-story-bg.webp)`,
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.76)_0%,rgba(10,10,10,0.72)_48%,rgba(10,10,10,0.82)_76%,rgba(10,10,10,0.96)_100%)]" />
      <div className="soft-edge-top" />
      <div className="soft-edge-bottom" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
          Our Story
        </p>
        <h2
          className="text-4xl md:text-6xl font-black leading-tight mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Born from a passion
          <br />
          for <span className="gradient-text">automobiles</span>
        </h2>
        <p className="text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto">
          Since 2009, Autocar has been more than a dealership - it&apos;s a destination
          for automotive enthusiasts. We believe every vehicle tells a story, and
          we&apos;re here to help you find yours. From first-time buyers to seasoned
          collectors, we provide an experience as premium as the cars we showcase.
        </p>
      </div>
    </section>
  );
}
