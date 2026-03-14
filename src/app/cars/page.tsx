"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { getAllCars } from "@/data/cars";
import CarCard from "@/components/ui/CarCard";
import CarFilter from "@/components/ui/CarFilter";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TransitionLink from "@/components/ui/TransitionLink";

export default function CarsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const allCars = getAllCars();
  const listingsRef = useRef<HTMLDivElement>(null);

  const filteredCars = useMemo(
    () =>
      activeFilter === "All"
        ? allCars
        : allCars.filter((car) => car.brand === activeFilter),
    [activeFilter, allCars]
  );

  const handleFilter = (brand: string) => {
    setActiveFilter(brand);
  };

  useEffect(() => {
    if (!listingsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        listingsRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        }
      );

      const items = listingsRef.current?.querySelectorAll("[data-car-item]");

      if (items?.length) {
        gsap.fromTo(
          items,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          }
        );
      }
    }, listingsRef);

    return () => ctx.revert();
  }, [filteredCars, viewMode]);

  const handleViewModeChange = (nextMode: "grid" | "list") => {
    if (nextMode === viewMode || !listingsRef.current) {
      return;
    }

    gsap.killTweensOf(listingsRef.current);
    gsap.to(listingsRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setViewMode(nextMode),
    });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        {/* Header */}
        <ScrollReveal className="mb-12">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            Our Inventory
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-4"
              style={{ fontFamily: "var(--font-heading)" }}>
            All Vehicles
          </h1>
          <p className="text-foreground/50 text-lg max-w-xl">
            Explore our complete collection of premium cars. Filter by brand to find
            your perfect match.
          </p>
        </ScrollReveal>

        {/* Filter */}
        <div className="mb-10 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <CarFilter onFilter={handleFilter} activeFilter={activeFilter} className="mb-0" />

          <div className="flex items-center gap-3 self-start rounded-full border border-white/8 bg-surface-light/70 p-1.5">
            <button
              type="button"
              onClick={() => handleViewModeChange("grid")}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                viewMode === "grid"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border text-foreground/40 hover:border-primary/20 hover:text-foreground/70"
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleViewModeChange("list")}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                viewMode === "list"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border text-foreground/40 hover:border-primary/20 hover:text-foreground/70"
              }`}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="4" y="5" width="3.5" height="3.5" rx="0.8" />
                <rect x="4" y="10.25" width="3.5" height="3.5" rx="0.8" />
                <rect x="4" y="15.5" width="3.5" height="3.5" rx="0.8" />
                <path strokeLinecap="round" d="M10.5 6.75H20" />
                <path strokeLinecap="round" d="M10.5 12H20" />
                <path strokeLinecap="round" d="M10.5 17.25H20" />
              </svg>
            </button>
          </div>
        </div>

        {/* Listings */}
        <div ref={listingsRef}>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCars.map((car) => (
                <div key={car.id} data-car-item>
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredCars.map((car) => {
                const imageUrl = encodeURI(car.images[0]);

                return (
                  <article
                    key={car.id}
                    data-car-item
                    className="overflow-hidden rounded-2xl border border-border bg-surface-light"
                  >
                    <div className="flex h-[180px] flex-col md:flex-row">
                      <div className="h-full w-full md:w-64">
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url("${imageUrl}")` }}
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <p className="mb-2 text-xs font-medium tracking-widest text-primary uppercase">
                            {car.brand}
                          </p>
                          <h2
                            className="mb-3 text-2xl font-bold text-foreground"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {car.model}
                          </h2>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground/60">
                            <span>{car.type}</span>
                            <span className="h-1 w-1 rounded-full bg-muted" />
                            <span>{car.year}</span>
                            <span className="h-1 w-1 rounded-full bg-muted" />
                            <span>{car.fuelType}</span>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p
                            className="text-lg font-bold text-foreground"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {car.priceLabel}
                          </p>
                          <TransitionLink
                            href={`/cars/${car.slug}`}
                            className="inline-flex items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-medium tracking-wide text-primary transition-all duration-300 hover:bg-primary hover:text-background"
                          >
                            View Details
                          </TransitionLink>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No vehicles found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
