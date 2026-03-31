"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const VIDEO_DURATION_SECONDS = 8;
const PIXELS_PER_SECOND = 150;
const SCROLL_DISTANCE = VIDEO_DURATION_SECONDS * PIXELS_PER_SECOND;
const VISIBILITY_EPSILON = 0.05;

interface ScrollVideoPlayerProps {
  sequenceBasePath: string;
  frameCount: number;
  fileExtension?: "jpg" | "jpeg" | "png" | "webp";
}

interface OverlayCardProps {
  visible: boolean;
  className: string;
  eyebrow: string;
  value: string;
  children: ReactNode;
}

function OverlayCard({
  visible,
  className,
  eyebrow,
  value,
  children,
}: OverlayCardProps) {
  return (
    <div
      className={[
        "pointer-events-none absolute z-10 w-[min(20rem,calc(100%-2rem))] rounded-xl border border-white/20 bg-black/60 px-5 py-4 text-white backdrop-blur-xl transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      ].join(" ")}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">{eyebrow}</p>
      <p className="mt-2 text-[22px] font-light leading-tight text-white">{value}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function padFrame(frameNumber: number) {
  return frameNumber.toString().padStart(4, "0");
}

function getDrawRect(
  mode: "contain" | "cover",
  canvasWidth: number,
  canvasHeight: number,
  image: HTMLImageElement
) {
  const canvasAspect = canvasWidth / canvasHeight;
  const imageAspect = image.naturalWidth / image.naturalHeight;

  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;
  let drawX = 0;
  let drawY = 0;

  if (mode === "contain") {
    if (imageAspect > canvasAspect) {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imageAspect;
      drawY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageAspect;
      drawX = (canvasWidth - drawWidth) / 2;
    }
  } else if (imageAspect > canvasAspect) {
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imageAspect;
    drawX = (canvasWidth - drawWidth) / 2;
  } else {
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imageAspect;
    drawY = (canvasHeight - drawHeight) / 2;
  }

  return { drawWidth, drawHeight, drawX, drawY };
}

function drawSequenceFrame(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement
) {
  const logicalWidth = canvas.clientWidth || canvas.width;
  const logicalHeight = canvas.clientHeight || canvas.height;
  const frameRect = getDrawRect("cover", logicalWidth, logicalHeight, image);

  context.clearRect(0, 0, logicalWidth, logicalHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    frameRect.drawX,
    frameRect.drawY,
    frameRect.drawWidth,
    frameRect.drawHeight
  );
}

export default function ScrollVideoPlayer({
  sequenceBasePath,
  frameCount,
  fileExtension = "jpg",
}: ScrollVideoPlayerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const sectionTopRef = useRef(0);
  const currentFrameRef = useRef(0);
  const loadedImagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [shouldLoadSequence, setShouldLoadSequence] = useState(false);
  const [sequenceReady, setSequenceReady] = useState(false);
  const [overlayVisibility, setOverlayVisibility] = useState({
    engine: false,
    acceleration: false,
    weight: false,
    wordmark: false,
  });

  const rpmCircumference = useMemo(() => 2 * Math.PI * 26, []);

  const getFrameSrc = (frameIndex: number) =>
    `${sequenceBasePath}/frame-${padFrame(frameIndex + 1)}.${fileExtension}`;

  // PERFORMANCE FIX: Do not begin fetching the heavy image-sequence frames
  // until the section is within 200px of the viewport.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section || typeof IntersectionObserver === "undefined") {
      setShouldLoadSequence(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setShouldLoadSequence(true);
        observer.disconnect();
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadSequence) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    loadedImagesRef.current = Array.from({ length: frameCount }, () => null);
    let isCancelled = false;

    const resizeCanvas = () => {
      const nextCanvas = canvasRef.current;

      if (!nextCanvas) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      nextCanvas.width = Math.floor(nextCanvas.clientWidth * dpr);
      nextCanvas.height = Math.floor(nextCanvas.clientHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const currentImage = loadedImagesRef.current[currentFrameRef.current];

      if (currentImage) {
        drawSequenceFrame(context, nextCanvas, currentImage);
      }
    };

    const loadFrame = (frameIndex: number) => {
      const image = new Image();
      image.decoding = "async";
      image.src = getFrameSrc(frameIndex);
      image.onload = () => {
        if (isCancelled) {
          return;
        }

        loadedImagesRef.current[frameIndex] = image;

        if (frameIndex === 0) {
          setSequenceReady(true);
          resizeCanvas();
          drawSequenceFrame(context, canvas, image);
        }
      };
    };

    loadFrame(0);

    let frameIndex = 1;
    const loadNext = () => {
      if (isCancelled || frameIndex >= frameCount) {
        return;
      }

      loadFrame(frameIndex);
      frameIndex += 1;
      setTimeout(loadNext, 16);
    };

    setTimeout(loadNext, 500);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [fileExtension, frameCount, sequenceBasePath, shouldLoadSequence]);

  useEffect(() => {
    if (!sequenceReady) {
      return;
    }

    const updateSectionMetrics = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      sectionTopRef.current = window.scrollY + section.getBoundingClientRect().top;
    };

    const drawFrame = (frameIndex: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const image = loadedImagesRef.current[frameIndex];

      if (!canvas || !context || !image) {
        return;
      }

      currentFrameRef.current = frameIndex;
      drawSequenceFrame(context, canvas, image);
    };

    const updateSequenceFrame = () => {
      const section = sectionRef.current;

      if (!section) {
        frameRef.current = null;
        return;
      }

      const scrolledDistance = Math.min(
        Math.max(window.scrollY - sectionTopRef.current, 0),
        SCROLL_DISTANCE
      );
      const nextTime = Math.min(scrolledDistance / PIXELS_PER_SECOND, VIDEO_DURATION_SECONDS);
      const nextFrame = Math.min(
        Math.round((nextTime / VIDEO_DURATION_SECONDS) * (frameCount - 1)),
        frameCount - 1
      );

      if (currentFrameRef.current !== nextFrame && loadedImagesRef.current[nextFrame]) {
        drawFrame(nextFrame);
      }

      setOverlayVisibility((previous) => {
        const nextVisibility = {
          engine: nextTime >= 2 - VISIBILITY_EPSILON,
          acceleration: nextTime >= 4 - VISIBILITY_EPSILON,
          weight: nextTime >= 6 - VISIBILITY_EPSILON,
          wordmark: nextTime >= 8 - VISIBILITY_EPSILON,
        };

        if (
          previous.engine === nextVisibility.engine &&
          previous.acceleration === nextVisibility.acceleration &&
          previous.weight === nextVisibility.weight &&
          previous.wordmark === nextVisibility.wordmark
        ) {
          return previous;
        }

        return nextVisibility;
      });

      frameRef.current = null;
    };

    const queueSequenceFrame = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateSequenceFrame);
    };

    updateSectionMetrics();
    queueSequenceFrame();
    window.addEventListener("scroll", queueSequenceFrame, { passive: true });
    window.addEventListener("resize", updateSectionMetrics);
    window.addEventListener("resize", queueSequenceFrame);

    return () => {
      window.removeEventListener("scroll", queueSequenceFrame);
      window.removeEventListener("resize", updateSectionMetrics);
      window.removeEventListener("resize", queueSequenceFrame);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [frameCount, sequenceReady]);

  return (
    <section
      ref={sectionRef}
      className={`${spaceGrotesk.className} relative left-1/2 w-screen -translate-x-1/2 bg-background`}
      style={{ height: `calc(100vh + ${SCROLL_DISTANCE}px)` }}
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

        {/* PERFORMANCE FIX: Keep a lightweight placeholder in place while the
            deferred frame sequence has not started or finished loading yet. */}
        {!sequenceReady ? (
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_42%),linear-gradient(180deg,#050505_0%,#000_100%)] bg-cover bg-center blur-[1px] scale-[1.02]"
            style={
              shouldLoadSequence
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(5,5,5,0.12) 0%, rgba(0,0,0,0.72) 100%), url("${getFrameSrc(0)}")`,
                  }
                : undefined
            }
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.2)_100%)]" />

        <OverlayCard
          visible={overlayVisibility.engine}
          className="left-4 top-4 sm:left-8 sm:top-8"
          eyebrow="Powertrain"
          value="Engine: 4.0L Flat-Six / 525 HP"
        >
          <div className="flex items-center gap-4">
            <svg width="68" height="68" viewBox="0 0 68 68" className="shrink-0">
              <circle
                cx="34"
                cy="34"
                r="26"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="3"
              />
              <circle
                cx="34"
                cy="34"
                r="26"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={rpmCircumference}
                strokeDashoffset={overlayVisibility.engine ? 0 : rpmCircumference}
                style={{
                  transition: "stroke-dashoffset 0.6s ease",
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">RPM Gauge</p>
              <p className="mt-2 text-sm font-light text-white/80">Torque-ready at high revs</p>
            </div>
          </div>
        </OverlayCard>

        <OverlayCard
          visible={overlayVisibility.acceleration}
          className="right-4 top-4 sm:right-8 sm:top-8"
          eyebrow="Launch"
          value="0-100 km/h: 3.2s"
        >
          <div className="h-px w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full origin-left bg-white transition-transform duration-500 ease-out"
              style={{ transform: overlayVisibility.acceleration ? "scaleX(1)" : "scaleX(0)" }}
            />
          </div>
        </OverlayCard>

        <OverlayCard
          visible={overlayVisibility.weight}
          className="bottom-4 left-4 sm:bottom-8 sm:left-8"
          eyebrow="Chassis"
          value="Weight: 1,450 kg / Rear-wheel drive"
        >
          <div className="flex h-12 items-end gap-2">
            {[0.45, 0.9, 0.65].map((height, index) => (
              <div
                key={height}
                className="w-2 origin-bottom rounded-full bg-white/90 transition-transform ease-out"
                style={{
                  height: "100%",
                  transform: overlayVisibility.weight ? `scaleY(${height})` : "scaleY(0)",
                  transitionDuration: `${400 + index * 120}ms`,
                }}
              />
            ))}
          </div>
        </OverlayCard>

        <div
          className={[
            "pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center text-white transition-all duration-[800ms] ease-out",
            overlayVisibility.wordmark ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          ].join(" ")}
        >
          <span className="text-xl font-light tracking-[0.6em] text-white sm:text-2xl">PORSCHE</span>
        </div>
      </div>
    </section>
  );
}
