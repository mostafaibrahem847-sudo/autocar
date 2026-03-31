"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getUniqueBrands } from "@/data/cars";

const BRAND_ROW_SPEED = 72;
const FALLBACK_DURATION = 26;

const brandLogoMap: Record<string, string> = {
  Abarth: "/brands/abarth-3.svg",
  Acura: "/brands/acura-525.svg",
  "Alfa Romeo": "/brands/alfaromeo.svg",
  "Aston Martin": "/brands/aston-martin-1.svg",
  Audi: "/brands/audi-new-logo.svg",
  Bentley: "/brands/bentley.svg",
  BMW: "/brands/bmw-logo.svg",
  Buick: "/brands/buick-3.svg",
  BYD: "/brands/byd-auto-logo.svg",
  Hongqi: "/brands/chongqing-longxin.svg",
  Ferrari: "/brands/ferrari-emblem-1.svg",
  Honda: "/brands/honda-logo-4.svg",
  Infiniti: "/brands/infiniti-logo-1.svg",
  Jaguar: "/brands/jaguar-cars.svg",
  Kia: "/brands/kia-4.svg",
  Lamborghini: "/brands/lamborghini.svg",
  Lexus: "/brands/lexus.svg",
  Lincoln: "/brands/lincoln-4.svg",
  Maserati: "/brands/logo-della-maserati.svg",
  Mazda: "/brands/mazda-2.svg",
  "Mercedes-Benz": "/brands/mercedes-benz-9.svg",
  "Mercedes-Maybach": "/brands/maybach-logo.svg",
  MINI: "/brands/mini-logo-1.svg",
  Nissan: "/brands/nissan-6.svg",
  Pagani: "/brands/pagani-flat-emblem-.svg",
  Porsche: "/brands/logo-porsche2.svg",
  "Rolls-Royce": "/brands/rolls-royce.svg",
  Toyota: "/brands/toyota-7.svg",
  Volkswagen: "/brands/volkswagen-logo-2019.svg",
  Xiaomi: "/brands/xiaomi-3.svg",
};

function splitIntoRows(brands: string[], rowCount: number) {
  return Array.from({ length: rowCount }, (_, rowIndex) =>
    brands.filter((_, brandIndex) => brandIndex % rowCount === rowIndex)
  );
}

function getBrandMark(brand: string) {
  const specialMarks: Record<string, string> = {
    "Alfa Romeo": "AR",
    "Aston Martin": "AM",
    Audi: "AU",
    Abarth: "AB",
    Acura: "AC",
    Bentley: "B",
    BMW: "BMW",
    Buick: "BU",
    BYD: "BYD",
    Ferrari: "F",
    Honda: "H",
    Hongqi: "HQ",
    Infiniti: "IN",
    Jaguar: "J",
    Kia: "K",
    Lamborghini: "L",
    Lexus: "L",
    Lincoln: "LN",
    Maserati: "M",
    Mazda: "MZ",
    "Mercedes-Benz": "MB",
    "Mercedes-Maybach": "MM",
    MINI: "MN",
    Nissan: "N",
    Pagani: "P",
    Porsche: "P",
    "Rolls-Royce": "RR",
    Toyota: "T",
    Volkswagen: "VW",
    Xiaomi: "XM",
  };

  return specialMarks[brand] ?? brand.slice(0, 2).toUpperCase();
}

function BrandBadge({ brand, duplicate }: { brand: string; duplicate: "first" | "second" }) {
  const logoPath = brandLogoMap[brand];

  if (logoPath) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/22 bg-white/95 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        {/* PERFORMANCE FIX: Treat marque badges as small images and keep the
            duplicated marquee loop explicitly lazy so the hidden set defers. */}
        <Image
          src={logoPath}
          alt={`${brand} logo`}
          width={26}
          height={26}
          className="h-6 w-6 object-contain"
          sizes="(max-width: 768px) 50vw, 200px"
          loading={duplicate === "second" ? "lazy" : undefined}
        />
      </span>
    );
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/22 bg-primary/10 text-[0.72rem] font-bold tracking-[0.12em] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      {getBrandMark(brand)}
    </span>
  );
}

function BrandCard({ brand, rowIndex, duplicate }: { brand: string; rowIndex: number; duplicate: "first" | "second" }) {
  return (
    <article
      key={`${rowIndex}-${brand}-${duplicate}`}
      className="flex h-[5.5rem] md:h-24 min-w-[10.5rem] md:min-w-[12rem] items-center justify-center rounded-[1.75rem] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 text-center shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
    >
      <div className="flex items-center gap-3">
        <BrandBadge brand={brand} duplicate={duplicate} />
        <span
          className="text-base md:text-lg font-semibold tracking-[0.08em] text-foreground/86"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {brand}
        </span>
      </div>
    </article>
  );
}

export default function BrandsSection() {
  const brands = useMemo(() => getUniqueBrands(), []);
  const rows = useMemo(() => splitIntoRows(brands, 3), [brands]);
  const rowGroupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rowDurations, setRowDurations] = useState<number[]>(
    Array.from({ length: rows.length }, () => FALLBACK_DURATION)
  );

  useEffect(() => {
    const updateDurations = () => {
      const nextDurations = rows.map((_, rowIndex) => {
          const width = rowGroupRefs.current[rowIndex]?.offsetWidth ?? 0;
          return width > 0 ? width / BRAND_ROW_SPEED : FALLBACK_DURATION;
        });

      setRowDurations((currentDurations) => {
        if (
          currentDurations.length === nextDurations.length &&
          currentDurations.every((duration, index) => duration === nextDurations[index])
        ) {
          return currentDurations;
        }

        return nextDurations;
      });
    };

    updateDurations();

    if (typeof window === "undefined") {
      return;
    }

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateDurations) : null;

    rowGroupRefs.current.forEach((group) => {
      if (group) {
        resizeObserver?.observe(group);
      }
    });

    window.addEventListener("resize", updateDurations);

    return () => {
      window.removeEventListener("resize", updateDurations);
      resizeObserver?.disconnect();
    };
  }, [rows]);

  return (
    <section className="w-full py-20 md:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-primary text-xs md:text-sm font-medium tracking-[0.35em] uppercase mb-3">
            Brands
          </p>
          <h2
            className="text-2xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The Marques in Our Collection
          </h2>
        </div>

        <div className="space-y-4 md:space-y-5">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="brand-marquee-row">
              <div
                className={`brand-marquee-track ${rowIndex % 2 === 1 ? "brand-marquee-track-reverse" : ""}`}
                style={{ animationDuration: `${rowDurations[rowIndex] ?? FALLBACK_DURATION}s` }}
              >
                <div
                  ref={(element) => {
                    rowGroupRefs.current[rowIndex] = element;
                  }}
                  className="brand-marquee-group"
                >
                  {row.map((brand) => (
                    <BrandCard key={`${rowIndex}-${brand}-first`} brand={brand} rowIndex={rowIndex} duplicate="first" />
                  ))}
                </div>

                <div className="brand-marquee-group" aria-hidden="true">
                  {row.map((brand) => (
                    <BrandCard key={`${rowIndex}-${brand}-second`} brand={brand} rowIndex={rowIndex} duplicate="second" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
