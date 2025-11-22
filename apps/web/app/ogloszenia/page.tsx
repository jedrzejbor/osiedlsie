// import { ListingCard } from "@/components/cardListing/ListingCard";
// import { FiltersPanel } from "@/components/filters/FiltersPanel";

// const mockListings = [
//   {
//     title: "Siedlisko pod lasem, 1.2 ha, strumyk na działce",
//     location: "Podkarpackie, pow. sanocki",
//     price: "420 000 zł",
//     plotArea: "12 000 m²",
//     houseArea: "80 m²",
//     tags: ["przy lesie", "bez sąsiadów 300 m"],
//   },
//   {
//     title: "Działka pod siedlisko przy ścianie lasu",
//     location: "Warmińsko-Mazurskie, okolice Mrągowa",
//     price: "260 000 zł",
//     plotArea: "8 500 m²",
//     tags: ["przy lesie"],
//   },
//   {
//     title: "Stare siedlisko do remontu, pagórkowaty teren",
//     location: "Lubelskie, Roztocze",
//     price: "350 000 zł",
//     plotArea: "10 000 m²",
//     houseArea: "90 m²",
//     tags: ["do remontu", "widok na las"],
//   },
// ];

// export default function ListingsPage() {
//   return (
//     <main className="min-h-screen bg-background">
//       <section className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
//         {/* Lewa kolumna – filtry */}
//         <FiltersPanel />


//         {/* Prawa kolumna – lista ogłoszeń */}
//         <div className="flex-1 space-y-4">
//           <header className="space-y-1">
//             <h1 className="text-2xl font-semibold tracking-tight">
//               Ogłoszenia siedlisk i działek pod lasem
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               Przeglądaj oferty siedlisk, domów i działek położonych przy lesie.
//             </p>
//           </header>

//           <div className="flex flex-col gap-4">
//             {mockListings.map((listing) => (
//               <ListingCard key={listing.title} {...listing} />
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }


"use client";

import { useMemo, useState } from "react";
import { ListingCard } from "@/components/cardListing/ListingCard";
import { FiltersPanel } from "@/components/filters/FiltersPanel";
import { filtersConfig, ListingType } from "@/components/filters/filtersConfig";
import type { FiltersState } from "@/components/filters/FiltersPanel";

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

// domyślne filtry (musi być spójne z FiltersPanel)
const defaultFilters: FiltersState = {
  province: "Dowolne",
  listingType: "ALL",
  tags: [],
};

export default function ListingsPage() {
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

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
        priceLabel: `${listing.price.toLocaleString("pl-PL")} zł`,
        plotAreaLabel: `${listing.plotArea.toLocaleString("pl-PL")} m²`,
        houseAreaLabel: listing.houseArea
          ? `${listing.houseArea.toLocaleString("pl-PL")} m²`
          : undefined,
        tagsLabels: listing.tags
          .map((tag) => tagLabelMap[tag] ?? tag)
          .filter(Boolean),
      })),
    [filteredListings]
  );

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        {/* Lewa kolumna – filtry */}
        <FiltersPanel onChange={setFilters} />

        {/* Prawa kolumna – lista ogłoszeń */}
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

          <div className="flex flex-col gap-4">
            {listingsForUi.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                location={listing.location}
                price={listing.priceLabel}
                plotArea={listing.plotAreaLabel}
                houseArea={listing.houseAreaLabel}
                tags={listing.tagsLabels}
              />
            ))}

            {listingsForUi.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Brak ogłoszeń spełniających wybrane kryteria.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
