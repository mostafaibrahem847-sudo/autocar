"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface iTestimonial {
  name: string;
  designation: string;
  description: string;
  profileImage: string;
}

interface iCarouselProps {
  items: React.ReactElement<{
    testimonial: iTestimonial;
    index: number;
    layout?: boolean;
    onCardClose: () => void;
  }>[];
  initialScroll?: number;
}

const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  onOutsideClick: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      onOutsideClick();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, onOutsideClick]);
};

const Carousel = ({ items, initialScroll = 0 }: iCarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const pointerStartXRef = React.useRef(0);
  const scrollStartLeftRef = React.useRef(0);
  const isPointerDownRef = React.useRef(false);
  const isDraggingRef = React.useRef(false);
  const suppressClickRef = React.useRef(false);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 256 : 384;
      const gap = isMobile() ? 16 : 16;
      const scrollPosition = (cardWidth + gap) * Math.max(index - 1, 0);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (!carouselRef.current) {
      return;
    }

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    pointerStartXRef.current = event.clientX;
    scrollStartLeftRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !carouselRef.current) {
      return;
    }

    const deltaX = event.clientX - pointerStartXRef.current;

    if (Math.abs(deltaX) > 6) {
      isDraggingRef.current = true;
      suppressClickRef.current = true;
    }

    if (!isDraggingRef.current) {
      return;
    }

    carouselRef.current.scrollLeft = scrollStartLeftRef.current - deltaX;
    checkScrollability();
  };

  const finishPointerInteraction = (pointerId?: number) => {
    if (carouselRef.current && typeof pointerId === "number") {
      carouselRef.current.releasePointerCapture?.(pointerId);
    }

    isPointerDownRef.current = false;

    if (isDraggingRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    } else {
      suppressClickRef.current = false;
    }

    isDraggingRef.current = false;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishPointerInteraction(event.pointerId);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    finishPointerInteraction(event.pointerId);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div className="relative mt-10 w-full">
      <div
        className={cn(
          "flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-5 [scrollbar-width:none]",
          "cursor-grab select-none active:cursor-grabbing [touch-action:pan-y]",
        )}
        ref={carouselRef}
        onScroll={checkScrollability}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}
        onClickCapture={handleClickCapture}
      >
        <div className="pointer-events-none absolute right-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />
        <div className={cn("mx-auto flex max-w-6xl flex-row justify-start gap-4 pl-1 md:pl-3")}>
          {items.map((item, index) => (
            <motion.div
              key={`card-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.45,
                  delay: 0.12 * index,
                  ease: "easeOut",
                },
              }}
              className="last:pr-[6%] md:last:pr-[22%]"
            >
              {React.cloneElement(item, {
                onCardClose: () => handleCardClose(index),
              })}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#181512] transition-colors duration-200 hover:bg-[#221d18] disabled:opacity-50"
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
          aria-label="Scroll testimonials left"
        >
          <ArrowLeft className="h-5 w-5 text-[#f3ede3]" />
        </button>
        <button
          type="button"
          className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#181512] transition-colors duration-200 hover:bg-[#221d18] disabled:opacity-50"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
          aria-label="Scroll testimonials right"
        >
          <ArrowRight className="h-5 w-5 text-[#f3ede3]" />
        </button>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
  index,
  layout = false,
  onCardClose = () => {},
  backgroundImage = "https://images.unsplash.com/photo-1528458965990-428de4b1cb0d?q=80&w=3129&auto=format&fit=crop",
}: {
  testimonial: iTestimonial;
  index: number;
  layout?: boolean;
  onCardClose?: () => void;
  backgroundImage?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => {
    setIsExpanded(false);
    onCardClose();
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCollapse();
      }
    };

    if (isExpanded) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo({ top: scrollY, behavior: "auto" });
    }

    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isExpanded]);

  useOutsideClick(containerRef, () => {
    if (isExpanded) {
      handleCollapse();
    }
  });

  return (
    <>
      <AnimatePresence>
        {isExpanded ? (
          <div className="fixed inset-0 z-50 h-screen overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/70 backdrop-blur-lg"
            />

            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              layoutId={layout ? `card-${testimonial.name}` : undefined}
              className="relative z-[60] mx-auto h-full max-w-5xl rounded-none border border-white/10 bg-gradient-to-b from-[#16120f] via-[#1d1814] to-[#120f0d] p-4 md:mt-10 md:h-auto md:max-h-[85vh] md:overflow-y-auto md:rounded-3xl md:p-10"
            >
              <button
                type="button"
                className="sticky right-0 top-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#3a3028]"
                onClick={handleCollapse}
                aria-label={`Close testimonial from ${testimonial.name}`}
              >
                <X className="absolute h-5 w-5 text-white" />
              </button>

              <motion.p
                layoutId={layout ? `category-${testimonial.name}` : undefined}
                className="px-0 text-lg font-light tracking-wide text-[#d8c7ae] underline underline-offset-8 md:px-20"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {testimonial.designation}
              </motion.p>

              <motion.p
                layoutId={layout ? `title-${testimonial.name}` : undefined}
                className="mt-4 px-0 text-2xl font-normal italic lowercase text-[#f7f2ea] md:px-20 md:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {testimonial.name}
              </motion.p>

              <div
                className="px-0 py-8 text-2xl font-light lowercase leading-snug tracking-wide text-[#ebe1d3] md:px-20 md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Quote className="mb-4 h-6 w-6 text-[#d8c7ae]" />
                {testimonial.description}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        layoutId={layout ? `card-${testimonial.name}` : undefined}
        onClick={handleExpand}
        className="text-left"
        whileHover={{
          rotateX: 2,
          rotateY: 2,
          rotate: 1.5,
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <div
          className={`${index % 2 === 0 ? "rotate-0" : "-rotate-[1deg]"} relative z-10 flex h-[500px] w-80 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#171310] via-[#1f1915] to-[#14110f] shadow-[0_18px_48px_rgba(0,0,0,0.38)] md:h-[550px] md:w-96`}
        >
          <div className="absolute opacity-18" style={{ inset: "-1px 0 0" }}>
            <div className="absolute inset-0">
              <Image
                className="block h-full w-full object-cover object-center"
                src={backgroundImage}
                alt="Background layer"
                fill
                sizes="(max-width: 768px) 320px, 384px"
              />
            </div>
          </div>

          <ProfileImage src={testimonial.profileImage} alt={testimonial.name} />

          <motion.p
            layoutId={layout ? `title-${testimonial.name}` : undefined}
            className="mt-4 px-3 text-center text-2xl font-normal lowercase text-[#efe6da] [text-wrap:balance] md:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {testimonial.description.length > 110
              ? `${testimonial.description.slice(0, 110)}...`
              : testimonial.description}
          </motion.p>

          <motion.p
            layoutId={layout ? `name-${testimonial.name}` : undefined}
            className="mt-5 text-center text-xl font-light italic lowercase text-[#f8f3ec] md:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {testimonial.name}.
          </motion.p>

          <motion.p
            layoutId={layout ? `category-${testimonial.name}` : undefined}
            className="mt-1 text-center text-base font-light italic lowercase text-[#cdbda7] underline decoration-1 underline-offset-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {testimonial.designation.length > 34
              ? `${testimonial.designation.slice(0, 34)}...`
              : testimonial.designation}
          </motion.p>
        </div>
      </motion.button>
    </>
  );
};

const ProfileImage = ({ src, alt, ...rest }: ImageProps) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative flex h-[90px] w-[90px] flex-none overflow-hidden rounded-[1000px] border-[3px] border-solid border-[rgba(208,188,160,0.42)] opacity-85 saturate-[0.22] sepia-[0.35] md:h-[150px] md:w-[150px]">
      <Image
        className={cn(
          "absolute inset-0 z-50 rounded-[inherit] object-cover transition duration-300",
          isLoading ? "blur-sm" : "blur-0",
        )}
        onLoad={() => setLoading(false)}
        src={src}
        width={150}
        height={150}
        loading="lazy"
        decoding="async"
        blurDataURL={typeof src === "string" ? src : undefined}
        alt={alt || "Profile image"}
        {...rest}
      />
    </div>
  );
};

export { Carousel, TestimonialCard, ProfileImage };
