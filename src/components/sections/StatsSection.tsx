"use client";

import { CSSProperties, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/animations/ScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: 150, suffix: "+", label: "Cars in Showroom" },
  { value: 30, suffix: "+", label: "Global Brands" },
  { value: 15, suffix: "", label: "Years of Experience" },
  { value: 1000, suffix: "+", label: "Satisfied Clients" },
];

const gradientNumberStyle: CSSProperties = {
  backgroundImage: "var(--gradient-text)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      stats.forEach((stat, index) => {
        const element = numberRefs.current[index];

        if (!element) {
          return;
        }

        const counter = { value: 0 };

        timeline.to(
          counter,
          {
            value: stat.value,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              element.textContent = `${Math.round(counter.value)}${stat.suffix}`;
            },
          },
          0
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-background py-24 md:py-32">
      <ScrollReveal className="mx-auto max-w-7xl px-6">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-[2rem] border border-white/7 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-10 md:px-10 md:py-14 shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
        >
          <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0">
            {stats.map((stat, index) => {
              const showMobileDivider = index % 2 === 0;
              const showDesktopDivider = index < stats.length - 1;

              return (
                <div
                  key={stat.label}
                  className="relative flex min-h-[12rem] flex-col items-center justify-center px-4 text-center md:px-6"
                >
                  {showMobileDivider ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-1/2 h-20 -translate-y-1/2 border-r border-border opacity-30 lg:hidden"
                    />
                  ) : null}
                  {showDesktopDivider ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-1/2 hidden h-24 -translate-y-1/2 border-r border-border opacity-30 lg:block"
                    />
                  ) : null}

                  <span
                    ref={(element) => {
                      numberRefs.current[index] = element;
                    }}
                    className="text-7xl font-black leading-none tracking-[-0.08em] tabular-nums sm:text-8xl xl:text-[6.8rem]"
                    style={{
                      ...gradientNumberStyle,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    0{stat.suffix}
                  </span>
                  <p className="mt-4 text-[0.7rem] font-medium tracking-[0.34em] text-foreground/58 uppercase sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
