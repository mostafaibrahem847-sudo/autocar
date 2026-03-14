export interface Car {
  id: number;
  slug: string;
  model: string;
  brand: string;
  type: string;
  year: number;
  priceLabel: string;
  condition: string;
  transmission: string;
  fuelType: string;
  powertrain: string;
  description: string;
  images: string[];
  featured: boolean;
}

interface CarSeed {
  brand: string;
  model: string;
  type: string;
  image: string;
  year?: number;
  featured?: boolean;
  transmission?: string;
  fuelType?: string;
  powertrain?: string;
  condition?: string;
  priceLabel?: string;
  description?: string;
}

const inventorySeed: CarSeed[] = [
  { brand: "Jaguar", model: "XJ", type: "Luxury Sedan", image: "/New folder/car (1).webp" },
  { brand: "Audi", model: "RS e-tron GT", type: "Electric GT", image: "/New folder/car (2).webp", year: 2025 },
  { brand: "Ferrari", model: "296 GTB", type: "Hybrid Supercar", image: "/New folder/car (3).webp", featured: true, year: 2025 },
  { brand: "Pagani", model: "Huayra", type: "Hypercar", image: "/New folder/car (4).webp", featured: true },
  { brand: "Bentley", model: "Flying Spur", type: "Ultra-Luxury Sedan", image: "/New folder/car (5).webp" },
  { brand: "Lamborghini", model: "Urus", type: "Performance SUV", image: "/New folder/car (6).webp", featured: true },
  { brand: "Lexus", model: "LS", type: "Luxury Sedan", image: "/New folder/car (7).webp" },
  { brand: "Ferrari", model: "F8 Tributo", type: "Supercar", image: "/New folder/car (8).webp", featured: true },
  { brand: "Pagani", model: "Zonda", type: "Hypercar", image: "/New folder/car (9).webp", featured: true },
  { brand: "Porsche", model: "Panamera", type: "Performance Sedan", image: "/New folder/car (10).webp" },
  { brand: "Lamborghini", model: "Huracan EVO", type: "Supercar", image: "/New folder/car (11).webp", featured: true },
  { brand: "Lincoln", model: "Continental", type: "Luxury Sedan", image: "/New folder/car (12).webp" },
  { brand: "Infiniti", model: "Q50", type: "Sport Sedan", image: "/New folder/car (13).webp" },
  { brand: "Honda", model: "Accord", type: "Sedan", image: "/New folder/car (14).webp" },
  { brand: "Lamborghini", model: "Huracan Spyder", type: "Convertible Supercar", image: "/New folder/car (15).webp" },
  { brand: "Rolls-Royce", model: "Ghost", type: "Ultra-Luxury Sedan", image: "/New folder/car (16).webp", featured: true },
  { brand: "BMW", model: "5 Series", type: "Executive Sedan", image: "/New folder/car (17).webp" },
  { brand: "Ferrari", model: "488 Pista", type: "Supercar", image: "/New folder/car (18).webp", featured: true },
  { brand: "Mercedes-Maybach", model: "S-Class", type: "Ultra-Luxury Sedan", image: "/New folder/car (19).webp" },
  { brand: "Audi", model: "A8", type: "Executive Sedan", image: "/New folder/car (20).webp" },
  { brand: "Nissan", model: "Maxima", type: "Sport Sedan", image: "/New folder/car (21).webp" },
  { brand: "Hongqi", model: "H9", type: "Luxury Sedan", image: "/New folder/car (22).webp" },
  { brand: "Lamborghini", model: "Aventador SVJ", type: "Supercar", image: "/New folder/car (23).webp", featured: true },
  { brand: "Audi", model: "e-tron GT", type: "Electric GT", image: "/New folder/car (24).webp", year: 2025 },
  { brand: "Acura", model: "TLX", type: "Sport Sedan", image: "/New folder/car (25).webp" },
  { brand: "Kia", model: "K5", type: "Sport Sedan", image: "/New folder/car (26).webp" },
  { brand: "Lexus", model: "ES", type: "Luxury Sedan", image: "/New folder/car (27).webp" },
  { brand: "Alfa Romeo", model: "Giulia", type: "Sport Sedan", image: "/New folder/car (28).webp" },
  { brand: "Ferrari", model: "Roma", type: "Grand Tourer", image: "/New folder/car (29).webp" },
  { brand: "BMW", model: "7 Series", type: "Executive Sedan", image: "/New folder/car (30).webp" },
  { brand: "Alfa Romeo", model: "Stelvio", type: "Performance SUV", image: "/New folder/car (31).webp" },
  { brand: "Buick", model: "LaCrosse", type: "Sedan", image: "/New folder/car (32).webp" },
  { brand: "Maserati", model: "Ghibli", type: "Sport Sedan", image: "/New folder/car (33).webp" },
  { brand: "Aston Martin", model: "DB11", type: "Grand Tourer", image: "/New folder/car (34).webp" },
  { brand: "Alfa Romeo", model: "Giulia Quadrifoglio", type: "Sport Sedan", image: "/New folder/car (35).webp" },
  { brand: "Mercedes-Benz", model: "S-Class", type: "Luxury Sedan", image: "/New folder/car (36).webp" },
  { brand: "Lamborghini", model: "Revuelto", type: "Hybrid Supercar", image: "/New folder/car (37).webp", featured: true, year: 2025 },
  { brand: "Toyota", model: "Crown", type: "Sedan", image: "/New folder/car (38).webp", year: 2025 },
  { brand: "Xiaomi", model: "SU7", type: "Electric Sedan", image: "/New folder/car (39).webp", year: 2025 },
  { brand: "Mazda", model: "6", type: "Sedan", image: "/New folder/car (40).webp" },
  { brand: "Mercedes-Benz", model: "CLA", type: "Sedan", image: "/New folder/car (41).webp", year: 2025 },
  { brand: "Mazda", model: "6 Signature", type: "Sedan", image: "/New folder/car (42).webp" },
  { brand: "Porsche", model: "Taycan Sport Turismo", type: "Electric Wagon", image: "/New folder/car (43).webp", year: 2025 },
  { brand: "Abarth", model: "695", type: "Hot Hatch", image: "/New folder/car (44).webp" },
  { brand: "Ferrari", model: "296 GTS", type: "Convertible Supercar", image: "/New folder/car (45).webp", year: 2025 },
  { brand: "BYD", model: "Seal", type: "Electric Sedan", image: "/New folder/car (46).webp", year: 2025 },
  { brand: "Toyota", model: "Camry", type: "Sedan", image: "/New folder/car (47).webp" },
  { brand: "Volkswagen", model: "Arteon", type: "Fastback Sedan", image: "/New folder/car (48).webp" },
  { brand: "Pagani", model: "Huayra BC", type: "Hypercar", image: "/New folder/car (49).webp", featured: true },
  { brand: "Mercedes-Benz", model: "C-Class", type: "Luxury Sedan", image: "/New folder/car (50).webp" },
  { brand: "Pagani", model: "Huayra Roadster", type: "Hypercar", image: "/New folder/car (51).webp" },
  { brand: "Audi", model: "A6 e-tron", type: "Electric Sedan", image: "/New folder/car (52).webp", year: 2025 },
  { brand: "Nissan", model: "Maxima SV", type: "Sedan", image: "/New folder/car (53).webp" },
  { brand: "Pagani", model: "Zonda F", type: "Hypercar", image: "/New folder/car (54).webp", featured: true },
  { brand: "Aston Martin", model: "DB11 V8", type: "Grand Tourer", image: "/New folder/car (55).webp" },
  { brand: "MINI", model: "Clubman", type: "Premium Wagon", image: "/New folder/car (56).webp" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDefaultsByType(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("electric wagon")) {
    return {
      transmission: "Single-Speed Automatic",
      fuelType: "Electric",
      powertrain: "Long-range dual-motor touring setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("electric")) {
    return {
      transmission: "Single-Speed Automatic",
      fuelType: "Electric",
      powertrain: "Dual-motor electric performance drive",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("hybrid")) {
    return {
      transmission: "8-Speed Performance Automatic",
      fuelType: "Hybrid",
      powertrain: "Electrified high-output performance system",
      condition: "Collector-grade inventory",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("hypercar")) {
    return {
      transmission: "7-Speed Sequential",
      fuelType: "Gasoline",
      powertrain: "Track-focused naturally aspirated setup",
      condition: "Collector-grade inventory",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("supercar")) {
    return {
      transmission: "7-Speed DCT",
      fuelType: "Gasoline",
      powertrain: "Mid-engine high-output performance setup",
      condition: "Collector-grade inventory",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("grand tourer")) {
    return {
      transmission: "8-Speed Automatic",
      fuelType: "Gasoline",
      powertrain: "Grand touring V8 performance setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("suv")) {
    return {
      transmission: "8-Speed Automatic",
      fuelType: "Gasoline",
      powertrain: "Turbocharged all-wheel-drive SUV setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("hot hatch")) {
    return {
      transmission: "Automatic",
      fuelType: "Gasoline",
      powertrain: "Compact turbocharged sport setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("ultra-luxury")) {
    return {
      transmission: "Automatic",
      fuelType: "Gasoline",
      powertrain: "Flagship luxury touring powertrain",
      condition: "Private showroom inventory",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("luxury")) {
    return {
      transmission: "Automatic",
      fuelType: "Gasoline",
      powertrain: "Refined premium touring setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("executive")) {
    return {
      transmission: "Automatic",
      fuelType: "Gasoline",
      powertrain: "Turbocharged executive touring setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("sport")) {
    return {
      transmission: "Automatic",
      fuelType: "Gasoline",
      powertrain: "Sport-tuned turbocharged setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  if (normalized.includes("wagon")) {
    return {
      transmission: "Automatic",
      fuelType: "Gasoline",
      powertrain: "Touring-focused performance setup",
      condition: "Showroom-ready",
      priceLabel: "Price on request",
    };
  }

  return {
    transmission: "Automatic",
    fuelType: "Gasoline",
    powertrain: "Balanced everyday touring setup",
    condition: "Showroom-ready",
    priceLabel: "Price on request",
  };
}

function buildDescription(seed: CarSeed) {
  const article = /^[aeiou]/i.test(seed.type) ? "an" : "a";
  return `The ${seed.brand} ${seed.model} is ${article} ${seed.type.toLowerCase()} from our curated visual inventory. It combines a distinctive silhouette, premium cabin presence, and the road personality enthusiasts expect from ${seed.brand}.`;
}

export const cars: Car[] = inventorySeed.map((seed, index) => {
  const defaults = getDefaultsByType(seed.type);

  return {
    id: index + 1,
    slug: `${slugify(seed.brand)}-${slugify(seed.model)}-${index + 1}`,
    model: seed.model,
    brand: seed.brand,
    type: seed.type,
    year: seed.year ?? 2024,
    priceLabel: seed.priceLabel ?? defaults.priceLabel,
    condition: seed.condition ?? defaults.condition,
    transmission: seed.transmission ?? defaults.transmission,
    fuelType: seed.fuelType ?? defaults.fuelType,
    powertrain: seed.powertrain ?? defaults.powertrain,
    description: seed.description ?? buildDescription(seed),
    images: [seed.image],
    featured: seed.featured ?? false,
  };
});

export function getAllCars(): Car[] {
  return cars;
}

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((car) => car.slug === slug);
}

export function getFeaturedCars(): Car[] {
  return cars.filter((car) => car.featured);
}

export function getUniqueBrands(): string[] {
  return [...new Set(cars.map((car) => car.brand))].sort((a, b) => a.localeCompare(b));
}
