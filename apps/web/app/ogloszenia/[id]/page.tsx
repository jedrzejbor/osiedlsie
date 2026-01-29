import { notFound } from "next/navigation";
import { ListingGallery } from "@/components/listing/ListingGallery";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

// Typy z backendu
interface ListingImage {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  order: number;
}

interface Listing {
  id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  city: string | null;
  wojewodztwo: string | null;
  propertyType: string | null;
  advertiserType: string | null;
  plotSize: number | null;
  houseSize: number | null;
  features: string[];
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  negotiable: boolean;
  status: "draft" | "published" | "archived";
  userId: string;
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Mapowanie województw
const wojewodztwoLabels: Record<string, string> = {
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

// Mapowanie typów nieruchomości
const propertyTypeLabels: Record<string, string> = {
  dom: "Dom",
  dzialka: "Działka",
  dom_z_dzialka: "Dom z działką",
  siedlisko: "Siedlisko",
  gospodarstwo: "Gospodarstwo rolne",
};

// Mapowanie cech
const featureLabels: Record<string, string> = {
  przy_lesie: "Przy lesie",
  bez_sasiadow_300m: "Bez sąsiadów w promieniu 300m",
  do_remontu: "Do remontu",
  gotowe_do_zamieszkania: "Gotowe do zamieszkania",
  z_widokiem: "Z widokiem",
  przy_jeziorze: "Przy jeziorze",
  przy_rzece: "Przy rzece",
  media_w_dzialce: "Media w działce",
  droga_asfaltowa: "Droga asfaltowa",
  okolica_spokojna: "Spokojna okolica",
};

// Mapowanie typów ogłoszeniodawców
const advertiserTypeLabels: Record<string, string> = {
  prywatny: "Osoba prywatna",
  firma: "Firma",
  agencja: "Agencja nieruchomości",
};

// Formatowanie ceny
const formatPrice = (price: number | null): string => {
  if (!price) return "Cena do negocjacji";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(Number(price));
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

// Formatowanie powierzchni
const formatArea = (area: number | null): string | undefined => {
  if (!area) return undefined;
  return `${area.toLocaleString("pl-PL")} m²`;
};

// Fetch funkcja
async function getListing(id: string): Promise<Listing | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  
  try {
    const res = await fetch(`${apiUrl}/listings/${id}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailsPage(props: PageProps) {
  const params = await props.params;
  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }

  const province = listing.wojewodztwo
    ? wojewodztwoLabels[listing.wojewodztwo] || listing.wojewodztwo
    : "";
  const city = listing.city || "";
  const fullLocation = [province, city].filter(Boolean).join(", ");
  const propertyTypeLabel = listing.propertyType
    ? propertyTypeLabels[listing.propertyType] || listing.propertyType
    : "Nieruchomość";

  // Przygotuj URL-e do zdjęć
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const images =
    listing.images && listing.images.length > 0
      ? listing.images
          .sort((a, b) => a.order - b.order)
          .map((img) => `${apiUrl}${img.path}`)
      : ["/images/placeholder.jpg"];

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-8 pb-24 lg:pb-8">
        {/* Nagłówek */}
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Ogłoszenia / {province} / {propertyTypeLabel}
          </p>
          <h1 className="text-2xl font-semibold leading-snug tracking-tight">
            {listing.title || "Ogłoszenie"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{fullLocation}</span>
            <span>•</span>
            <span>{formatDate(listing.publishedAt || listing.createdAt)}</span>
          </div>
        </header>

        {/* Główna kolumna: galeria + szczegóły */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Lewa część – galeria + box z ceną + opis + parametry */}
          <div className="space-y-6">
            <ListingGallery images={images} title={listing.title || "Ogłoszenie"} />

            {/* BOX POD GALERIĄ – tytuł + miejscowość + cena */}
            <Card className="p-4 space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold leading-snug">
                    {listing.title || "Ogłoszenie"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {fullLocation}
                  </p>
                </div>

                <div className="space-y-0.5 text-right">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(listing.price ? Number(listing.price) : null)}
                  </p>
                  {listing.negotiable && (
                    <p className="text-xs text-muted-foreground">
                      Do negocjacji
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {listing.plotSize && `Działka ${formatArea(listing.plotSize)}`}
                    {listing.plotSize && listing.houseSize && " • "}
                    {listing.houseSize && `dom ${formatArea(listing.houseSize)}`}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h2 className="text-sm font-semibold">Parametry nieruchomości</h2>
              <dl className="grid gap-2 text-sm md:grid-cols-2">
                <div className="space-y-0.5">
                  <dt className="text-muted-foreground">Typ nieruchomości</dt>
                  <dd>{propertyTypeLabel}</dd>
                </div>
                {listing.plotSize && (
                  <div className="space-y-0.5">
                    <dt className="text-muted-foreground">Powierzchnia działki</dt>
                    <dd>{formatArea(listing.plotSize)}</dd>
                  </div>
                )}
                {listing.houseSize && (
                  <div className="space-y-0.5">
                    <dt className="text-muted-foreground">Powierzchnia domu</dt>
                    <dd>{formatArea(listing.houseSize)}</dd>
                  </div>
                )}
                <div className="space-y-0.5">
                  <dt className="text-muted-foreground">Województwo</dt>
                  <dd>{province}</dd>
                </div>
                {listing.city && (
                  <div className="space-y-0.5">
                    <dt className="text-muted-foreground">Miejscowość</dt>
                    <dd>{listing.city}</dd>
                  </div>
                )}
                <div className="space-y-0.5">
                  <dt className="text-muted-foreground">Ogłoszeniodawca</dt>
                  <dd>
                    {listing.advertiserType
                      ? advertiserTypeLabels[listing.advertiserType] || listing.advertiserType
                      : "Nie podano"}
                  </dd>
                </div>
              </dl>

              {listing.features && listing.features.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cechy nieruchomości</p>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-[10px]">
                        {featureLabels[feature] ?? feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {listing.description && (
              <Card className="p-4 space-y-3">
                <h2 className="text-sm font-semibold">Opis ogłoszenia</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </Card>
            )}
          </div>

          {/* Prawa część – kontakt (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-1">
              <Card className="p-4 space-y-3">
                {listing.contactName && (
                  <p className="text-sm font-medium">{listing.contactName}</p>
                )}
                <Button className="w-full">
                  {listing.contactPhone ? "Pokaż telefon" : "Kontakt"}
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
