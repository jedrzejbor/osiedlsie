"use client";

import { useEffect, useMemo, useState } from "react";
import { ListingCard } from "@/components/cardListing/ListingCard";
import { ListingSkeleton } from "@/components/cardListing/ListingSkeleton";
import { filtersConfig, ListingType } from "@/components/filters/filtersConfig";
import {
  FiltersPanel,
  type FiltersState,
  defaultFiltersState,
} from "@/components/filters/FiltersPanel";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { FiltersDrawerDesktop } from "@/components/filters/FiltersDrawerDesktop";
import {
  listingsService,
  type Listing,
} from "@/lib/services/listings.service";

// Mapowanie typów z backendu na frontend
const backendToFrontendType: Record<string, ListingType> = {
  dom: "DOM_DZIALKA",
  dzialka: "DZIALKA",
  dom_z_dzialka: "DOM_DZIALKA",
  siedlisko: "SIEDLISKO",
  gospodarstwo: "SIEDLISKO",
};

// Mapowanie cech z backendu na frontend (tagi)
const backendToFrontendTag: Record<string, string> = {
  przy_lesie: "PRZY_LESIE",
  bez_sasiadow_300m: "BEZ_SASIADOW",
  do_remontu: "DO_REMONTU",
  gotowe_do_zamieszkania: "GOTOWE",
  z_widokiem: "WIDOK_NA_LAS",
  przy_jeziorze: "PRZY_JEZIORZE",
  przy_rzece: "PRZY_RZECE",
  media_w_dzialce: "MEDIA",
  droga_asfaltowa: "DROGA_ASFALTOWA",
  okolica_spokojna: "SPOKOJNA_OKOLICA",
};

// Mapowanie województw z backendu na frontend
const wojewodztwoToProvince: Record<string, string> = {
  dolnośląskie: "Dolnośląskie",
  "kujawsko-pomorskie": "Kujawsko-Pomorskie",
  lubelskie: "Lubelskie",
  lubuskie: "Lubuskie",
  łódzkie: "Łódzkie",
  małopolskie: "Małopolskie",
  mazowieckie: "Mazowieckie",
  opolskie: "Opolskie",
  podkarpackie: "Podkarpackie",
  podlaskie: "Podlaskie",
  pomorskie: "Pomorskie",
  śląskie: "Śląskie",
  świętokrzyskie: "Świętokrzyskie",
  "warmińsko-mazurskie": "Warmińsko-Mazurskie",
  wielkopolskie: "Wielkopolskie",
  zachodniopomorskie: "Zachodniopomorskie",
};

// Mapa tag -> label na potrzeby ładnego wyświetlania w ListingCard
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

    if (current !== def) {
      count++;
    }
  });

  return count;
};

// Formatowanie daty
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Dodano: dzisiaj";
  if (diffDays === 1) return "Dodano: wczoraj";
  if (diffDays < 7) return `Dodano: ${diffDays} dni temu`;
  if (diffDays < 30) return `Dodano: ${Math.floor(diffDays / 7)} tyg. temu`;
  return `Dodano: ${date.toLocaleDateString("pl-PL")}`;
};

// Formatowanie ceny
const formatPrice = (price: number | null): string => {
  if (!price) return "Cena do negocjacji";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(price);
};

// Formatowanie powierzchni
const formatArea = (area: number | null): string | undefined => {
  if (!area) return undefined;
  return `${area.toLocaleString("pl-PL")} m²`;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>(defaultFiltersState);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Fetch ogłoszeń z API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await listingsService.getAll();
        setListings(data);
      } catch (err: any) {
        console.error("Błąd pobierania ogłoszeń:", err);
        setError(err.response?.data?.message || "Nie udało się pobrać ogłoszeń");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const activeFiltersCount = useMemo(
    () => countActiveFilters(filters, defaultFiltersState),
    [filters]
  );

  // Filtrowanie ogłoszeń (po stronie klienta)
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const province = listing.wojewodztwo
        ? wojewodztwoToProvince[listing.wojewodztwo] || listing.wojewodztwo
        : null;

      if (
        filters.province &&
        filters.province !== "Dowolne" &&
        province !== filters.province
      ) {
        return false;
      }

      const frontendType = listing.propertyType
        ? backendToFrontendType[listing.propertyType]
        : null;

      if (filters.listingType !== "ALL" && frontendType !== filters.listingType) {
        return false;
      }

      const price = listing.price ? Number(listing.price) : 0;

      if (typeof filters.minPrice === "number" && price < filters.minPrice) {
        return false;
      }

      if (typeof filters.maxPrice === "number" && price > filters.maxPrice) {
        return false;
      }

      const plotArea = listing.plotSize || 0;

      if (
        typeof filters.minPlotArea === "number" &&
        plotArea < filters.minPlotArea
      ) {
        return false;
      }

      if (
        typeof filters.maxPlotArea === "number" &&
        plotArea > filters.maxPlotArea
      ) {
        return false;
      }

      if (filters.tags.length > 0) {
        const listingTags = (listing.features || []).map(
          (f) => backendToFrontendTag[f] || f
        );
        const hasAllTags = filters.tags.every((tag) =>
          listingTags.includes(tag)
        );
        if (!hasAllTags) {
          return false;
        }
      }

      return true;
    });
  }, [listings, filters]);

  // Przygotowanie danych pod ListingCard
  const listingsForUi = useMemo(
    () =>
      filteredListings.map((listing) => {
        const province = listing.wojewodztwo
          ? wojewodztwoToProvince[listing.wojewodztwo] || listing.wojewodztwo
          : "";
        const city = listing.city || "";
        const location = [province, city].filter(Boolean).join(", ");

        const tagsLabels = (listing.features || [])
          .map((f) => {
            const frontendTag = backendToFrontendTag[f];
            return frontendTag ? tagLabelMap[frontendTag] : null;
          })
          .filter(Boolean) as string[];

        const images =
          listing.images && listing.images.length > 0
            ? listing.images
                .sort((a, b) => a.order - b.order)
                .map((img) => `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}${img.path}`)
            : ["/images/placeholder.jpg"];

        return {
          id: listing.id,
          title: listing.title || "Bez tytułu",
          location,
          priceLabel: formatPrice(listing.price ? Number(listing.price) : null),
          plotAreaLabel: formatArea(listing.plotSize),
          houseAreaLabel: formatArea(listing.houseSize),
          tagsLabels,
          images,
          createdAtLabel: formatDate(listing.publishedAt || listing.createdAt),
        };
      }),
    [filteredListings]
  );

  return (
    <main className="min-h-screen bg-background">
      <FiltersDrawerDesktop
        onChange={setFilters}
        activeFiltersCount={activeFiltersCount}
      />
      <section className="mx-auto flex max-w-6xl px-4 py-8">
        <div className="flex-1 space-y-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Ogłoszenia siedlisk i działek pod lasem
            </h1>
            <p className="text-sm text-muted-foreground">
              Przeglądaj oferty siedlisk, domów i działek położonych przy lesie.
            </p>
            {!isLoading && (
              <p className="text-xs text-muted-foreground">
                Znaleziono{" "}
                <span className="font-semibold">{listingsForUi.length}</span>{" "}
                ogłoszeń
              </p>
            )}
          </header>

          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setIsFiltersOpen(true)}
            >
              Filtry
              {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
            </Button>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-4">
              <ListingSkeleton />
              <ListingSkeleton />
              <ListingSkeleton />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {!isLoading && !error && (
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
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Brak ogłoszeń spełniających wybrane kryteria.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2"
                    onClick={() => setFilters(defaultFiltersState)}
                  >
                    Wyczyść filtry
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

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
