"use client";

import { getUniqueBrands } from "@/data/cars";

interface CarFilterProps {
  onFilter: (brand: string) => void;
  activeFilter: string;
  className?: string;
}

export default function CarFilter({
  onFilter,
  activeFilter,
  className = "",
}: CarFilterProps) {
  const brands = getUniqueBrands();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <button
        onClick={() => onFilter("All")}
        className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
          activeFilter === "All"
            ? "bg-primary text-background"
            : "bg-surface-light text-foreground/70 border border-border hover:border-primary/30 hover:text-primary"
        }`}
      >
        All
      </button>
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onFilter(brand)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
            activeFilter === brand
              ? "bg-primary text-background"
              : "bg-surface-light text-foreground/70 border border-border hover:border-primary/30 hover:text-primary"
          }`}
        >
          {brand}
        </button>
      ))}
    </div>
  );
}
