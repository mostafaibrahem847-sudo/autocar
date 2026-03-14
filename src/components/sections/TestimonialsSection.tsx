"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollReveal from "@/components/animations/ScrollReveal";

const testimonials = [
  {
    name: "Ahmed K.",
    location: "Dubai, UAE",
    car: "Lamborghini Huracan EVO",
    quote:
      "The experience was beyond anything I expected. Not just a purchase - a memory.",
  },
  {
    name: "Sarah M.",
    location: "London, UK",
    car: "Rolls-Royce Ghost",
    quote:
      "Autocar made the entire process seamless. They knew exactly what I needed before I did.",
  },
  {
    name: "Carlos R.",
    location: "Los Angeles, CA",
    car: "Ferrari 488 Pista",
    quote:
      "I've bought from many dealers. None came close to this level of personal attention.",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    }, card);

    return () => ctx.revert();
  }, [activeIndex]);

  useEffect(() => {
    const rotationTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(rotationTimer);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="w-full bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary uppercase">
            Client Stories
          </p>
          <h2
            className="gradient-text text-4xl font-black md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Our Clients Say
          </h2>
        </ScrollReveal>

        <div
          ref={cardRef}
          className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-surface-light p-8 shadow-[0_24px_80px_rgba(0,0,0,0.26)] md:p-12"
        >
          <span className="mb-3 block text-8xl leading-none text-primary opacity-20 md:mb-1">
            &ldquo;
          </span>

          <blockquote className="text-xl italic leading-relaxed text-foreground/80 md:text-2xl">
            {activeTestimonial.quote}
          </blockquote>

          <div className="mt-10 border-t border-white/6 pt-6">
            <p className="text-lg font-bold text-foreground">{activeTestimonial.name}</p>
            <p className="mt-1 text-sm font-medium text-primary">{activeTestimonial.car}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              {activeTestimonial.location}
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goToPrevious}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-light text-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary"
            aria-label="Previous testimonial"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.75L8.75 12l5.5 5.25" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isActive ? "w-10 bg-primary" : "w-3 bg-white/20 hover:bg-white/35"
                  }`}
                  aria-label={`Show testimonial from ${testimonial.name}`}
                  aria-pressed={isActive}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-light text-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary"
            aria-label="Next testimonial"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75L15.25 12l-5.5 5.25" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
