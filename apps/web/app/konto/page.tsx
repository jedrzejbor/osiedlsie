"use client";

import Link from "next/link";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

// Mockowane dane użytkownika – później podmienimy na dane z API/auth
const mockUser = {
  name: "Jan Kowalski",
  email: "jan.kowalski@example.com",
  createdAtLabel: "Z nami od listopada 2025",
};

// Mockowane ogłoszenia użytkownika
const mockMyListings = [
  {
    id: 1,
    title: "Siedlisko pod lasem, 1.2 ha, strumyk na działce",
    location: "Podkarpackie, pow. sanocki",
    status: "ACTIVE" as const,
    createdAtLabel: "Dodano: 3 dni temu",
    views: 128,
    expiresAtLabel: "Wygasa za 27 dni",
  },
  {
    id: 2,
    title: "Działka pod siedlisko przy ścianie lasu",
    location: "Warmińsko-Mazurskie, okolice Mrągowa",
    status: "DRAFT" as const,
    createdAtLabel: "Utworzono: wczoraj",
    views: 0,
    expiresAtLabel: undefined,
  },
  {
    id: 3,
    title: "Stare siedlisko do remontu, pagórkowaty teren",
    location: "Lubelskie, Roztocze",
    status: "EXPIRED" as const,
    createdAtLabel: "Dodano: 2 miesiące temu",
    views: 412,
    expiresAtLabel: "Ogłoszenie wygasło",
  },
];

function getStatusBadge(status: "ACTIVE" | "DRAFT" | "EXPIRED") {
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
    case "EXPIRED":
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
          Wygasło
        </Badge>
      );
    default:
      return null;
  }
}

export default function AccountDashboardPage() {
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
              <div className="space-y-1 text-sm">
                <p className="font-medium">{mockUser.name}</p>
                <p className="text-muted-foreground">{mockUser.email}</p>
                <p className="text-xs text-muted-foreground">
                  {mockUser.createdAtLabel}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[11px]">
                  Konto prywatne
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
              </div>
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
                    {
                      mockMyListings.filter((l) => l.status === "ACTIVE")
                        .length
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Szkice
                  </p>
                  <p className="text-xl font-semibold">
                    {
                      mockMyListings.filter((l) => l.status === "DRAFT")
                        .length
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Wygasłe
                  </p>
                  <p className="text-xl font-semibold">
                    {
                      mockMyListings.filter((l) => l.status === "EXPIRED")
                        .length
                    }
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Prawa kolumna – lista moich ogłoszeń */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Moje ogłoszenia</h2>

              {/* Na razie same "puste" filtry – tylko UI */}
              <div className="flex flex-wrap gap-1 text-xs">
                <Button variant="outline" size="sm">
                  Wszystkie
                </Button>
                <Button variant="ghost" size="sm">
                  Aktywne
                </Button>
                <Button variant="ghost" size="sm">
                  Szkice
                </Button>
                <Button variant="ghost" size="sm">
                  Wygasłe
                </Button>
              </div>
            </div>

            <Card className="divide-y">
              {mockMyListings.map((listing) => (
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
                        {listing.title}
                      </Link>
                      {getStatusBadge(listing.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {listing.location}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {listing.createdAtLabel}
                      {listing.expiresAtLabel
                        ? ` • ${listing.expiresAtLabel}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
                    <p className="text-muted-foreground">
                      Wyświetlenia:{" "}
                      <span className="font-semibold">
                        {listing.views}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link href={`/ogloszenia/edytuj/${listing.id}`}>
                          Edytuj
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                      >
                        <Link href={`/ogloszenia/${listing.id}`}>
                          Podgląd
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {mockMyListings.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  Nie masz jeszcze żadnych ogłoszeń.{" "}
                  <Link
                    href="/ogloszenia/dodaj"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Dodaj pierwsze ogłoszenie
                  </Link>
                  .
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
