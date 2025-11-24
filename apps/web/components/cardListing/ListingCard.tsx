"use client";

import { useState } from "react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ListingCardProps = {
  title: string;
  location: string;
  price: string;
  plotArea: string;
  houseArea?: string;
  tags?: string[];
  imageUrl?: string;      // pojedyncze zdjęcie (fallback)
  images?: string[];      // karuzela zdjęć
};

export function ListingCard({
  title,
  location,
  price,
  plotArea,
  houseArea,
  tags = [],
  imageUrl = "/images/hurtlink-dashboard.png",
  images,
}: ListingCardProps) {

  // jeśli mamy tablicę zdjęć, używamy jej; inaczej jedno zdjęcie
  const allImages = images && images.length > 0 ? images : [imageUrl];
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultipleImages = allImages.length > 1;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <Card className="w-full overflow-hidden border bg-card">
      <div className="flex gap-4">
        {/* LEWA STRONA – ZDJĘCIE (KWADRAT) Z KARUZELOM */}
        <div className="flex-shrink-0">
          <div className="relative aspect-square w-28 md:w-36 lg:w-80 h-full overflow-hidden rounded-lg bg-muted">
            <img
              src={allImages[currentIndex]}
              alt={title}
              className="h-full w-full object-cover"
            />

            {hasMultipleImages && (
              <>
                {/* Strzałki lewo/prawo */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="pointer-events-auto h-7 w-7 rounded-full bg-background/70"
                    onClick={goPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="pointer-events-auto h-7 w-7 rounded-full bg-background/70"
                    onClick={goNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Kropeczki do wskazania pozycji */}
                <div className="pointer-events-none absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1">
                  {allImages.map((_, index) => (
                    <span
                      key={index}
                      className={[
                        "h-1.5 w-1.5 rounded-full bg-background/60",
                        index === currentIndex && "bg-primary",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* PRAWA STRONA – TREŚĆ OGŁOSZENIA */}
        <div className="flex flex-1 flex-col justify-between py-6 pr-3">
          {/* Tytuł + lokalizacja */}
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {location}
            </p>
          </div>

          {/* Tagi (cechy siedliska) */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] uppercase tracking-wide"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Cena + powierzchnie */}
          <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-lg font-bold text-primary">
                {price}
              </p>
              <p className="text-xs text-muted-foreground">
                Działka {plotArea}
                {houseArea ? ` • dom ${houseArea}` : ""}
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Siedlisko • ogłoszenie prywatne
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
