"use client";

import { useEffect, useMemo, useState } from "react";

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function ScrollSpeedometer() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = documentHeight <= 0 ? 0 : Math.min(scrollTop / documentHeight, 1);
      setProgress(nextProgress);
      frame = 0;
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const dialStart = -135;
  const dialEnd = 135;
  const angle = dialStart + progress * (dialEnd - dialStart);
  const speedValue = Math.round(progress * 220);

  const ticks = useMemo(
    () =>
      Array.from({ length: 11 }, (_, index) => {
        const tickAngle = dialStart + (index / 10) * (dialEnd - dialStart);
        const outer = polarToCartesian(70, 70, 48, tickAngle);
        const inner = polarToCartesian(70, 70, index % 2 === 0 ? 38 : 42, tickAngle);

        return {
          key: `tick-${index}`,
          x1: inner.x,
          y1: inner.y,
          x2: outer.x,
          y2: outer.y,
        };
      }),
    [],
  );

  const needleEnd = polarToCartesian(70, 70, 36, angle);
  const activeArc = describeArc(70, 70, 44, dialStart, angle);
  const baseArc = describeArc(70, 70, 44, dialStart, dialEnd);

  return (
    <div className="pointer-events-none fixed right-3 top-1/2 z-[70] -translate-y-1/2 sm:right-4 lg:right-5 hidden md:flex">
      <div className="flex h-[148px] w-[148px] items-center justify-center rounded-full border border-primary/16 bg-[rgba(10,10,10,0.72)] shadow-[0_16px_48px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <svg viewBox="0 0 140 140" className="h-[132px] w-[132px] overflow-visible">
          <defs>
            <linearGradient id="speedometerArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(212,175,55,0.2)" />
              <stop offset="100%" stopColor="rgba(232,200,74,1)" />
            </linearGradient>
          </defs>

          <circle cx="70" cy="70" r="58" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.04)" />

          <path d={baseArc} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" />
          <path d={activeArc} fill="none" stroke="url(#speedometerArc)" strokeWidth="6" strokeLinecap="round" />

          {ticks.map((tick) => (
            <line
              key={tick.key}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          ))}

          <text
            x="70"
            y="54"
            textAnchor="middle"
            fill="rgba(212,175,55,0.92)"
            fontSize="8"
            style={{ letterSpacing: "0.28em" }}
          >
            DRIVE
          </text>
          <text x="70" y="82" textAnchor="middle" fill="rgba(250,250,250,0.96)" fontSize="22" fontWeight="700">
            {speedValue}
          </text>
          <text
            x="70"
            y="95"
            textAnchor="middle"
            fill="rgba(255,255,255,0.36)"
            fontSize="7"
            style={{ letterSpacing: "0.24em" }}
          >
            SCROLL
          </text>

          <line
            x1="70"
            y1="70"
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke="rgba(232,200,74,0.98)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="70" cy="70" r="5.5" fill="rgba(232,200,74,1)" />
          <circle cx="70" cy="70" r="2.2" fill="rgba(10,10,10,0.9)" />
        </svg>
      </div>
    </div>
  );
}
