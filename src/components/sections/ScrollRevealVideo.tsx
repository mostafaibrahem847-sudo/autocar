"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

interface ScrollRevealVideoStat {
  value: string;
  label: string;
}

interface ScrollRevealVideoProps {
  videoSrc: string;
  className?: string;
  stats?: ScrollRevealVideoStat[];
}

const MOBILE_BREAKPOINT = 768;
const DEFAULT_STATS: ScrollRevealVideoStat[] = [
  { value: "850 HP", label: "ENGINE POWER" },
  { value: "2.8s", label: "0 TO 100 KM/H" },
  { value: "320 KM/H", label: "TOP SPEED" },
];

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.15,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export default function ScrollRevealVideo({
  videoSrc,
  className = "",
  stats = DEFAULT_STATS,
}: ScrollRevealVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Match the collapsed mask to the screen size so the reveal feels balanced
  // on both narrow phones and wide desktop layouts.
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const updateBreakpoint = () => setIsMobile(mediaQuery.matches);

    updateBreakpoint();
    mediaQuery.addEventListener("change", updateBreakpoint);

    return () => mediaQuery.removeEventListener("change", updateBreakpoint);
  }, []);

  // Bind the animation directly to the section's scroll progress.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Complete most of the reveal before the user exits the section so the video
  // has a satisfying full-bleed moment near the end.
  const revealProgress = useTransform(scrollYProgress, [0, 0.85, 1], [0, 1, 1]);

  const collapsedHorizontalInset = isMobile ? 10 : 35;
  const collapsedVerticalInset = isMobile ? 28 : 24;

  const horizontalInset = useTransform(revealProgress, [0, 1], [collapsedHorizontalInset, 0]);
  const verticalInset = useTransform(revealProgress, [0, 1], [collapsedVerticalInset, 0]);
  const borderRadius = useTransform(revealProgress, [0, 1], [40, 0]);
  const overlayOpacity = useTransform(revealProgress, [0, 1], [0.42, 0]);
  const statsY = useTransform(scrollYProgress, [0, 0.5, 0.7], ["120px", "0px", "-20px"]);
  const statsOpacity = useTransform(scrollYProgress, [0, 0.5, 0.65], [1, 1, 0]);

  // The expanding mask makes the video feel like it grows from a small card
  // into a full-screen cinematic panel without relying on layout reflows.
  const clipPath = useMotionTemplate`inset(${verticalInset}% ${horizontalInset}% ${verticalInset}% ${horizontalInset}% round ${borderRadius}px)`;

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[220vh] w-full bg-background ${className}`.trim()}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_42%),linear-gradient(180deg,#040404_0%,#0a0a0a_100%)]" />

        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath,
            borderRadius,
            willChange: "clip-path, border-radius",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          <motion.div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.48)_0%,rgba(6,6,6,0.24)_52%,rgba(6,6,6,0.08)_100%)]"
            style={{ opacity: overlayOpacity }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 ring-1 ring-white/8"
            style={{ opacity: overlayOpacity }}
          />

        </motion.div>

        {/* Keep the stats outside the masked video so they can travel into it while scrolling. */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[62%] z-10 w-max max-w-[94vw] -translate-x-1/2 -translate-y-1/2"
          style={{ y: statsY, opacity: statsOpacity }}
        >
          <div className="flex flex-nowrap items-center justify-center text-center text-white">
            {stats.map((stat, index) => (
              <div key={`${stat.value}-${stat.label}`} className="flex flex-nowrap items-center">
                {index > 0 ? (
                  <div
                    className="mx-4 h-16 w-px sm:mx-6 md:mx-8"
                    style={{ backgroundColor: "rgba(232,200,74,0.24)" }}
                  />
                ) : null}
                <motion.div
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={statVariants}
                  className="min-w-0 px-1 sm:px-2"
                  style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
                >
                  <div
                    className="font-bold"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary-light)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-2 font-light uppercase"
                    style={{
                      fontSize: "clamp(0.65rem, 1.2vw, 0.85rem)",
                      letterSpacing: "0.15em",
                      color: "var(--color-primary-light)",
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,var(--color-background),rgba(10,10,10,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(10,10,10,0),var(--color-background))]" />
      </div>
    </section>
  );
}
