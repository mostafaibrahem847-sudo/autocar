"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { getAllCars } from "@/data/cars";
import styles from "./ScrollDepthShowcase.module.css";

type Slot = {
  left: number;
  top: number;
  width: number;
  height: number;
  depth: number;
};

type HudSlot = {
  left: number;
  top: number;
};

type PhaseWindow = {
  start: number;
  peak: number;
  holdEnd: number;
  exitEnd: number;
};

const CARDS_PER_PHASE = 12;
const GHOST_SCALE = 0.026;
const GHOST_OPACITY = 0.03;

const BASE_SLOTS: Slot[] = [
  { left: 7, top: 10, width: 214, height: 146, depth: 4.8 },
  { left: 74, top: 8, width: 166, height: 114, depth: 2.4 },
  { left: 4, top: 33, width: 156, height: 108, depth: 3.4 },
  { left: 81, top: 27, width: 142, height: 100, depth: 2.8 },
  { left: 11, top: 61, width: 236, height: 162, depth: 5.2 },
  { left: 74, top: 60, width: 186, height: 128, depth: 3.1 },
  { left: 23, top: 75, width: 148, height: 102, depth: 2.1 },
  { left: 58, top: 72, width: 132, height: 94, depth: 1.8 },
  { left: 30, top: 8, width: 122, height: 86, depth: 1.9 },
  { left: 64, top: 41, width: 154, height: 108, depth: 2.7 },
  { left: 37, top: 23, width: 176, height: 122, depth: 3.7 },
  { left: 43, top: 82, width: 118, height: 82, depth: 1.6 },
];

const HUD_SLOTS: HudSlot[] = [
  { left: 3, top: 22 },
  { left: 76, top: 12 },
  { left: 8, top: 82 },
  { left: 66, top: 76 },
  { left: 50, top: 10 },
  { left: 82, top: 52 },
];

const PHASE_WINDOWS: PhaseWindow[] = [
  { start: 0.06, peak: 0.31, holdEnd: 0.43, exitEnd: 0.56 },
  { start: 0.6, peak: 0.79, holdEnd: 0.88, exitEnd: 0.96 },
  { start: 0.95, peak: 0.995, holdEnd: 1, exitEnd: 1.01 },
];

const DIAGONALS = [
  { x1: 820, y1: 0, x2: 1110, y2: 900, strokeWidth: 1 },
  { x1: 760, y1: 0, x2: 970, y2: 900, strokeWidth: 0.7 },
  { x1: 910, y1: 0, x2: 1210, y2: 900, strokeWidth: 0.6 },
  { x1: 320, y1: 0, x2: 560, y2: 900, strokeWidth: 1 },
  { x1: 250, y1: 0, x2: 500, y2: 900, strokeWidth: 0.7 },
  { x1: 1120, y1: 0, x2: 830, y2: 900, strokeWidth: 1 },
  { x1: 1210, y1: 0, x2: 920, y2: 900, strokeWidth: 0.7 },
];

const INVENTORY = getAllCars().slice(0, CARDS_PER_PHASE * 3);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildPhaseSlots(phaseIndex: number) {
  return BASE_SLOTS.map((slot, index) => {
    const horizontalShift = ((index % 4) - 1.5) * (phaseIndex === 1 ? 2.2 : 1.6);
    const verticalShift = ((index % 3) - 1) * (phaseIndex === 2 ? 2.4 : 1.4);
    const widthScale = 1 + (phaseIndex - 1) * 0.04 + (index % 2 === 0 ? 0.03 : -0.02);
    const heightScale = 1 + (phaseIndex - 1) * 0.035 + (index % 3 === 0 ? 0.03 : -0.015);

    return {
      left: clamp(slot.left + phaseIndex * 0.8 + horizontalShift, 3, 84),
      top: clamp(slot.top + phaseIndex * 1.1 + verticalShift, 5, 84),
      width: Math.round(slot.width * widthScale),
      height: Math.round(slot.height * heightScale),
      depth: Number((slot.depth * (0.95 + phaseIndex * 0.08)).toFixed(2)),
    };
  });
}

const PHASE_SLOTS = [0, 1, 2].map((phaseIndex) => buildPhaseSlots(phaseIndex));

const SHOWCASE_CARS = INVENTORY.map((car, index) => {
  const phase = Math.floor(index / CARDS_PER_PHASE);
  const phaseIndex = index % CARDS_PER_PHASE;

  return {
    ...car,
    phase,
    phaseIndex,
    slot: PHASE_SLOTS[phase][phaseIndex],
    image: encodeURI(car.images[0]),
  };
});

const HUD_ITEMS = [
  SHOWCASE_CARS[0],
  SHOWCASE_CARS[7],
  SHOWCASE_CARS[14],
  SHOWCASE_CARS[21],
  SHOWCASE_CARS[28],
  SHOWCASE_CARS[35],
].map((car, index) => ({
  text:
    index % 2 === 0
      ? `${car.brand} ${car.model}\n${car.type}`
      : `${car.brand} ${car.model}\n${car.condition}`,
  phase: car.phase,
  slot: HUD_SLOTS[index],
}));

function getPhaseStrength(progress: number, phase: number) {
  const window = PHASE_WINDOWS[phase];
  const reveal = clamp((progress - window.start) / Math.max(window.peak - window.start, 0.001), 0, 1);
  const exit = clamp((progress - window.holdEnd) / Math.max(window.exitEnd - window.holdEnd, 0.001), 0, 1);

  return reveal * (1 - exit);
}

function getCardRevealStrength(phaseReveal: number, order: number, total: number) {
  const spread = 0.88;
  const step = total > 1 ? spread / (total - 1) : 0;
  const start = order * step;
  const duration = 0.42;

  return clamp((phaseReveal - start) / duration, 0, 1);
}

function getPhaseState(progress: number, phase: number) {
  const window = PHASE_WINDOWS[phase];
  const reveal = clamp((progress - window.start) / Math.max(window.peak - window.start, 0.001), 0, 1);
  const exit = clamp((progress - window.holdEnd) / Math.max(window.exitEnd - window.holdEnd, 0.001), 0, 1);
  const visibility = reveal * (1 - exit);

  return {
    reveal,
    exit,
    visibility,
  };
}

function applyShowcaseProgress(root: HTMLElement, progress: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const centerX = vw / 2;
  const centerY = vh / 2;

  root.querySelectorAll<HTMLElement>("[data-float-card]").forEach((card) => {
    const depth = Number(card.dataset.depth);
    const phase = Number(card.dataset.phase);
    const order = Number(card.dataset.order);
    const total = Number(card.dataset.total);
    const ox = (Number(card.dataset.ox) / 100) * vw;
    const oy = (Number(card.dataset.oy) / 100) * vh;
    const dx = ox - centerX;
    const dy = oy - centerY;
    const phaseState = getPhaseState(progress, phase);
    const cardReveal = getCardRevealStrength(phaseState.reveal, order, total);
    const visibility = cardReveal * (1 - phaseState.exit);
    const angle = (order / Math.max(total, 1)) * Math.PI * 2 + phase * 0.42;
    const clusterRadius = 42 + phase * 16 + (order % 3) * 5;
    const clusterX = Math.cos(angle) * clusterRadius;
    const clusterY = Math.sin(angle) * clusterRadius * 0.72;
    const enteredX = clusterX + (dx - clusterX) * cardReveal;
    const enteredY = clusterY + (dy - clusterY) * cardReveal;
    const desiredX = enteredX + dx * phaseState.exit * (0.95 + depth * 0.08);
    const desiredY = enteredY + dy * phaseState.exit * (0.95 + depth * 0.08);
    const translateX = desiredX - dx;
    const translateY = desiredY - dy;
    const scale =
      GHOST_SCALE +
      cardReveal * (0.92 + depth * 0.04) +
      phaseState.exit * 0.46 * cardReveal;
    const opacity = clamp(
      GHOST_OPACITY + visibility * (0.84 + depth * 0.02) - phaseState.exit * 0.16,
      phaseState.exit >= 1 ? 0 : GHOST_OPACITY,
      0.98
    );

    card.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    card.style.opacity = opacity.toString();
    card.style.zIndex = `${15 + phase * 5 + Math.round(visibility * 14)}`;
  });

  root.querySelectorAll<HTMLElement>("[data-hud]").forEach((hud) => {
    const depth = Number(hud.dataset.depth);
    const phase = Number(hud.dataset.phase);
    const phaseState = getPhaseState(progress, phase);

    hud.style.opacity = Math.min(phaseState.visibility * 0.62, 0.52).toString();
    hud.style.transform = `translateY(${(1 - phaseState.reveal + phaseState.exit * 1.2) * 18 * depth}px)`;
  });

  const center = root.querySelector<HTMLElement>("[data-scene-center]");
  if (center) {
    const y = (1 - progress) * 28;
    const opacity = 0.24 + Math.min(progress * 1.1, 0.76);
    const scale = 0.94 + Math.min(progress, 1) * 0.06;

    center.style.opacity = opacity.toString();
    center.style.transform = `translate(-50%, calc(-50% + ${y}px)) scale(${scale})`;
  }
  const cta = root.querySelector<HTMLElement>("[data-final-cta]");
  if (cta) {
    const reveal = clamp((progress - 0.9) / 0.08, 0, 1);
    cta.style.opacity = reveal.toString();
    cta.style.transform = `translateY(${(1 - reveal) * 18}px)`;
  }
}

export default function ScrollDepthShowcase() {
  const wrapRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapRef.current) {
      return;
    }

    const root = wrapRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      applyShowcaseProgress(root, 1);
      return;
    }

    let ticking = false;

    const updateShowcase = () => {
      const top = root.offsetTop;
      const travel = Math.max(root.offsetHeight - window.innerHeight, 1);
      const progress = clamp((window.scrollY - top) / travel, 0, 1);

      applyShowcaseProgress(root, progress);
      ticking = false;
    };

    const requestTick = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateShowcase);
    };

    updateShowcase();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
    };
  }, []);

  const sectionHeight = Math.min(1280, 480 + SHOWCASE_CARS.length * 21);

  return (
    <section className={styles.section}>
      <article
        ref={wrapRef}
        className={styles.sceneWrap}
        style={{ height: `${sectionHeight}vh` }}
      >
        <div className={styles.sticky}>
          <div className={styles.sceneGlow} />
          <svg className={styles.diag} viewBox="0 0 1440 900" preserveAspectRatio="none">
            {DIAGONALS.map((line, index) => (
              <line
                key={`diag-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(212, 175, 55, 0.09)"
                strokeWidth={line.strokeWidth}
              />
            ))}
          </svg>

          {SHOWCASE_CARS.map((car) => {
            const cardStyle = {
              "--left": `${car.slot.left}%`,
              "--top": `${car.slot.top}%`,
              "--w": `${car.slot.width}px`,
              "--h": `${car.slot.height}px`,
            } as CSSProperties;

            return (
              <div
                key={car.id}
                data-float-card
                data-phase={car.phase}
                data-order={car.phaseIndex}
                data-total={CARDS_PER_PHASE}
                data-depth={car.slot.depth}
                data-ox={car.slot.left}
                data-oy={car.slot.top}
                className={styles.floatCard}
                style={cardStyle}
              >
                <Image
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  sizes="(max-width: 768px) 34vw, (max-width: 1100px) 22vw, 220px"
                  className={styles.floatImage}
                />
                <div className={styles.floatOverlay} />
                <div className={styles.floatMeta}>
                  <div>
                    <span className={styles.floatBrand}>{car.brand}</span>
                    <span className={styles.floatModel}>{car.model}</span>
                  </div>
                  <span className={styles.floatType}>{car.type}</span>
                </div>
              </div>
            );
          })}

          {HUD_ITEMS.map((item, index) => {
            const hudStyle = {
              "--hud-left": `${item.slot.left}%`,
              "--hud-top": `${item.slot.top}%`,
            } as CSSProperties;

            return (
              <div
                key={`hud-${index}`}
                data-hud
                data-phase={item.phase}
                data-depth={1 + (index % 3) * 0.18}
                className={styles.hud}
                style={hudStyle}
              >
                {item.text}
              </div>
            );
          })}

          <div data-scene-center className={styles.center}>
            <h2 className={styles.title}>One Scroll Through The Full Collection</h2>
            <p className={styles.body}>
              This is a single cinematic reveal built from the full set of featured moments.
              The inventory keeps unfolding inside one continuous scene, so visitors feel the
              depth of the collection without breaking immersion.
            </p>

            <div data-final-cta className={styles.ctaReveal}>
              <Button href="/cars" size="lg">
                Browse The Inventory
              </Button>
            </div>
          </div>
          <div className={styles.vignette} />
        </div>
      </article>
    </section>
  );
}
