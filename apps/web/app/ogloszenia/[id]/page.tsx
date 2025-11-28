import { notFound } from "next/navigation";
import { ListingGallery } from "@/components/listing/ListingGallery";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { filtersConfig, ListingType } from "@/components/filters/filtersConfig";

// Ten sam typ co w liście
type Listing = {
  id: number;
  title: string;
  province: string;
  location: string;
  price: number;
  plotArea: number;
  houseArea?: number;
  type: ListingType;
  tags: string[];
  images: string[];
  createdAtLabel: string;
};

// Tymczasowe mocki – docelowo z backendu
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
    images: [
      "/images/first.jpg",
      "/images/second.jpg",
      "/images/third.jpg",
    ],
    createdAtLabel: "Dodano: 2 dni temu",
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
    images: ["/images/second.jpg"],
    createdAtLabel: "Dodano: 5 dni temu",
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
    images: ["/images/third.jpg"],
    createdAtLabel: "Dodano: 1 dzień temu",
  },
];

const tagLabelMap = Object.fromEntries(
  filtersConfig.tags.map((t) => [t.value, t.label])
);

const typeLabelMap: Record<ListingType, string> = {
  SIEDLISKO: "Siedlisko",
  DZIALKA: "Działka pod siedlisko",
  DOM_DZIALKA: "Dom + działka",
};

type PageProps = {
  params: { id: string };
};

export default async function ListingDetailsPage({ params }: PageProps) {
  const param = await params;
  const id = Number(param.id);
  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    notFound();
  }

  const fullLocation = `${listing.province}, ${listing.location}`;

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-8 pb-24 lg:pb-8">
        {/* Nagłówek */}
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Ogłoszenia / {listing.province} / {typeLabelMap[listing.type]}
          </p>
          <h1 className="text-2xl font-semibold leading-snug tracking-tight">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{fullLocation}</span>
            <span>•</span>
            <span>{listing.createdAtLabel}</span>
          </div>
        </header>

        {/* Główna kolumna: galeria + szczegóły */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Lewa część – galeria + box z ceną + opis + parametry */}
          <div className="space-y-6">
            <ListingGallery images={listing.images} title={listing.title} />

            {/* BOX POD GALERIĄ – tytuł + miejscowość + cena */}
            <Card className="p-4 space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold leading-snug">
                    {listing.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {fullLocation}
                  </p>
                </div>

                <div className="space-y-0.5 text-right">
                  <p className="text-2xl font-bold text-primary">
                    {listing.price} zł
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Działka {listing.plotArea} m²
                    {listing.houseArea ? ` • dom ${listing.houseArea} m²` : ""}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h2 className="text-sm font-semibold">Parametry siedliska</h2>
              <dl className="grid gap-2 text-sm md:grid-cols-2">
                <div className="space-y-0.5">
                  <dt className="text-muted-foreground">Typ nieruchomości</dt>
                  <dd>{typeLabelMap[listing.type]}</dd>
                </div>
                <div className="space-y-0.5">
                  <dt className="text-muted-foreground">Powierzchnia działki</dt>
                  <dd>{listing.plotArea} m²</dd>
                </div>
                {listing.houseArea && (
                  <div className="space-y-0.5">
                    <dt className="text-muted-foreground">Powierzchnia domu</dt>
                    <dd>{listing.houseArea} m²</dd>
                  </div>
                )}
                <div className="space-y-0.5">
                  <dt className="text-muted-foreground">Województwo</dt>
                  <dd>{listing.province}</dd>
                </div>
              </dl>

              {listing.tags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cechy siedliska</p>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        {tagLabelMap[tag] ?? tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 space-y-3">
              <h2 className="text-sm font-semibold">Opis ogłoszenia</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {`Tu później wstawimy pełny opis z backendu. Na razie to mock: siedlisko położone w spokojnej okolicy, przy ścianie lasu, z dobrym dojazdem i dostępem do mediów. Idealne miejsce na ucieczkę z miasta.`}
              </p>
            </Card>
          </div>

          {/* Prawa część – tylko kontakt (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-1">
              <Card className="p-4 space-y-3">
                <Button className="w-full">
                  Pokaż telefon
                </Button>
                <Button variant="outline" className="w-full">
                  Napisz wiadomość
                </Button>

                <p className="text-[11px] text-muted-foreground">
                  Po kontakcie przez platformę zachowasz historię wiadomości w swoim koncie.
                </p>
              </Card>
            </div>
          </aside>
        </div>
        {/* Pasek kontaktu przyklejony do dołu na mobile */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 px-4 py-2 shadow-[0_-4px_10px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl gap-2">
            <Button className="w-1/2">
              Telefon
            </Button>
            <Button variant="outline" className="w-1/2">
              Wiadomość
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
