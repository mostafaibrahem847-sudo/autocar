"use client";

import { useEffect, useState } from "react";

const MINIMUM_LOADER_TIME = 800;
const EXIT_DURATION = 300;
const HOLD_PROGRESS = 92;

export default function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onLoad = () => setHasLoaded(true);

    if (document.readyState === "complete") {
      setHasLoaded(true);
    } else {
      window.addEventListener("load", onLoad);
    }

    const minimumTimer = window.setTimeout(() => {
      setMinimumElapsed(true);
    }, MINIMUM_LOADER_TIME);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(minimumTimer);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || typeof window === "undefined") {
      return;
    }

    const canComplete = hasLoaded && minimumElapsed;
    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (canComplete) {
          if (current >= 100) {
            return 100;
          }

          const step = current < 80 ? 4 : current < 95 ? 2 : 1;
          return Math.min(100, current + step);
        }

        if (current >= HOLD_PROGRESS) {
          return current;
        }

        const step = current < 25 ? 2.5 : current < 55 ? 2 : current < 78 ? 1.5 : 1;
        return Math.min(HOLD_PROGRESS, current + step);
      });
    }, 60);

    return () => window.clearInterval(progressTimer);
  }, [hasLoaded, minimumElapsed, isVisible]);

  useEffect(() => {
    if (!(hasLoaded && minimumElapsed) || progress < 100) {
      return;
    }

    setIsExiting(true);

    const exitTimer = window.setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("site-loading-active");
      window.dispatchEvent(new Event("site-loader:complete"));
    }, EXIT_DURATION);

    return () => window.clearTimeout(exitTimer);
  }, [hasLoaded, minimumElapsed, progress]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (!isVisible) {
      document.body.classList.remove("site-loading-active");
      return;
    }

    document.body.classList.add("site-loading-active");

    return () => {
      document.body.classList.remove("site-loading-active");
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const carPosition = Math.min(progress, 100);
  const percentageLabel = `${Math.round(progress).toString().padStart(2, "0")}%`;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),_transparent_34%),linear-gradient(180deg,_#090909_0%,_#0b0b0b_55%,_#050505_100%)] transition-all duration-700 ${
        isExiting ? "pointer-events-none scale-[1.02] opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Autocar"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.02)_45%,transparent_100%)] opacity-40" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <p className="mb-5 text-[0.95rem] font-medium tracking-[0.44em] uppercase text-primary/72">
          Preparing the Showroom
        </p>
        <h1
          className="mb-4 text-[3.3rem] font-black text-foreground sm:text-[4rem]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Autocar
        </h1>
        <p className="mb-8 max-w-md text-[1.16rem] leading-relaxed text-foreground/52 sm:text-[1.32rem]">
          Igniting the experience. Your curated collection is warming up now.
        </p>

        <div className="mt-2 flex w-full max-w-[19rem] items-end gap-4">
          <div className="relative flex-1">
            <div className="relative h-14 w-full">
              <div
                className="absolute top-1 -translate-x-1/2 transition-[left] duration-200 ease-out"
                style={{ left: `${carPosition}%` }}
              >
                <div className="relative">
                  <div className="absolute -inset-x-5 top-5 h-6 rounded-full bg-primary/18 blur-xl" />
                  <div className="loader-airflow absolute right-[3.15rem] top-1/2 h-px w-10 -translate-y-1/2" />
                  <div className="loader-airflow absolute right-[3.85rem] top-[35%] h-px w-7" />
                  <div className="loader-airflow absolute right-[3.75rem] top-[67%] h-px w-8" />

                  <svg
                    width="78"
                    height="38"
                    viewBox="0 0 120 58"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)]"
                  >
                    <path
                      d="M16 36.5L24.2 21.6C26.2 18.1 29.9 16 33.9 16H73.1C77.6 16 81.8 18.4 84.1 22.2L90.3 32.2H99.5C107 32.2 113 38.2 113 45.7V46.2H105.3C104.6 40.3 99.5 35.8 93.4 35.8C87.4 35.8 82.3 40.3 81.5 46.2H41.6C40.8 40.3 35.7 35.8 29.7 35.8C23.6 35.8 18.5 40.3 17.8 46.2H8V44.9C8 41.7 10.6 39.1 13.8 39.1H16V36.5Z"
                      fill="#d4af37"
                    />
                    <path
                      d="M33.1 20H72.4C75.2 20 77.8 21.4 79.3 23.8L83.4 30.2H21.8L27.1 21.2C28.4 20.1 30.1 20 33.1 20Z"
                      fill="#f4d665"
                      fillOpacity="0.92"
                    />
                    <path
                      d="M30 24H47.8V30.2H25.9L29 24.8C29.2 24.4 29.6 24 30 24Z"
                      fill="#111111"
                      fillOpacity="0.82"
                    />
                    <path d="M51.4 24H71.8C74.4 24 76.8 25.4 78.2 27.6L79.7 30.2H51.4V24Z" fill="#111111" fillOpacity="0.82" />
                    <circle className="loader-wheel-spin origin-center" cx="29.7" cy="46.2" r="10.8" fill="#141414" />
                    <circle className="loader-wheel-spin origin-center" cx="29.7" cy="46.2" r="5.3" fill="#d9d9d9" fillOpacity="0.65" />
                    <circle className="loader-wheel-spin origin-center" cx="93.4" cy="46.2" r="10.8" fill="#141414" />
                    <circle className="loader-wheel-spin origin-center" cx="93.4" cy="46.2" r="5.3" fill="#d9d9d9" fillOpacity="0.65" />
                    <rect x="95.8" y="21.2" width="8.4" height="3" rx="1.5" fill="#f4d665" fillOpacity="0.95" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative h-1 overflow-hidden rounded-full bg-white/8">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-dark via-primary to-primary-light transition-[width] duration-300 ease-out"
                style={{ width: `${carPosition}%` }}
              />
            </div>
          </div>

          <div
            className="min-w-[3.5rem] text-right text-base font-bold leading-none tabular-nums text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {percentageLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
