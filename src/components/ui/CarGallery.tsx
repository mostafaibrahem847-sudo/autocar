"use client";

import { useState } from "react";

interface CarGalleryProps {
  images: string[];
  model: string;
}

export default function CarGallery({ images, model }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImageUrl = encodeURI(images[activeIndex]);

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-surface-light">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url("${activeImageUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm border border-foreground/10 flex items-center justify-center text-foreground hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm border border-foreground/10 flex items-center justify-center text-foreground hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
              activeIndex === i
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url("${encodeURI(img)}")` }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
