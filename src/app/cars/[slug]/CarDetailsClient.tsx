"use client";

import { Car } from "@/data/cars";
import CarGallery from "@/components/ui/CarGallery";
import Car360Viewer from "@/components/ui/Car360Viewer";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface CarDetailsClientProps {
  car: Car;
}

export default function CarDetailsClient({ car }: CarDetailsClientProps) {
  const specs = [
    { label: "Model", value: car.model },
    { label: "Type", value: car.type },
    { label: "Year", value: car.year.toString() },
    { label: "Price", value: car.priceLabel },
    { label: "Condition", value: car.condition },
    { label: "Transmission", value: car.transmission },
    { label: "Fuel Type", value: car.fuelType },
    { label: "Powertrain", value: car.powertrain },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
          <a href="/cars" className="hover:text-primary transition-colors">
            Cars
          </a>
          <span>/</span>
          <span className="text-foreground">
            {car.brand} {car.model}
          </span>
        </div>

        <ScrollReveal>
          <CarGallery images={car.images} model={car.model} />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          <div className="lg:col-span-2 space-y-10">
            <ScrollReveal>
              <div>
                <p className="text-primary text-sm font-medium tracking-widest uppercase mb-2">
                  {car.brand}
                </p>
                <h1
                  className="text-4xl md:text-5xl font-black mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {car.model}
                </h1>
                <p className="text-lg text-foreground/60 mb-4">{car.type}</p>
                <p
                  className="text-3xl font-bold text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {car.priceLabel}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  About this Vehicle
                </h2>
                <p className="text-foreground/60 leading-relaxed text-lg">
                  {car.description}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h2
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                360 Degree View
              </h2>
              <Car360Viewer />
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal direction="right">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl bg-surface-light border border-border p-8">
                  <h3
                    className="text-lg font-bold mb-6"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Specifications
                  </h3>
                  <div className="space-y-0">
                    {specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between gap-6 py-3 border-b border-border last:border-0"
                      >
                        <span className="text-sm text-muted">{spec.label}</span>
                        <span className="text-sm font-medium text-foreground text-right">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-surface-light border border-border p-8 text-center">
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Interested?
                  </h3>
                  <p className="text-sm text-muted mb-5">
                    Contact us to schedule a viewing or learn more about this vehicle.
                  </p>
                  <Button
                    href={`mailto:info@autocar.com?subject=Inquiry: ${car.brand} ${car.model}`}
                    className="w-full"
                  >
                    Contact Dealership
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
