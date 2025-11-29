"use client";

import { useState } from "react";
import { FiltersPanel, FiltersState } from "./FiltersPanel";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

type FiltersDrawerDesktopProps = {
  onChange: (filters: FiltersState) => void;
};

export function FiltersDrawerDesktop({ onChange }: FiltersDrawerDesktopProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-y-24 left-0 z-30 hidden lg:block">
      {/* Wrapper przesuwający panel + uchwyt */}
      <div
        className={cn(
          "flex h-full transform transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%-46px)]"
        )}
      >
        {/* PANEL Z FILTRAMI */}
        <div
          className={cn(
            "relative h-full w-72 overflow-y-auto rounded-r-2xl border-r bg-card p-4 shadow-xl transition-shadow duration-200",
            isOpen ? "shadow-2xl" : "shadow-md"
          )}
        >
          {/* Delikatny gradient na krawędzi dla lepszego oddzielenia */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-background/60 to-transparent" />

          <FiltersPanel onChange={onChange} className="h-full" />
        </div>

        {/* UCHWYT PRZY PRAWEJ KRAWĘDZI PANELU */}
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Przełącz panel filtrów"
            aria-expanded={isOpen}
            className={cn(
              "flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-l-none rounded-r-2xl border-l-0 bg-background/95 text-xs shadow-md backdrop-blur transition-all duration-200",
              isOpen
                ? "bg-primary text-primary-foreground shadow-2xl"
                : "hover:bg-muted"
            )}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-[9px] font-medium leading-none">
              Filtry
            </span>
            <span className="sr-only">
              {isOpen ? "Zwiń filtry" : "Rozwiń filtry"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
