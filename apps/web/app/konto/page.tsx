"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { useAuth } from "@/contexts/auth-context";
import { listingsService, type Listing } from "@/lib/services/listings.service";

// Mapowanie statusów z backendu na UI
type UIStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

const backendToUIStatus: Record<string, UIStatus> = {
  published: "ACTIVE",
  draft: "DRAFT",
  archived: "ARCHIVED",
};

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

// Formatowanie daty
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "dzisiaj";
  if (diffDays === 1) return "wczoraj";
  if (diffDays < 7) return `${diffDays} dni temu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tyg. temu`;
  return date.toLocaleDateString("pl-PL");
};

function getStatusBadge(status: UIStatus) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          Aktywne
        </Badge>
      );
    case "DRAFT":
      return (
        <Badge variant="outline" className="border-dashed">
          Szkic
        </Badge>
      );
    case "ARCHIVED":
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
          Zarchiwizowane
        </Badge>
      );
    default:
      return null;
  }
}

function UserInfo() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const createdDate = new Date(user.createdAt);
  const formattedDate = createdDate.toLocaleDateString('pl-PL', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <>
      <div className="space-y-1 text-sm">
        <p className="font-medium">{user.name || 'Użytkownik'}</p>
        <p className="text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground">
          Z nami od {formattedDate}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-[11px]">
          {user.role === 'ADMIN' ? 'Administrator' : 'Konto prywatne'}
        </Badge>
        <span>•</span>
        <span>Plan: podstawowy</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Edytuj dane konta
        </Button>
        <Button variant="ghost" size="sm">
          Zmień hasło
        </Button>
        <Button variant="destructive" size="sm" onClick={logout}>
          Wyloguj się
        </Button>
      </div>
    </>
  );
}

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | UIStatus>("all");

  // Redirect jeśli niezalogowany
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/logowanie?redirect=/konto");
    }
  }, [user, authLoading, router]);

  // Fetch moich ogłoszeń
  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await listingsService.getMyListings();
        setListings(data);
      } catch (err: any) {
        console.error("Błąd pobierania ogłoszeń:", err);
        setError(err.response?.data?.message || "Nie udało się pobrać ogłoszeń");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMyListings();
    }
  }, [user]);

  // Filtrowanie ogłoszeń
  const filteredListings = listings.filter((listing) => {
    if (statusFilter === "all") return true;
    const uiStatus = backendToUIStatus[listing.status];
    return uiStatus === statusFilter;
  });

  // Liczniki
  const activeCount = listings.filter((l) => l.status === "published").length;
  const draftCount = listings.filter((l) => l.status === "draft").length;
  const archivedCount = listings.filter((l) => l.status === "archived").length;

  // Loading state
  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ładowanie...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        {/* Nagłówek strony */}
        <header className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Moje konto
            </h1>
            <p className="text-sm text-muted-foreground">
              Zarządzaj swoimi ogłoszeniami i danymi konta.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/ogloszenia">Przeglądaj ogłoszenia</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/ogloszenia/dodaj">Dodaj ogłoszenie</Link>
            </Button>
          </div>
        </header>

        {/* Główna siatka: lewa – info o koncie, prawa – ogłoszenia */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          {/* Lewa kolumna – informacje o koncie */}
          <div className="space-y-4">
            <Card className="p-4 sm:p-5">
              <h2 className="mb-2 text-sm font-semibold">Dane konta</h2>
              <UserInfo />
            </Card>

            <Card className="p-4 sm:p-5">
              <h2 className="mb-3 text-sm font-semibold">
                Podsumowanie ogłoszeń
              </h2>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Aktywne
                  </p>
                  <p className="text-xl font-semibold">
                    {activeCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Szkice
                  </p>
                  <p className="text-xl font-semibold">
                    {draftCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Zarchiwizowane
                  </p>
                  <p className="text-xl font-semibold">
                    {archivedCount}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Prawa kolumna – lista moich ogłoszeń */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Moje ogłoszenia</h2>

              {/* Filtry statusu */}
              <div className="flex flex-wrap gap-1 text-xs">
                <Button
                  variant={statusFilter === "all" ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  Wszystkie ({listings.length})
                </Button>
                <Button
                  variant={statusFilter === "ACTIVE" ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("ACTIVE")}
                >
                  Aktywne ({activeCount})
                </Button>
                <Button
                  variant={statusFilter === "DRAFT" ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("DRAFT")}
                >
                  Szkice ({draftCount})
                </Button>
                <Button
                  variant={statusFilter === "ARCHIVED" ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("ARCHIVED")}
                >
                  Archiwum ({archivedCount})
                </Button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Ładowanie ogłoszeń...</p>
              </Card>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Lista ogłoszeń */}
            {!isLoading && !error && (
              <Card className="divide-y">
                {filteredListings.map((listing) => {
                  const uiStatus = backendToUIStatus[listing.status];
                  const province = listing.wojewodztwo
                    ? wojewodztwoLabels[listing.wojewodztwo] || listing.wojewodztwo
                    : "";
                  const city = listing.city || "";
                  const location = [province, city].filter(Boolean).join(", ");

                  return (
                    <div
                      key={listing.id}
                      className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/ogloszenia/${listing.id}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {listing.title || "Bez tytułu"}
                          </Link>
                          {getStatusBadge(uiStatus)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {location || "Lokalizacja nie podana"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {listing.status === "draft"
                            ? `Utworzono: ${formatDate(listing.createdAt)}`
                            : `Dodano: ${formatDate(listing.publishedAt || listing.createdAt)}`}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/ogloszenia/edytuj/${listing.id}`}>
                              Edytuj
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/ogloszenia/${listing.id}`}>
                              Podgląd
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredListings.length === 0 && !isLoading && (
                  <div className="p-4 text-sm text-muted-foreground">
                    {statusFilter === "all" ? (
                      <>
                        Nie masz jeszcze żadnych ogłoszeń.{" "}
                        <Link
                          href="/ogloszenia/dodaj"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Dodaj pierwsze ogłoszenie
                        </Link>
                        .
                      </>
                    ) : (
                      `Brak ogłoszeń w tej kategorii.`
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
