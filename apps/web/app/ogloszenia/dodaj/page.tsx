"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const provinces = [
  "Dolnośląskie",
  "Kujawsko-Pomorskie",
  "Lubelskie",
  "Lubuskie",
  "Łódzkie",
  "Małopolskie",
  "Mazowieckie",
  "Opolskie",
  "Podkarpackie",
  "Podlaskie",
  "Pomorskie",
  "Śląskie",
  "Świętokrzyskie",
  "Warmińsko-Mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie",
];

const listingTypes = [
  { value: "SIEDLISKO", label: "Siedlisko" },
  { value: "DOM", label: "Dom" },
  { value: "DZIALKA", label: "Działka z domem" },
  { value: "GOSPODARSTWO", label: "Gospodarstwo" },
];

const listingFeatures = [
  { value: "PRZY_LESIE", label: "Przy lesie" },
  { value: "BEZ_SASIADOW", label: "Bez sąsiadów 300 m" },
  { value: "DO_REMONTU", label: "Do remontu" },
  { value: "GOTOWE", label: "Gotowe do zamieszkania" },
  { value: "DODATKOWE_BUDYNKI", label: "Zabudowania dodatkowe" },
  { value: "OGRODZENIE", label: "Ogrodzenie" },
  { value: "DOSTEP_DO_WODY", label: "Dostęp do wody (rzeka/jezioro)" },
];

const utilities = [
  { value: "PRAD", label: "Prąd" },
  { value: "WODA", label: "Woda" },
  { value: "KANALIZACJA", label: "Kanalizacja" },
  { value: "GAZ", label: "Gaz" },
  { value: "STUDNIA", label: "Studnia" },
  { value: "SZAMBO", label: "Szambo" },
];

const accessOptions = [
  { value: "ASFALT", label: "Asfalt" },
  { value: "UTWARDZONA", label: "Utwardzona" },
  { value: "GRUNTOWA", label: "Gruntowa" },
];

const conditionOptions = [
  { value: "DO_REMONTU", label: "Do remontu" },
  { value: "DO_ZAMIESZKANIA", label: "Gotowe do zamieszkania" },
  { value: "W_BUDOWIE", label: "W budowie" },
  { value: "RUINA", label: "Ruina" },
];

const ownershipOptions = [
  { value: "WLASNOSC", label: "Własność" },
  { value: "WSPOLWLASNOSC", label: "Współwłasność" },
  { value: "UZYTKOWANIE", label: "Użytkowanie wieczyste" },
];

const legalStatusOptions = [
  { value: "UREGULOWANY", label: "Uregulowany" },
  { value: "W_TRAKCIE", label: "W trakcie" },
  { value: "NIEUREGULOWANY", label: "Nieuregulowany" },
];

const contactPreferences = [
  { value: "PHONE", label: "Telefon" },
  { value: "EMAIL", label: "E-mail" },
  { value: "CHAT", label: "Czat w serwisie" },
];

export default function AddListingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-2">
          <Link
            href="/ogloszenia"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Wróć do ogłoszeń
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">
            Dodaj ogłoszenie siedliska
          </h1>
          <p className="text-sm text-muted-foreground">
            Uzupełnij formularz, aby Twoje ogłoszenie było kompletne i dobrze
            zabezpieczone informacyjnie.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Podstawowe informacje</h2>
              <p className="text-sm text-muted-foreground">
                Najważniejsze dane widoczne w liście ogłoszeń.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="title">Tytuł ogłoszenia</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Siedlisko pod lasem z dużą działką"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Cena (PLN)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="420000"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priceNegotiable">
                  Cena do negocjacji
                </Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="priceNegotiable" name="priceNegotiable" />
                  <span className="text-sm text-muted-foreground">
                    Zaznacz jeśli cena jest elastyczna
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Lokalizacja</h2>
              <p className="text-sm text-muted-foreground">
                Ułatw klientom znalezienie ogłoszenia w wyszukiwarce.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">Miasto / miejscowość</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Zagórz"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="province">Województwo</Label>
                <Select name="province">
                  <SelectTrigger id="province" className="w-full">
                    <SelectValue placeholder="Wybierz województwo" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="address">Dokładny adres (opcjonalnie)</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Ulica, nr domu, kod"
                />
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox id="hideAddress" name="hideAddress" />
                  <span className="text-sm text-muted-foreground">
                    Ukryj dokładny adres do czasu kontaktu
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Typ ogłoszenia</h2>
              <p className="text-sm text-muted-foreground">
                Informacje o nieruchomości i rodzaju ogłoszeniodawcy.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="advertiserType">Ogłoszenie</Label>
                <Select name="advertiserType">
                  <SelectTrigger id="advertiserType" className="w-full">
                    <SelectValue placeholder="Prywatne lub firmowe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIVATE">Prywatne</SelectItem>
                    <SelectItem value="AGENCY">Firma / biuro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="listingType">Typ nieruchomości</Label>
                <Select name="listingType">
                  <SelectTrigger id="listingType" className="w-full">
                    <SelectValue placeholder="Wybierz typ" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plotArea">Wielkość działki (m²)</Label>
                <Input
                  id="plotArea"
                  name="plotArea"
                  type="number"
                  min="0"
                  placeholder="12000"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="houseArea">Wielkość domu (m²)</Label>
                <Input
                  id="houseArea"
                  name="houseArea"
                  type="number"
                  min="0"
                  placeholder="80"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rooms">Liczba pokoi</Label>
                <Input id="rooms" name="rooms" type="number" min="0" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="yearBuilt">Rok budowy</Label>
                <Input id="yearBuilt" name="yearBuilt" type="number" min="1800" />
              </div>
            </div>
          </Card>

          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Stan i formalności</h2>
              <p className="text-sm text-muted-foreground">
                Uporządkuj informacje prawne i techniczne.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="condition">Stan nieruchomości</Label>
                <Select name="condition">
                  <SelectTrigger id="condition" className="w-full">
                    <SelectValue placeholder="Wybierz stan" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownership">Forma własności</Label>
                <Select name="ownership">
                  <SelectTrigger id="ownership" className="w-full">
                    <SelectValue placeholder="Wybierz formę" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownershipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="legalStatus">Status prawny</Label>
                <Select name="legalStatus">
                  <SelectTrigger id="legalStatus" className="w-full">
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="availability">Dostępność</Label>
                <Input
                  id="availability"
                  name="availability"
                  type="text"
                  placeholder="np. od zaraz / 1.09.2024"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="landRegister">Księga wieczysta</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="landRegister" name="landRegister" />
                  <span className="text-sm text-muted-foreground">
                    Numer księgi wieczystej dostępny
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="creditPossible">Możliwość kredytu</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="creditPossible" name="creditPossible" />
                  <span className="text-sm text-muted-foreground">
                    Nieruchomość akceptuje finansowanie kredytem
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Otoczenie i media</h2>
              <p className="text-sm text-muted-foreground">
                Kluczowe cechy siedliska oraz dostępne udogodnienia.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Cechy siedliska</Label>
                <div className="grid gap-2">
                  {listingFeatures.map((feature) => (
                    <label
                      key={feature.value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox id={feature.value} name="features" />
                      <span>{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="grid gap-2">
                  {utilities.map((utility) => (
                    <label
                      key={utility.value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox id={utility.value} name="utilities" />
                      <span>{utility.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="access">Dojazd</Label>
                <Select name="access">
                  <SelectTrigger id="access" className="w-full">
                    <SelectValue placeholder="Wybierz rodzaj dojazdu" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="terrain">Ukształtowanie terenu</Label>
                <Input
                  id="terrain"
                  name="terrain"
                  type="text"
                  placeholder="np. pagórkowate / płaskie"
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Materiały ogłoszenia</h2>
              <p className="text-sm text-muted-foreground">
                Dodaj zdjęcia, wideo lub pliki.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="photos">Zdjęcia (minimum 2)</Label>
                <Input
                  id="photos"
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Zalecamy dodanie co najmniej 6 zdjęć w wysokiej jakości.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="videoUrl">Wideo / spacer wirtualny</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  placeholder="https://"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="attachments">Załączniki (opcjonalnie)</Label>
                <Input
                  id="attachments"
                  name="attachments"
                  type="file"
                  multiple
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Kontakt</h2>
              <p className="text-sm text-muted-foreground">
                Dane kontaktowe i preferowany kanał.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contactName">Imię i nazwisko</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  type="text"
                  placeholder="Jan Kowalski"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactPhone">Telefon</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="+48 123 456 789"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">E-mail</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="kontakt@email.pl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactPreference">
                  Preferowana forma kontaktu
                </Label>
                <Select name="contactPreference">
                  <SelectTrigger id="contactPreference" className="w-full">
                    <SelectValue placeholder="Wybierz kanał" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactPreferences.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Opis ogłoszenia</h2>
              <p className="text-sm text-muted-foreground">
                Opowiedz o historii, otoczeniu i potencjale nieruchomości.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Opis</Label>
              <textarea
                id="description"
                name="description"
                rows={6}
                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                placeholder="Najważniejsze informacje, stan budynków, okolica, dojazd..."
                required
              />
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Dodając ogłoszenie akceptujesz regulamin serwisu.
            </p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Opublikuj ogłoszenie"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
