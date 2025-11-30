"use client";

import { useState } from "react";
import { filtersConfig, ListingType } from "./filtersConfig";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

export type FiltersState = {
  province: string;
  minPrice?: number;
  maxPrice?: number;
  minPlotArea?: number;
  maxPlotArea?: number;
  listingType?: ListingType | "ALL";
  tags: string[];
};

export const defaultFiltersState: FiltersState = {
  province: "Dowolne",
  listingType: "ALL",
  tags: [],
  minPrice: undefined,
  maxPrice: undefined,
  minPlotArea: undefined,
  maxPlotArea: undefined,
};

type FiltersPanelProps = {
  // na później: callback do wołania API / aktualizacji URL
  onChange?: (filters: FiltersState) => void;
  className?: string;
};

export function FiltersPanel({ onChange, className }: FiltersPanelProps) {
  const [filters, setFilters] = useState<FiltersState>(defaultFiltersState);

  function updateFilters(partial: Partial<FiltersState>) {
    const next = { ...filters, ...partial };
    setFilters(next);
    onChange?.(next);
  }

  const toggleTag = (value: string, checked: boolean | "indeterminate") => {
    const arr = new Set(filters.tags);
    if (checked) {
      arr.add(value);
    } else {
      arr.delete(value);
    }
    const tags = Array.from(arr);
    updateFilters({ tags });
  };

  return (
    <aside 
      // className="hidden w-72 flex-shrink-0 rounded-xl border bg-card p-4 shadow-sm md:block"
      className={cn(
        "rounded-xl border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Filtry
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => updateFilters(defaultFiltersState)}
        >
          Wyczyść
        </Button>
      </div>

      <div className="space-y-4 text-sm">
        {/* Województwo */}
        <div className="space-y-1">
          <Label className="text-xs uppercase text-muted-foreground">
            Województwo
          </Label>
          <Select
            value={filters.province}
            onValueChange={(value) => updateFilters({ province: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz województwo" />
            </SelectTrigger>
            <SelectContent>
              {filtersConfig.provinces.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cena */}
        <div className="space-y-1">
          <Label className="text-xs uppercase text-muted-foreground">
            Cena (zł)
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`${filtersConfig.price.min}`}
              className="h-9"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                updateFilters({
                  minPrice: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
            <Input
              type="number"
              placeholder={`${filtersConfig.price.max}`}
              className="h-9"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                updateFilters({
                  maxPrice: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        {/* Powierzchnia działki */}
        <div className="space-y-1">
          <Label className="text-xs uppercase text-muted-foreground">
            Powierzchnia działki (m²)
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`${filtersConfig.plotArea.min}`}
              className="h-9"
              value={filters.minPlotArea ?? ""}
              onChange={(e) =>
                updateFilters({
                  minPlotArea: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
            <Input
              type="number"
              placeholder={`${filtersConfig.plotArea.max}`}
              className="h-9"
              value={filters.maxPlotArea ?? ""}
              onChange={(e) =>
                updateFilters({
                  maxPlotArea: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        {/* Typ ogłoszenia */}
        <div className="space-y-1">
          <Label className="text-xs uppercase text-muted-foreground">
            Typ nieruchomości
          </Label>
          <Select
            value={filters.listingType}
            onValueChange={(value) =>
              updateFilters({
                listingType: value as ListingType | "ALL",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Wszystkie typy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Wszystkie typy</SelectItem>
              {filtersConfig.listingTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tagi */}
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground">
            Cechy siedliska
          </Label>
          <div className="space-y-1">
            {filtersConfig.tags.map((tag) => {
              const checked = filters.tags.includes(tag.value);
              return (
                <label
                  key={tag.value}
                  className="flex cursor-pointer items-center gap-2 text-xs"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(val) => toggleTag(tag.value, val)}
                  />
                  <span>{tag.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
