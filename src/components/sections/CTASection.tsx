import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-transparent pb-24 pt-14 md:pb-32 md:pt-18">
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Ready to Drive?
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "var(--font-heading)" }}>
            Explore our collection and
            <br />
            find your next car
          </h2>
          <p className="text-foreground/50 text-lg mb-10 max-w-xl mx-auto">
            Browse our curated inventory of premium vehicles and schedule a test
            drive today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button href="/cars" size="lg">
              Browse Cars
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
