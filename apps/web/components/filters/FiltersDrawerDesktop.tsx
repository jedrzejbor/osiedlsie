"use client";

import { useState } from "react";
import { FiltersPanel, FiltersState } from "./FiltersPanel";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

type FiltersDrawerDesktopProps = {
  onChange: (filters: FiltersState) => void;
  activeFiltersCount?: number;
};

export function FiltersDrawerDesktop({
  onChange,
  activeFiltersCount = 0,
}: FiltersDrawerDesktopProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActive = activeFiltersCount > 0;

  return (
    <div className="fixed inset-y-24 left-0 z-30 hidden lg:block">
      {/* Wrapper przesuwający panel + uchwyt */}
      <div
        className={cn(
          "flex h-full transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%-46px)]"
        )}
      >
        {/* PANEL Z FILTRAMI */}
        <div
          className={cn(
            "relative h-full w-72 overflow-y-auto rounded-r-2xl border-r bg-card p-4 shadow-xl transition-all duration-300 ease-out",
            isOpen ? "shadow-2xl opacity-100 scale-100" : "shadow-md opacity-95 scale-[0.99]"
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
              "relative flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-l-none rounded-r-2xl border-l-0 bg-background/95 text-xs shadow-md backdrop-blur transition-all duration-200",
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

            {/* 🔢 Badge z liczbą aktywnych filtrów */}
            {hasActive && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold leading-none text-destructive-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
