"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ParticleInstance = {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;
  draw: () => void;
  update: () => void;
};

interface AetherCanvasProps {
  className?: string;
  particleColor?: string;
  connectionColor?: string;
  hoverConnectionColor?: string;
  backgroundColor?: string;
  density?: number;
  distribution?: "full" | "edges";
  mouseEnabled?: boolean;
}

function AetherCanvas({
  className,
  particleColor = "rgba(212, 175, 55, 0.65)",
  connectionColor = "rgba(232, 200, 74, 0.24)",
  hoverConnectionColor = "rgba(255, 248, 230, 0.55)",
  backgroundColor = "#0a0a0a",
  density,
  distribution = "full",
  mouseEnabled = true,
}: AetherCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const canvasEl: HTMLCanvasElement = canvas;
    const containerEl: HTMLDivElement = container;

    const context = canvasEl.getContext("2d");

    if (!context) {
      return;
    }

    const ctx: CanvasRenderingContext2D = context;

    let animationFrameId = 0;
    let particles: ParticleInstance[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const edgeZones = [
      { xMin: 0.03, xMax: 0.14, yMin: 0.06, yMax: 0.18 },
      { xMin: 0.18, xMax: 0.3, yMin: 0.1, yMax: 0.24 },
      { xMin: 0.7, xMax: 0.82, yMin: 0.08, yMax: 0.22 },
      { xMin: 0.86, xMax: 0.97, yMin: 0.05, yMax: 0.18 },
      { xMin: 0.04, xMax: 0.16, yMin: 0.28, yMax: 0.42 },
      { xMin: 0.22, xMax: 0.34, yMin: 0.3, yMax: 0.44 },
      { xMin: 0.66, xMax: 0.78, yMin: 0.28, yMax: 0.42 },
      { xMin: 0.82, xMax: 0.96, yMin: 0.3, yMax: 0.44 },
      { xMin: 0.05, xMax: 0.18, yMin: 0.74, yMax: 0.92 },
      { xMin: 0.18, xMax: 0.32, yMin: 0.8, yMax: 0.94 },
      { xMin: 0.28, xMax: 0.4, yMin: 0.62, yMax: 0.76 },
      { xMin: 0.36, xMax: 0.46, yMin: 0.44, yMax: 0.58 },
      { xMin: 0.43, xMax: 0.49, yMin: 0.58, yMax: 0.68 },
      { xMin: 0.51, xMax: 0.57, yMin: 0.58, yMax: 0.68 },
      { xMin: 0.54, xMax: 0.64, yMin: 0.44, yMax: 0.58 },
      { xMin: 0.6, xMax: 0.72, yMin: 0.62, yMax: 0.76 },
      { xMin: 0.68, xMax: 0.82, yMin: 0.78, yMax: 0.94 },
      { xMin: 0.84, xMax: 0.98, yMin: 0.72, yMax: 0.94 },
    ];

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
          if (this.x > canvasEl.width || this.x < 0) {
            this.directionX = -this.directionX;
          }

        if (this.y > canvasEl.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 3.2;
            this.y -= forceDirectionY * force * 3.2;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const getCanvasMetrics = () => {
      const rect = containerEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvasEl.width = rect.width * dpr;
      canvasEl.height = rect.height * dpr;
      canvasEl.style.width = `${rect.width}px`;
      canvasEl.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      particles = [];

      const width = containerEl.clientWidth;
      const height = containerEl.clientHeight;
      const area = width * height;
      const numberOfParticles = prefersReducedMotion
        ? 14
        : density ?? Math.max(18, Math.min(42, Math.floor(area / 18000)));

      for (let i = 0; i < numberOfParticles; i += 1) {
        const size = distribution === "edges" ? Math.random() * 1.3 + 0.8 : Math.random() * 1.8 + 0.8;
        let x = Math.random() * Math.max(width - size * 4, 1) + size * 2;
        let y = Math.random() * Math.max(height - size * 4, 1) + size * 2;

        if (distribution === "edges") {
          const zone = edgeZones[i % edgeZones.length];
          x = width * (zone.xMin + Math.random() * (zone.xMax - zone.xMin));
          y = height * (zone.yMin + Math.random() * (zone.yMax - zone.yMin));
        }

        const directionX = Math.random() * 0.12 - 0.06;
        const directionY = Math.random() * 0.12 - 0.06;

        particles.push(new Particle(x, y, directionX, directionY, size, particleColor));
      }
    };

    const resizeCanvas = () => {
      getCanvasMetrics();
      init();
    };

    const connect = () => {
      const width = containerEl.clientWidth;
      const height = containerEl.clientHeight;
      const threshold = distribution === "edges" ? (width / 12.5) * (height / 10.5) : (width / 6.5) * (height / 6.5);

      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a; b < particles.length; b += 1) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;

          if (distance < threshold) {
            const opacityValue = Math.max(0.04, 1 - distance / 22000);

            if (mouseEnabled && mouse.x !== null && mouse.y !== null) {
              const dxMouse = particles[a].x - mouse.x;
              const dyMouse = particles[a].y - mouse.y;
              const distanceToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

              ctx.strokeStyle =
                distanceToMouse < mouse.radius
                  ? hoverConnectionColor.replace("0.55", opacityValue.toFixed(3))
                  : connectionColor.replace("0.24", Math.min(opacityValue, 0.24).toFixed(3));
            } else {
              ctx.strokeStyle = connectionColor.replace("0.24", Math.min(opacityValue, 0.24).toFixed(3));
            }

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

      const animate = () => {
        animationFrameId = window.requestAnimationFrame(animate);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, containerEl.clientWidth, containerEl.clientHeight);

      for (let i = 0; i < particles.length; i += 1) {
        particles[i].update();
      }

      connect();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!mouseEnabled) {
        return;
      }

      const rect = containerEl.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(containerEl);

    containerEl.addEventListener("pointermove", handlePointerMove);
    containerEl.addEventListener("pointerleave", handlePointerLeave);

    resizeCanvas();
    animate();

    return () => {
      resizeObserver.disconnect();
      containerEl.removeEventListener("pointermove", handlePointerMove);
      containerEl.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [backgroundColor, connectionColor, density, distribution, hoverConnectionColor, mouseEnabled, particleColor]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute left-0 top-0 h-full w-full" />
    </div>
  );
}

export function AetherFlowBackground({
  className,
  density,
  distribution = "full",
  mouseEnabled = true,
  particleColor,
  connectionColor,
  hoverConnectionColor,
}: {
  className?: string;
  density?: number;
  distribution?: "full" | "edges";
  mouseEnabled?: boolean;
  particleColor?: string;
  connectionColor?: string;
  hoverConnectionColor?: string;
}) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <AetherCanvas
        density={density}
        distribution={distribution}
        mouseEnabled={mouseEnabled}
        particleColor={particleColor}
        connectionColor={connectionColor}
        hoverConnectionColor={hoverConnectionColor}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(232,200,74,0.16),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(232,200,74,0.14),transparent_22%),radial-gradient(circle_at_24%_82%,rgba(232,200,74,0.12),transparent_20%),radial-gradient(circle_at_80%_78%,rgba(232,200,74,0.14),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08)_0%,rgba(10,10,10,0.24)_100%)]" />
    </div>
  );
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2 + 0.5,
      duration: 0.8,
      ease: "easeInOut" as const,
    },
  }),
};

export default function AetherFlowHero() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <AetherFlowBackground />

      <div className="relative z-10 p-6 text-center">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <Zap className="h-4 w-4 text-primary-light" />
          <span className="text-sm font-medium text-foreground/80">Dynamic Rendering Engine</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-5xl font-bold tracking-tighter text-transparent md:text-8xl"
        >
          Aether Flow
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mb-10 max-w-2xl text-lg text-foreground/58"
        >
          An intelligent, adaptive framework for creating fluid digital experiences that feel alive
          and respond to user interaction in real-time.
        </motion.p>

        <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
          <button className="mx-auto flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-black shadow-lg transition-colors duration-300 hover:bg-gray-200">
            Explore the Engine
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
