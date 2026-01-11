"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useAuth } from "@/contexts/auth-context";
import {
  listingsService,
  type ListingImage,
} from "@/lib/services/listings.service";

// Stałe - województwa
const WOJEWODZTWA = [
  { value: "dolnośląskie", label: "Dolnośląskie" },
  { value: "kujawsko-pomorskie", label: "Kujawsko-Pomorskie" },
  { value: "lubelskie", label: "Lubelskie" },
  { value: "lubuskie", label: "Lubuskie" },
  { value: "łódzkie", label: "Łódzkie" },
  { value: "małopolskie", label: "Małopolskie" },
  { value: "mazowieckie", label: "Mazowieckie" },
  { value: "opolskie", label: "Opolskie" },
  { value: "podkarpackie", label: "Podkarpackie" },
  { value: "podlaskie", label: "Podlaskie" },
  { value: "pomorskie", label: "Pomorskie" },
  { value: "śląskie", label: "Śląskie" },
  { value: "świętokrzyskie", label: "Świętokrzyskie" },
  { value: "warmińsko-mazurskie", label: "Warmińsko-Mazurskie" },
  { value: "wielkopolskie", label: "Wielkopolskie" },
  { value: "zachodniopomorskie", label: "Zachodniopomorskie" },
] as const;

// Typy nieruchomości
const PROPERTY_TYPES = [
  { value: "dom", label: "Dom" },
  { value: "dzialka", label: "Działka" },
  { value: "dom_z_dzialka", label: "Dom z działką" },
  { value: "siedlisko", label: "Siedlisko" },
  { value: "gospodarstwo", label: "Gospodarstwo rolne" },
] as const;

// Typy ogłoszeniodawców
const ADVERTISER_TYPES = [
  { value: "prywatny", label: "Osoba prywatna" },
  { value: "firma", label: "Firma" },
  { value: "agencja", label: "Agencja nieruchomości" },
] as const;

// Cechy nieruchomości
const PROPERTY_FEATURES = [
  { value: "przy_lesie", label: "Przy lesie" },
  { value: "bez_sasiadow_300m", label: "Bez sąsiadów w promieniu 300m" },
  { value: "do_remontu", label: "Do remontu" },
  { value: "gotowe_do_zamieszkania", label: "Gotowe do zamieszkania" },
  { value: "z_widokiem", label: "Z widokiem" },
  { value: "przy_jeziorze", label: "Przy jeziorze" },
  { value: "przy_rzece", label: "Przy rzece" },
  { value: "media_w_dzialce", label: "Media w działce" },
  { value: "droga_asfaltowa", label: "Droga asfaltowa" },
  { value: "okolica_spokojna", label: "Spokojna okolica" },
] as const;

// Schemat walidacji formularza (draft - wszystko opcjonalne)
const listingFormSchema = z.object({
  title: z.string().max(100, "Tytuł może mieć max. 100 znaków").optional(),
  description: z
    .string()
    .max(5000, "Opis może mieć max. 5000 znaków")
    .optional(),
  price: z.coerce.number().positive("Cena musi być dodatnia").optional(),
  city: z.string().max(100, "Miasto może mieć max. 100 znaków").optional(),
  wojewodztwo: z.string().optional(),
  propertyType: z.string().optional(),
  advertiserType: z.string().optional(),
  plotSize: z.coerce
    .number()
    .positive("Powierzchnia musi być dodatnia")
    .optional()
    .or(z.literal("")),
  houseSize: z.coerce
    .number()
    .positive("Powierzchnia musi być dodatnia")
    .optional()
    .or(z.literal("")),
  features: z.array(z.string()).default([]),
  contactName: z
    .string()
    .max(100, "Imię może mieć max. 100 znaków")
    .optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Podaj poprawny email").optional().or(z.literal("")),
  negotiable: z.boolean().default(false),
});

type ListingFormData = z.infer<typeof listingFormSchema>;

// Schemat walidacji do publikacji
const publishValidationSchema = z.object({
  title: z
    .string()
    .min(10, "Tytuł musi mieć min. 10 znaków")
    .max(100, "Tytuł może mieć max. 100 znaków"),
  description: z
    .string()
    .min(50, "Opis musi mieć min. 50 znaków")
    .max(5000, "Opis może mieć max. 5000 znaków"),
  price: z
    .number()
    .positive("Cena musi być dodatnia")
    .max(100_000_000, "Cena nie może przekraczać 100 mln"),
  city: z
    .string()
    .min(2, "Miasto musi mieć min. 2 znaki")
    .max(100, "Miasto może mieć max. 100 znaków"),
  wojewodztwo: z.string().min(1, "Wybierz województwo"),
  propertyType: z.string().min(1, "Wybierz typ nieruchomości"),
  advertiserType: z.string().min(1, "Wybierz typ ogłoszeniodawcy"),
  contactName: z
    .string()
    .min(2, "Imię musi mieć min. 2 znaki")
    .max(100, "Imię może mieć max. 100 znaków"),
  contactPhone: z
    .string()
    .regex(/^[0-9+\-\s()]{9,20}$/, "Podaj poprawny numer telefonu"),
  imageCount: z.number().min(2, "Wymagane są min. 2 zdjęcia do publikacji"),
});

export default function AddListingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ListingImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [listingId, setListingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      features: [],
      negotiable: false,
    },
  });

  const watchedFeatures = watch("features");

  // Redirect jeśli niezalogowany
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/logowanie?redirect=/ogloszenia/dodaj");
    }
  }, [user, authLoading, router]);

  // Upload zdjęć
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploadingImages(true);
      setError(null);

      try {
        const fileArray = Array.from(files);
        const images = await listingsService.uploadImages(
          fileArray,
          listingId || undefined
        );
        setUploadedImages((prev) => [...prev, ...images]);
      } catch (err: any) {
        setError(err.response?.data?.message || "Błąd podczas uploadu zdjęć");
      } finally {
        setUploadingImages(false);
        // Reset input
        e.target.value = "";
      }
    },
    [listingId]
  );

  // Usuń zdjęcie
  const handleRemoveImage = async (imageId: string) => {
    try {
      await listingsService.deleteImage(imageId);
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Błąd podczas usuwania zdjęcia");
    }
  };

  // Toggle feature
  const toggleFeature = (featureValue: string) => {
    const current = getValues("features") || [];
    if (current.includes(featureValue)) {
      setValue(
        "features",
        current.filter((f) => f !== featureValue)
      );
    } else {
      setValue("features", [...current, featureValue]);
    }
  };

  // Zapisz jako szkic
  const saveDraft = async () => {
    const data = getValues();
    setIsSavingDraft(true);
    setError(null);

    try {
      const payload = {
        ...data,
        plotSize: data.plotSize ? Number(data.plotSize) : undefined,
        houseSize: data.houseSize ? Number(data.houseSize) : undefined,
        contactEmail: data.contactEmail || undefined,
        status: "draft" as const,
        imageIds: uploadedImages.map((img) => img.id),
      };

      if (listingId) {
        await listingsService.update(listingId, payload);
      } else {
        const created = await listingsService.create(payload);
        setListingId(created.id);
      }

      alert("Szkic został zapisany!");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Błąd podczas zapisywania szkicu"
      );
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Opublikuj ogłoszenie
  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    setError(null);
    setPublishErrors([]);

    // Walidacja przed publikacją
    const validationData = {
      ...data,
      price: data.price ? Number(data.price) : undefined,
      imageCount: uploadedImages.length,
    };

    const publishValidation = publishValidationSchema.safeParse(validationData);

    if (!publishValidation.success) {
      const errorMessages = publishValidation.error.errors.map(
        (e) => e.message
      );
      setPublishErrors(errorMessages);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...data,
        plotSize: data.plotSize ? Number(data.plotSize) : undefined,
        houseSize: data.houseSize ? Number(data.houseSize) : undefined,
        contactEmail: data.contactEmail || undefined,
        status: "draft" as const,
        imageIds: uploadedImages.map((img) => img.id),
      };

      let id = listingId;

      if (id) {
        await listingsService.update(id, payload);
      } else {
        const created = await listingsService.create(payload);
        id = created.id;
        setListingId(id);
      }

      // Publikuj
      await listingsService.publish(id);
      router.push(`/ogloszenia/${id}`);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Błąd podczas publikacji ogłoszenia";
      setError(errorMsg);

      // Jeśli backend zwrócił błędy walidacji
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors.map(
          (e: any) => e.message
        );
        setPublishErrors(backendErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p>Ładowanie...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

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
            Dodaj ogłoszenie
          </h1>
          <p className="text-sm text-muted-foreground">
            Uzupełnij formularz. Możesz zapisać jako szkic i wrócić później.
          </p>
        </div>

        {/* Błędy */}
        {error && (
          <div className="mb-6 rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {publishErrors.length > 0 && (
          <div className="mb-6 rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="font-medium text-destructive mb-2">
              Uzupełnij wymagane pola do publikacji:
            </p>
            <ul className="list-disc list-inside text-sm text-destructive">
              {publishErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Podstawowe informacje */}
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Podstawowe informacje</h2>
              <p className="text-sm text-muted-foreground">
                Najważniejsze dane widoczne w liście ogłoszeń.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="title">Tytuł ogłoszenia *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Siedlisko pod lasem z dużą działką"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Cena (PLN) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  {...register("price")}
                  placeholder="420000"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Cena do negocjacji</Label>
                <div className="flex items-center gap-2 pt-2">
                  <Controller
                    name="negotiable"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="negotiable"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span className="text-sm text-muted-foreground">
                    Zaznacz jeśli cena jest elastyczna
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Lokalizacja */}
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Lokalizacja</h2>
              <p className="text-sm text-muted-foreground">
                Ułatw klientom znalezienie ogłoszenia w wyszukiwarce.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">Miasto / miejscowość *</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Zagórz"
                />
                {errors.city && (
                  <p className="text-sm text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wojewodztwo">Województwo *</Label>
                <Controller
                  name="wojewodztwo"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="wojewodztwo" className="w-full">
                        <SelectValue placeholder="Wybierz województwo" />
                      </SelectTrigger>
                      <SelectContent className="overflow-y-auto max-h-[10rem]">
                        {WOJEWODZTWA.map((woj) => (
                          <SelectItem key={woj.value} value={woj.value}>
                            {woj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.wojewodztwo && (
                  <p className="text-sm text-destructive">
                    {errors.wojewodztwo.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Typ ogłoszenia */}
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Typ ogłoszenia</h2>
              <p className="text-sm text-muted-foreground">
                Informacje o nieruchomości i rodzaju ogłoszeniodawcy.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="advertiserType">Ogłoszeniodawca *</Label>
                <Controller
                  name="advertiserType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="advertiserType" className="w-full">
                        <SelectValue placeholder="Prywatne lub firmowe" />
                      </SelectTrigger>
                      <SelectContent>
                        {ADVERTISER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.advertiserType && (
                  <p className="text-sm text-destructive">
                    {errors.advertiserType.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propertyType">Typ nieruchomości *</Label>
                <Controller
                  name="propertyType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="propertyType" className="w-full">
                        <SelectValue placeholder="Wybierz typ" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.propertyType && (
                  <p className="text-sm text-destructive">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plotSize">Wielkość działki (m²)</Label>
                <Input
                  id="plotSize"
                  type="number"
                  min="0"
                  {...register("plotSize")}
                  placeholder="12000"
                />
                {errors.plotSize && (
                  <p className="text-sm text-destructive">
                    {errors.plotSize.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="houseSize">Wielkość domu (m²)</Label>
                <Input
                  id="houseSize"
                  type="number"
                  min="0"
                  {...register("houseSize")}
                  placeholder="80"
                />
                {errors.houseSize && (
                  <p className="text-sm text-destructive">
                    {errors.houseSize.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Cechy nieruchomości */}
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Cechy nieruchomości</h2>
              <p className="text-sm text-muted-foreground">
                Zaznacz cechy, które wyróżniają Twoją ofertę.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {PROPERTY_FEATURES.map((feature) => (
                <label
                  key={feature.value}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={watchedFeatures?.includes(feature.value)}
                    onCheckedChange={() => toggleFeature(feature.value)}
                  />
                  <span>{feature.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Zdjęcia */}
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Zdjęcia</h2>
              <p className="text-sm text-muted-foreground">
                Dodaj minimum 2 zdjęcia do publikacji. Zalecamy 6+ zdjęć.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="photos">Dodaj zdjęcia</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
                {uploadingImages && (
                  <p className="text-sm text-muted-foreground">
                    Przesyłanie zdjęć...
                  </p>
                )}
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${image.path}`}
                        alt={image.originalName}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Przesłano: {uploadedImages.length} zdjęć
                {uploadedImages.length < 2 && (
                  <span className="text-destructive ml-2">
                    (wymagane min. 2 do publikacji)
                  </span>
                )}
              </p>
            </div>
          </Card>

          {/* Kontakt */}
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Kontakt</h2>
              <p className="text-sm text-muted-foreground">
                Dane kontaktowe widoczne w ogłoszeniu.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contactName">Imię i nazwisko *</Label>
                <Input
                  id="contactName"
                  {...register("contactName")}
                  placeholder="Jan Kowalski"
                />
                {errors.contactName && (
                  <p className="text-sm text-destructive">
                    {errors.contactName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactPhone">Telefon *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  {...register("contactPhone")}
                  placeholder="+48 123 456 789"
                />
                {errors.contactPhone && (
                  <p className="text-sm text-destructive">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">E-mail (opcjonalnie)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  placeholder="kontakt@email.pl"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-destructive">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Opis */}
          <Card className="space-y-6 border px-6 py-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Opis ogłoszenia</h2>
              <p className="text-sm text-muted-foreground">
                Opowiedz o historii, otoczeniu i potencjale nieruchomości.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Opis *</Label>
              <textarea
                id="description"
                {...register("description")}
                rows={6}
                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                placeholder="Najważniejsze informacje, stan budynków, okolica, dojazd... (min. 50 znaków)"
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </Card>

          {/* Przyciski */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Dodając ogłoszenie akceptujesz regulamin serwisu.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                disabled={isSavingDraft || isSubmitting}
              >
                {isSavingDraft ? "Zapisywanie..." : "Zapisz jako szkic"}
              </Button>
              <Button type="submit" disabled={isSubmitting || isSavingDraft}>
                {isSubmitting ? "Publikowanie..." : "Opublikuj ogłoszenie"}
              </Button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
