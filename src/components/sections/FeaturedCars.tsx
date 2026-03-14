"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedCars } from "@/data/cars";
import TransitionLink from "@/components/ui/TransitionLink";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedCars() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const featured = getFeaturedCars();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = railRef.current?.querySelectorAll("[data-feature-card]");
      if (!cards?.length) return;

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    const firstSet = firstSetRef.current;

    if (!rail || !firstSet || typeof window === "undefined") {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      return;
    }

    let frameId = 0;
    let previousTime = performance.now();

    const tick = (currentTime: number) => {
      const elapsed = currentTime - previousTime;
      previousTime = currentTime;

      if (!isPaused) {
        rail.scrollLeft += elapsed * 0.045;

        const loopWidth = firstSet.offsetWidth;
        if (loopWidth > 0 && rail.scrollLeft >= loopWidth) {
          rail.scrollLeft -= loopWidth;
        }
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused]);

  const renderCard = (setKey: string, carId: number) => {
    const car = featured.find((item) => item.id === carId);
    if (!car) return null;

    const isActive = activeId === car.id;
    const imageUrl = encodeURI(car.images[0]);

    return (
      <TransitionLink
        key={`${setKey}-${car.id}`}
        href={`/cars/${car.slug}`}
        data-feature-card
        className="group shrink-0 snap-start transition-[width,transform,opacity] duration-500 ease-out"
        onMouseEnter={() => setActiveId(car.id)}
        onFocus={() => setActiveId(car.id)}
        onBlur={() => setActiveId(null)}
        style={{
          width: isActive ? "min(24rem, 78vw)" : "min(18rem, 72vw)",
        }}
      >
        <article
          className={`relative overflow-hidden rounded-[2rem] border border-border bg-surface-light transition-all duration-500 ease-out ${
            isActive
              ? "translate-y-[-0.65rem] border-primary/35 shadow-[0_32px_90px_rgba(0,0,0,0.4)]"
              : "opacity-90 hover:opacity-100"
          }`}
          style={{ height: isActive ? "37.5rem" : "35rem" }}
        >
          <div className="absolute inset-0">
            <div
              className={`h-full w-full bg-cover bg-center transition-transform duration-700 ${
                isActive ? "scale-105" : "scale-100 group-hover:scale-105"
              }`}
              style={{ backgroundImage: `url("${imageUrl}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-background/95" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/90 to-transparent" />
          </div>

          <div className="relative flex h-full flex-col justify-between p-6">
            <div className="flex justify-end">
              <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-background">
                Featured
              </span>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.18em] text-primary uppercase">
                {car.brand}
              </p>
              <h3 className="mb-3 text-[1.9rem] font-bold leading-none text-foreground">
                {car.model}
              </h3>
              <p className="mb-5 text-[1.05rem] text-foreground/70">{car.type}</p>

              <div className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground/60">
                <span>{car.year}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/35" />
                <span>{car.type}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/35" />
                <span>{car.fuelType}</span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <p className="max-w-[10rem] text-[1.05rem] font-bold leading-tight text-foreground">
                  {car.priceLabel}
                </p>
                <span
                  className={`text-xs font-medium tracking-[0.18em] uppercase text-primary transition-all duration-300 ${
                    isActive
                      ? "translate-x-0 opacity-100"
                      : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  View
                </span>
              </div>
            </div>
          </div>
        </article>
      </TransitionLink>
    );
  };

  return (
    <section ref={sectionRef} className="w-full py-24 md:py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-[1500px] px-6">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            Curated Selection
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Featured Vehicles
          </h2>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />

          <div
            ref={railRef}
            className="overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setActiveId(null);
            }}
          >
            <div className="flex w-max items-end">
              <div ref={firstSetRef} className="flex items-end gap-5 pr-5">
                {featured.map((car) => renderCard("first", car.id))}
              </div>
              <div className="flex items-end gap-5">
                {featured.map((car) => renderCard("second", car.id))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
