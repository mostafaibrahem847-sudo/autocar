"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type TransitionPhase = "idle" | "covering" | "holding" | "revealing";

interface PageTransitionContextValue {
  navigateWithTransition: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const COVER_DELAY = 520;
const REVEAL_DELAY = 120;
const PANEL_DURATION = 880;
const HOLD_DURATION = 240;

function getRouteLabel(pathname: string) {
  if (pathname === "/") {
    return "Home";
  }

  if (pathname === "/cars") {
    return "Cars";
  }

  if (pathname === "/about") {
    return "About";
  }

  if (pathname === "/contact") {
    return "Contact";
  }

  if (pathname.startsWith("/cars/")) {
    return "Vehicle";
  }

  return "Autocar";
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider.");
  }

  return context;
}

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [activeLabel, setActiveLabel] = useState(getRouteLabel(pathname));

  const isTransitioningRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const previousPathnameRef = useRef(pathname);
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const queueTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
  }, []);

  const finishTransition = useCallback(() => {
    queueTimeout(() => {
      setPhase("idle");
      setIsVisible(false);
      isTransitioningRef.current = false;
      pendingHrefRef.current = null;
    }, PANEL_DURATION);
  }, [queueTimeout]);

  const navigateWithTransition = useCallback(
    (href: string) => {
      if (typeof window === "undefined") {
        router.push(href);
        return;
      }

      const url = new URL(href, window.location.origin);
      const nextRoute = `${url.pathname}${url.search}${url.hash}`;
      const currentRoute = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (nextRoute === currentRoute || isTransitioningRef.current) {
        return;
      }

      clearAllTimers();
      pendingHrefRef.current = nextRoute;
      isTransitioningRef.current = true;
      setActiveLabel(getRouteLabel(url.pathname));
      setIsVisible(true);
      setPhase("covering");

      queueTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        router.push(nextRoute);
      }, COVER_DELAY);
    },
    [clearAllTimers, queueTimeout, router]
  );

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    if (pathname === previousPathname || !isTransitioningRef.current) {
      return;
    }

    clearAllTimers();
    setPhase("holding");

    queueTimeout(() => {
      setPhase("revealing");
      finishTransition();
    }, HOLD_DURATION + REVEAL_DELAY);
  }, [clearAllTimers, finishTransition, pathname, queueTimeout]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const contextValue = useMemo<PageTransitionContextValue>(
    () => ({
      navigateWithTransition,
      isTransitioning: isTransitioningRef.current,
    }),
    [navigateWithTransition]
  );

  return (
    <PageTransitionContext.Provider value={contextValue}>
      <div className="page-transition-shell">
        {children}
      </div>

      <div
        className={`page-transition-layer ${isVisible ? "is-visible" : ""} ${
          isVisible ? `is-${phase}` : ""
        }`}
        aria-hidden="true"
      >
        <div className="page-transition-glow" />
        <div className="page-transition-panel page-transition-panel-top" />
        <div className="page-transition-panel page-transition-panel-bottom" />
        <div className="page-transition-centerline" />

        <div className="page-transition-copy">
          <p className="page-transition-kicker">Autocar</p>
          <p className="page-transition-title">{activeLabel}</p>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
