import { Car } from "@/data/cars";
import TransitionLink from "@/components/ui/TransitionLink";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const imageUrl = encodeURI(car.images[0]);

  return (
    <TransitionLink href={`/cars/${car.slug}`} className="group block">
      <div className="relative bg-surface-light rounded-2xl overflow-hidden border border-border transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
        <div className="relative h-56 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent" />
          {car.featured && (
            <span className="absolute top-4 right-4 bg-primary text-background text-xs font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="p-6">
          <p className="text-primary text-xs font-medium tracking-wider uppercase mb-1">
            {car.brand}
          </p>
          <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {car.model}
          </h3>
          <p className="text-sm text-foreground/60 mb-3">{car.type}</p>
          <div className="flex items-center gap-3 text-xs text-muted mb-4">
            <span>{car.year}</span>
            <span className="w-1 h-1 rounded-full bg-muted" />
            <span>{car.type}</span>
            <span className="w-1 h-1 rounded-full bg-muted" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl font-heading font-bold text-foreground">
              {car.priceLabel}
            </p>
            <span className="text-xs text-primary font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Details -&gt;
            </span>
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}
