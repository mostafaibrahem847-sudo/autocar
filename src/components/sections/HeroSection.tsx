"use client";

import { useEffect, useRef } from "react";
import { getAllCars, getFeaturedCars } from "@/data/cars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const featuredCars = getFeaturedCars();
  const tickerSource = [...featuredCars, ...getAllCars().slice(0, 12)]
    .filter((car, index, self) => self.findIndex((item) => item.id === car.id) === index)
    .slice(0, 9);
  const tickerColumns = [
    tickerSource.slice(0, 3),
    tickerSource.slice(3, 6),
    tickerSource.slice(6, 9),
  ];
  const heroRef = useRef<HTMLDivElement>(null);
  const lineOneRef = useRef<HTMLSpanElement>(null);
  const lineTwoRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startIntro: (() => void) | undefined;
    let removeLoaderListener: (() => void) | undefined;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
      let hasStarted = false;

      tl.set([lineOneRef.current, lineTwoRef.current], {
        width: 0,
        opacity: 1,
      })
        .fromTo(
          heroRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 }
        )
        .to(lineOneRef.current, {
          width: "100%",
          duration: 0.9,
          ease: "steps(12)",
          delay: 0.2,
        })
        .to(
          lineTwoRef.current,
          {
            width: "100%",
            duration: 1,
            ease: "steps(14)",
          },
          "-=0.05"
        )
        .fromTo(
          subRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.15"
        )
        .fromTo(
          actionsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.35"
        )
        .fromTo(
          statsRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          "-=0.25"
        )
        .fromTo(
          chipsRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          "-=0.3"
        )
        .fromTo(
          cardRef.current,
          { y: 34, scale: 0.92, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.85 },
          "-=0.75"
        );

      if (caretRef.current) {
        gsap.to(caretRef.current, {
          opacity: 0,
          duration: 0.55,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      startIntro = () => {
        if (hasStarted) {
          return;
        }

        hasStarted = true;
        tl.play(0);
      };

      if (typeof document !== "undefined" && document.body.classList.contains("site-loading-active")) {
        const onLoaderComplete = () => startIntro?.();
        window.addEventListener("site-loader:complete", onLoaderComplete, { once: true });
        removeLoaderListener = () => window.removeEventListener("site-loader:complete", onLoaderComplete);
      } else {
        startIntro();
      }
    }, heroRef);

    return () => {
      removeLoaderListener?.();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.08),_transparent_32%),linear-gradient(180deg,_#080808_0%,_#0b0b0b_48%,_#070707_100%)]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      <div className="soft-edge-top" />
      <div className="soft-edge-bottom" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.14),transparent_20%),radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_50%_75%,rgba(212,175,55,0.08),transparent_24%)]" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pt-28 pb-16">
        <div className="grid items-center gap-14 lg:gap-16 xl:gap-20 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)]">
          <div className="max-w-3xl text-center lg:text-left lg:pr-8 xl:pr-14">
            <h1
              className="mb-8 text-5xl sm:text-6xl md:text-7xl lg:text-[4.8rem] xl:text-[5.2rem] font-black leading-none tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="hero-type-line lg:mx-0 mx-auto">
                <span
                  ref={lineOneRef}
                  className="hero-type-text text-foreground"
                  style={{ opacity: 0 }}
                >
                  Curated Cars.
                </span>
              </span>
              <span className="hero-type-line lg:mx-0 mx-auto">
                <span
                  ref={lineTwoRef}
                  className="hero-type-text gradient-text"
                  style={{ opacity: 0 }}
                >
                  Immediate Desire
                </span>
                <span ref={caretRef} className="hero-type-caret" />
              </span>
            </h1>

            <p
              ref={subRef}
              className="text-lg md:text-xl text-foreground/68 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              style={{ opacity: 0 }}
            >
              Discover supercars, flagship sedans, luxury SUVs, and electric grand tourers in a
              collection designed to feel more like a private automotive gallery than a typical dealership.
            </p>

            <div
              ref={actionsRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
              style={{ opacity: 0 }}
            >
              <Button href="/cars" size="lg">
                Browse Inventory
              </Button>
              <Button href="/contact" size="lg" variant="outline">
                Book a Viewing
              </Button>
            </div>

            <div
              ref={statsRef}
              className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
              style={{ opacity: 0 }}
            >
              <div className="rounded-2xl border border-white/8 bg-black/22 px-5 py-4 backdrop-blur-sm">
                <p className="mb-1 text-2xl font-bold text-foreground">{featuredCars.length}+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/52">Featured Vehicles</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/22 px-5 py-4 backdrop-blur-sm">
                <p className="mb-1 text-2xl font-bold text-foreground">20+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/52">Prestige Brands</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/22 px-5 py-4 backdrop-blur-sm">
                <p className="mb-1 text-2xl font-bold text-foreground">24/7</p>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/52">Viewing Requests</p>
              </div>
            </div>

            <div
              ref={chipsRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
              style={{ opacity: 0 }}
            >
              {["Supercars", "Luxury Sedans", "Performance SUVs", "Electric GTs"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary/18 bg-primary/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground/72"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={cardRef}
            className="hero-ticker-viewport relative mx-auto w-full max-w-[34rem] xl:max-w-[37rem] lg:ml-auto"
            style={{ opacity: 0 }}
          >
            <div className="hero-ticker-stage">
              <div className="hero-ticker-grid">
                {tickerColumns.map((column, columnIndex) => (
                  <div
                    key={`ticker-col-${columnIndex}`}
                    className={`hero-ticker-column ${columnIndex === 1 ? "is-offset is-reverse" : ""} ${
                      columnIndex === 2 ? "is-offset-sm" : ""
                    }`}
                  >
                    <div className="hero-ticker-track">
                      {[...column, ...column].map((car, index) => {
                        const image = encodeURI(car.images[0]);

                        return (
                          <article
                            key={`${columnIndex}-${car.id}-${index}`}
                            className="hero-ticker-card"
                          >
                            <div
                              className="hero-ticker-card-media"
                              style={{ backgroundImage: `url("${image}")` }}
                            >
                              <div className="hero-ticker-card-overlay" />
                              <div className="hero-ticker-badge">{car.brand}</div>
                              <div className="hero-ticker-card-copy">
                                <div className="hero-ticker-card-meta">
                                  <span className="hero-ticker-dot" />
                                  <span>{car.type}</span>
                                </div>
                                <h3 className="hero-ticker-card-model">{car.model}</h3>
                                <div className="hero-ticker-card-tags">
                                  <span>{car.year}</span>
                                  <span>{car.fuelType}</span>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
