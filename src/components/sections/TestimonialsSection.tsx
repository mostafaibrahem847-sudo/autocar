"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import { Carousel, TestimonialCard, type iTestimonial } from "@/components/ui/retro-testimonial";

type TestimonialDetails = {
  [key: string]: iTestimonial & { id: string };
};

const testimonialData = {
  ids: [
    "autocar-testimonial-01",
    "autocar-testimonial-02",
    "autocar-testimonial-03",
    "autocar-testimonial-04",
    "autocar-testimonial-05",
    "autocar-testimonial-06",
  ],
  details: {
    "autocar-testimonial-01": {
      id: "autocar-testimonial-01",
      description:
        "From the first call to final delivery, everything felt private, precise, and deeply considered. Autocar understood the type of buying experience a performance client actually wants.",
      profileImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
      name: "Omar Al Harthi",
      designation: "Dubai, UAE • Ferrari 296 GTB",
    },
    "autocar-testimonial-02": {
      id: "autocar-testimonial-02",
      description:
        "I expected a premium inventory. What surprised me was the calm confidence of the team. They never pushed, never rushed, and still made the entire process feel exceptional.",
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop",
      name: "Layla Morgan",
      designation: "London, UK • Rolls-Royce Ghost",
    },
    "autocar-testimonial-03": {
      id: "autocar-testimonial-03",
      description:
        "I have purchased collector and modern performance cars across three countries. This was easily one of the most polished, discreet, and trustworthy experiences I have had.",
      profileImage:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
      name: "Daniel Reeves",
      designation: "Los Angeles, CA • Lamborghini Huracan EVO",
    },
    "autocar-testimonial-04": {
      id: "autocar-testimonial-04",
      description:
        "The team translated my taste almost instantly. Every recommendation was on-brand for what I wanted, and the final handover felt more like concierge service than dealership paperwork.",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",
      name: "Sofia Haddad",
      designation: "Riyadh, KSA • Bentley Bentayga",
    },
    "autocar-testimonial-05": {
      id: "autocar-testimonial-05",
      description:
        "What stood out most was transparency. Specs, condition, history, logistics, everything was communicated clearly. That level of detail made the decision feel easy.",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop",
      name: "James Walker",
      designation: "Doha, Qatar • Porsche 911 Turbo S",
    },
    "autocar-testimonial-06": {
      id: "autocar-testimonial-06",
      description:
        "Autocar managed to make a very high-value purchase feel effortless. The showroom, the communication, and the follow-through all matched the standard of the car itself.",
      profileImage:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=900&auto=format&fit=crop",
      name: "Nadine Laurent",
      designation: "Paris, France • Mercedes-Maybach S-Class",
    },
  },
};

const backgroundImage =
  "https://images.unsplash.com/photo-1528458965990-428de4b1cb0d?q=80&w=3129&auto=format&fit=crop";

export default function TestimonialsSection() {
  const details = testimonialData.details as TestimonialDetails;
  const cards = testimonialData.ids.map((cardId, index) => (
    <TestimonialCard
      key={cardId}
      testimonial={details[cardId]}
      index={index}
      backgroundImage={backgroundImage}
    />
  ));

  return (
    <section className="relative z-10 w-full bg-transparent pb-14 pt-24 md:pb-18 md:pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Client Stories
          </p>
          <h2
            className="gradient-text text-4xl font-black md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-foreground/60 md:text-base">
            A more editorial, collectible-style testimonial wall for clients who bought into the
            experience as much as the machine itself.
          </p>
        </ScrollReveal>

        <Carousel items={cards} />
      </div>
    </section>
  );
}
