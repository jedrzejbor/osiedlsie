"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { z } from "zod";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";

import { filtersConfig, ListingType } from "@/components/filters/filtersConfig";

// --- ZOD SCHEMA DLA FORMULARZA (na razie lokalnie w tej stronie) ---

const listingCreateSchema = z.object({
  title: z
    .string()
    .min(10, "Tytuł powinien mieć co najmniej 10 znaków")
    .max(120, "Maksymalnie 120 znaków"),
  province: z
    .string()
    .min(1, "Województwo jest wymagane")
    .refine((val) => val !== "Dowolne", {
      message: "Wybierz konkretne województwo",
    }),
  location: z
    .string()
    .min(3, "Podaj miejscowość lub opis lokalizacji"),
  type: z.enum(["SIEDLISKO", "DZIALKA", "DOM_DZIALKA"]),
  price: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .number({
          invalid_type_error: "Cena musi być liczbą",
        })
        .int("Cena musi być liczbą całkowitą")
        .positive("Cena musi być większa od zera")
    ),
  plotArea: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .number({
          invalid_type_error: "Powierzchnia musi być liczbą",
        })
        .int("Powierzchnia musi być liczbą całkowitą")
        .positive("Powierzchnia musi być większa od zera")
    ),
  houseArea: z
    .string()
    .optional()
    .transform((val) => (val ? val.replace(/\s/g, "") : ""))
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) => val === undefined || (!Number.isNaN(val) && val > 0),
      {
        message: "Powierzchnia domu musi być liczbą większą od zera",
      }
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  description: z
    .string()
    .min(30, "Opis powinien mieć co najmniej 30 znaków")
    .max(4000, "Maksymalnie 4000 znaków"),
});

type ListingCreateForm = z.input<typeof listingCreateSchema>;

type ListingCreateParsed = z.output<typeof listingCreateSchema>;

type FormErrors = Partial<
  Record<keyof ListingCreateForm | "form" | "tags", string>
>;

// --- MOCK PREVIEW ZDJĘĆ ---

type PreviewImage = {
  id: string;
  url: string;
};

export default function AddListingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleImagesChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const arr: PreviewImage[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      arr.push({ id: `${file.name}-${file.size}-${file.lastModified}`, url });
    });

    setPreviewImages(arr);
  };

  const toggleTag = (value: string, checked: boolean | "indeterminate") => {
    setSelectedTags((prev) => {
      const set = new Set(prev);
      if (checked) {
        set.add(value);
      } else {
        set.delete(value);
      }
      return Array.from(set);
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    const rawData: ListingCreateForm = {
      title: String(formData.get("title") ?? ""),
      province: String(formData.get("province") ?? ""),
      location: String(formData.get("location") ?? ""),
      type: String(formData.get("type") ?? "SIEDLISKO") as ListingType,
      price: String(formData.get("price") ?? ""),
      plotArea: String(formData.get("plotArea") ?? ""),
      houseArea: String(formData.get("houseArea") ?? ""),
      tags: selectedTags,
      description: String(formData.get("description") ?? ""),
    };

    const result = listingCreateSchema.safeParse(rawData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ListingCreateForm | undefined;
        if (field) {
          fieldErrors[field] = issue.message;
        } else {
          fieldErrors.form = issue.message;
        }
      });

      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const parsed: ListingCreateParsed = result.data;

    // 👉 tutaj później wpinamy realne API (Nest)
    console.log("VALID LISTING PAYLOAD:", {
      ...parsed,
      imagesCount: previewImages.length,
    });

    // symulacja „zapisano”
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // e.currentTarget.reset(); // jak chcesz czyścić formularz po zapisaniu
    }, 700);
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        {/* Nagłówek */}
        <header className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dodaj ogłoszenie
            </h1>
            <p className="text-sm text-muted-foreground">
              Opisz swoje siedlisko lub działkę przy lesie, dodaj zdjęcia i
              przygotuj ogłoszenie do publikacji.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/konto">Wróć do konta</Link>
          </Button>
        </header>

        {/* Główna karta z formularzem */}
        <Card className="p-4 sm:p-6 space-y-6">
          {success && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
              Ogłoszenie zostało poprawnie przygotowane (mock). Później w tym
              miejscu pokażemy status płatności i publikacji.
            </div>
          )}

          {errors.form && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sekcja podstawowe informacje */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold">Podstawowe informacje</h2>

              <div className="space-y-1.5">
                <Label htmlFor="title">Tytuł ogłoszenia</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Siedlisko pod lasem z widokiem, 1.2 ha"
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Województwo</Label>
                  <Select name="province">
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz województwo" />
                    </SelectTrigger>
                    <SelectContent>
                      {filtersConfig.provinces
                        .filter((p) => p !== "Dowolne")
                        .map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-xs text-destructive">
                      {errors.province}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">Lokalizacja (powiat / okolica)</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="np. pow. sanocki, okolice Mrągowa"
                  />
                  {errors.location && (
                    <p className="text-xs text-destructive">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Typ ogłoszenia</Label>
                  <Select name="type" defaultValue="SIEDLISKO">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filtersConfig.listingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-xs text-destructive">{errors.type}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Sekcja parametry i cena */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold">Cena i parametry</h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Cena (zł)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    placeholder="np. 420000"
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="plotArea">Powierzchnia działki (m²)</Label>
                  <Input
                    id="plotArea"
                    name="plotArea"
                    type="number"
                    min={0}
                    placeholder="np. 12000"
                  />
                  {errors.plotArea && (
                    <p className="text-xs text-destructive">
                      {errors.plotArea}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="houseArea">
                    Powierzchnia domu (m²)
                    <span className="ml-1 text-[11px] text-muted-foreground">
                      (opcjonalnie)
                    </span>
                  </Label>
                  <Input
                    id="houseArea"
                    name="houseArea"
                    type="number"
                    min={0}
                    placeholder="np. 80"
                  />
                  {errors.houseArea && (
                    <p className="text-xs text-destructive">
                      {errors.houseArea}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Sekcja cechy siedliska */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Cechy siedliska</h2>
              <p className="text-xs text-muted-foreground">
                Wybierz, co najlepiej opisuje tę nieruchomość. Dzięki temu
                łatwiej będzie ją znaleźć w wyszukiwarce.
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {filtersConfig.tags.map((tag) => {
                  const checked = selectedTags.includes(tag.value);
                  return (
                    <label
                      key={tag.value}
                      className="flex cursor-pointer items-center gap-2 text-xs"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(val) =>
                          toggleTag(tag.value, val)
                        }
                      />
                      <span>{tag.label}</span>
                    </label>
                  );
                })}
              </div>

              {errors.tags && (
                <p className="text-xs text-destructive">{errors.tags}</p>
              )}

              {selectedTags.length > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Wybrane:{" "}
                  {selectedTags
                    .map(
                      (val) =>
                        filtersConfig.tags.find((t) => t.value === val)?.label ??
                        val
                    )
                    .join(", ")}
                </p>
              )}
            </section>

            {/* Sekcja opis */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Opis ogłoszenia</h2>
              <div className="space-y-1.5">
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Opisz położenie, dostęp do mediów, dojazd, sąsiedztwo, ukształtowanie terenu, stan zabudowań itd."
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>
            </section>

            {/* Sekcja zdjęcia */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Zdjęcia</h2>
              <p className="text-xs text-muted-foreground">
                Dodaj kilka zdjęć przedstawiających siedlisko, dom, działkę i
                okolicę. Kolejność zdjęć możesz ustawić później.
              </p>

              <div className="space-y-2">
                <Input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImagesChange(e.target.files)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Na razie to tylko podgląd po stronie przeglądarki – upload
                  podłączymy później.
                </p>
              </div>

              {previewImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative h-20 w-28 overflow-hidden rounded-md border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sekcja CTA */}
            <section className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Po zapisaniu ogłoszenia przejdziesz do dalszych kroków, takich
                jak publikacja i płatność.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm">
                  Zapisz jako szkic
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Zapisywanie..." : "Przejdź dalej"}
                </Button>
              </div>
            </section>
          </form>
        </Card>
      </section>
    </main>
  );
}
