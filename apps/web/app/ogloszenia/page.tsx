"use client";

import { useMemo, useState } from "react";
import { ListingCard } from "@/components/cardListing/ListingCard";
import { filtersConfig, ListingType } from "@/components/filters/filtersConfig";
import {
  FiltersPanel,
  type FiltersState,
  defaultFiltersState,
} from "@/components/filters/FiltersPanel";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { FiltersDrawerDesktop } from "@/components/filters/FiltersDrawerDesktop";

type Listing = {
  id: number;
  title: string;
  province: string;
  location: string; // np. "pow. sanocki"
  price: number; // w zł
  plotArea: number; // w m2
  houseArea?: number; // w m2
  type: ListingType;
  tags: string[]; // wartości z filtersConfig.tags.value
};

// 🔹 Docelowo to przyjdzie z backendu (Nest + Postgres)
const mockListings: Listing[] = [
  {
    id: 1,
    title: "Siedlisko pod lasem, 1.2 ha, strumyk na działce",
    province: "Podkarpackie",
    location: "pow. sanocki",
    price: 420000,
    plotArea: 12000,
    houseArea: 80,
    type: "SIEDLISKO",
    tags: ["PRZY_LESIE", "BEZ_SASIADOW"],
  },
  {
    id: 2,
    title: "Działka pod siedlisko przy ścianie lasu",
    province: "Warmińsko-Mazurskie",
    location: "okolice Mrągowa",
    price: 260000,
    plotArea: 8500,
    type: "DZIALKA",
    tags: ["PRZY_LESIE"],
  },
  {
    id: 3,
    title: "Stare siedlisko do remontu, pagórkowaty teren",
    province: "Lubelskie",
    location: "Roztocze",
    price: 350000,
    plotArea: 10000,
    houseArea: 90,
    type: "SIEDLISKO",
    tags: ["DO_REMONTU", "WIDOK_NA_LAS"],
  },
];

// mapa tag -> label na potrzeby ładnego wyświetlania w ListingCard
const tagLabelMap = Object.fromEntries(
  filtersConfig.tags.map((t) => [t.value, t.label])
);

const countActiveFilters = (
  filters: FiltersState,
  defaults: FiltersState
): number => {
  let count = 0;

  (Object.keys(defaults) as (keyof FiltersState)[]).forEach((key) => {
    const current = filters[key];
    const def = defaults[key];

    // Porównanie tablic (np. tags)
    if (Array.isArray(current) || Array.isArray(def)) {
      const curArr = (current as unknown[]) ?? [];
      const defArr = (def as unknown[]) ?? [];

      if (
        curArr.length !== defArr.length ||
        curArr.some((v, i) => v !== defArr[i])
      ) {
        count++;
      }
      return;
    }

    // Zwykłe porównanie wartości (string, number, undefined)
    if (current !== def) {
      count++;
    }
  });

  return count;
};


export default function ListingsPage() {
  const [filters, setFilters] = useState<FiltersState>(defaultFiltersState);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const activeFiltersCount = useMemo(
    () => countActiveFilters(filters, defaultFiltersState),
    [filters]
  );

  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      // 1) województwo
      if (
        filters.province &&
        filters.province !== "Dowolne" &&
        listing.province !== filters.province
      ) {
        return false;
      }

      // 2) typ nieruchomości
      if (filters.listingType !== "ALL" && listing.type !== filters.listingType) {
        return false;
      }

      // 3) cena min / max
      if (
        typeof filters.minPrice === "number" &&
        listing.price < filters.minPrice
      ) {
        return false;
      }

      if (
        typeof filters.maxPrice === "number" &&
        listing.price > filters.maxPrice
      ) {
        return false;
      }

      // 4) powierzchnia działki
      if (
        typeof filters.minPlotArea === "number" &&
        listing.plotArea < filters.minPlotArea
      ) {
        return false;
      }

      if (
        typeof filters.maxPlotArea === "number" &&
        listing.plotArea > filters.maxPlotArea
      ) {
        return false;
      }

      // 5) tagi – wymagamy, żeby ogłoszenie miało wszystkie wybrane tagi
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) =>
          listing.tags.includes(tag)
        );
        if (!hasAllTags) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // przygotowanie danych pod ListingCard
  const listingsForUi = useMemo(
    () =>
      filteredListings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        location: `${listing.province}, ${listing.location}`,
        priceLabel: `${listing.price} zł`,
        plotAreaLabel: `${listing.plotArea} m²`,
        houseAreaLabel: listing.houseArea
          ? `${listing.houseArea} m²`
          : undefined,
        tagsLabels: listing.tags
          .map((tag) => tagLabelMap[tag] ?? tag)
          .filter(Boolean),
        images: [
          "/images/first.jpg",
          "/images/second.jpg",
          "/images/third.jpg",
        ],
        createdAtLabel: "Dodano: 2 dni temu",
      })),
    [filteredListings]
  );

  return (
    <main className="min-h-screen bg-background">
      <FiltersDrawerDesktop 
        onChange={setFilters} 
        activeFiltersCount={activeFiltersCount}
      />
      <section className="mx-auto flex max-w-6xl px-4 py-8">
        {/* Prawa kolumna – lista ogłoszeń (na całą szerokość) */}
        <div className="flex-1 space-y-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Ogłoszenia siedlisk i działek pod lasem
            </h1>
            <p className="text-sm text-muted-foreground">
              Przeglądaj oferty siedlisk, domów i działek położonych przy lesie.
            </p>
            <p className="text-xs text-muted-foreground">
              Znaleziono{" "}
              <span className="font-semibold">{listingsForUi.length}</span>{" "}
              ogłoszeń
            </p>
          </header>

          {/* Przycisk filtrów na mobile */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setIsFiltersOpen(true)}
            >
              Filtry
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {listingsForUi.map((listing) => (
              <Link
                key={listing.id}
                href={`/ogloszenia/${listing.id}`}
                className="block"
              >
                <ListingCard
                  title={listing.title}
                  location={listing.location}
                  price={listing.priceLabel}
                  plotArea={listing.plotAreaLabel}
                  houseArea={listing.houseAreaLabel}
                  tags={listing.tagsLabels}
                  images={listing.images}
                  createdAtLabel={listing.createdAtLabel}
                />
              </Link>
            ))}

            {listingsForUi.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Brak ogłoszeń spełniających wybrane kryteria.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Overlay filtrów na mobile */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl bg-background p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Filtry</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFiltersOpen(false)}
              >
                ✕
              </Button>
            </div>

            <div className="overflow-y-auto pr-1">
              <FiltersPanel
                onChange={(f) => setFilters(f)}
                className="w-full border-0 shadow-none"
              />
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setIsFiltersOpen(false)}
              >
                Zamknij
              </Button>
              <Button
                className="w-1/2"
                onClick={() => setIsFiltersOpen(false)}
              >
                Pokaż wyniki
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
