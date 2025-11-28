"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils"; // jeśli masz util cn, jeśli nie – usuń i daj className jako string

type ListingGalleryProps = {
  images: string[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const allImages = images.length > 0 ? images : ["/images/hurtlink-dashboard.png"];
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultiple = allImages.length > 1;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div className="space-y-2">
      {/* GŁÓWNE ZDJĘCIE */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        <img
          src={allImages[currentIndex]}
          alt={title}
          className="h-full w-full object-cover"
        />

        {hasMultiple && (
          <>
            {/* Strzałki */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="pointer-events-auto h-8 w-8 rounded-full bg-background/70"
                onClick={goPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="pointer-events-auto h-8 w-8 rounded-full bg-background/70"
                onClick={goNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Kropeczki */}
            <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {allImages.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full bg-background/60",
                    index === currentIndex && "bg-primary"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* MINIATURY */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border",
                index === currentIndex ? "border-primary" : "border-border"
              )}
            >
              <img
                src={img}
                alt={`${title} miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
