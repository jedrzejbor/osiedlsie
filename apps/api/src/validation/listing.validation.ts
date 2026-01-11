import { z } from "zod";

/**
 * Lista województw w Polsce
 */
export const WOJEWODZTWA = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
] as const;

export type Wojewodztwo = (typeof WOJEWODZTWA)[number];

/**
 * Typ nieruchomości
 */
export const PROPERTY_TYPES = [
  "dom",
  "dzialka",
  "dom_z_dzialka",
  "siedlisko",
  "gospodarstwo",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

/**
 * Typ ogłoszeniodawcy
 */
export const ADVERTISER_TYPES = ["prywatny", "firma", "agencja"] as const;

export type AdvertiserType = (typeof ADVERTISER_TYPES)[number];

/**
 * Cechy nieruchomości
 */
export const PROPERTY_FEATURES = [
  "przy_lesie",
  "bez_sasiadow_300m",
  "do_remontu",
  "gotowe_do_zamieszkania",
  "z_widokiem",
  "przy_jeziorze",
  "przy_rzece",
  "media_w_dzialce",
  "droga_asfaltowa",
  "okolica_spokojna",
] as const;

export type PropertyFeature = (typeof PROPERTY_FEATURES)[number];

/**
 * Status ogłoszenia
 */
export const LISTING_STATUSES = ["draft", "published", "archived"] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

/**
 * Schemat bazowy ogłoszenia (bez zdjęć - do walidacji przy zapisie szkicu)
 */
export const listingBaseSchema = z.object({
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

  wojewodztwo: z.enum(WOJEWODZTWA, {
    errorMap: () => ({ message: "Wybierz województwo z listy" }),
  }),

  propertyType: z.enum(PROPERTY_TYPES, {
    errorMap: () => ({ message: "Wybierz typ nieruchomości" }),
  }),

  advertiserType: z.enum(ADVERTISER_TYPES, {
    errorMap: () => ({ message: "Wybierz typ ogłoszeniodawcy" }),
  }),

  plotSize: z
    .number()
    .positive("Powierzchnia działki musi być dodatnia")
    .max(10_000_000, "Powierzchnia działki nie może przekraczać 10 000 000 m²")
    .optional()
    .nullable(),

  houseSize: z
    .number()
    .positive("Powierzchnia domu musi być dodatnia")
    .max(10_000, "Powierzchnia domu nie może przekraczać 10 000 m²")
    .optional()
    .nullable(),

  features: z.array(z.enum(PROPERTY_FEATURES)).default([]),

  contactName: z
    .string()
    .min(2, "Imię kontaktowe musi mieć min. 2 znaki")
    .max(100, "Imię kontaktowe może mieć max. 100 znaków"),

  contactPhone: z
    .string()
    .regex(/^[0-9+\-\s()]{9,20}$/, "Podaj poprawny numer telefonu"),

  contactEmail: z.string().email("Podaj poprawny adres email").optional().nullable(),

  negotiable: z.boolean().default(false),
});

/**
 * Schemat do zapisu szkicu (status = draft) - nie wymaga zdjęć
 */
export const listingDraftSchema = listingBaseSchema.partial().extend({
  title: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive().optional(),
  city: z.string().max(100).optional(),
  wojewodztwo: z.enum(WOJEWODZTWA).optional(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  advertiserType: z.enum(ADVERTISER_TYPES).optional(),
  contactName: z.string().max(100).optional(),
  contactPhone: z.string().optional(),
});

/**
 * Schemat do publikacji (wymaga wszystkich pól + min 2 zdjęcia)
 */
export const listingPublishSchema = listingBaseSchema.extend({
  imageIds: z
    .array(z.string().uuid())
    .min(2, "Wymagane są min. 2 zdjęcia do publikacji"),
});

/**
 * Schemat do tworzenia nowego ogłoszenia
 */
export const createListingSchema = listingBaseSchema.partial().extend({
  status: z.enum(["draft", "published"]).default("draft"),
  imageIds: z.array(z.string().uuid()).default([]),
});

/**
 * Schemat do aktualizacji ogłoszenia
 */
export const updateListingSchema = createListingSchema.partial();

// Typy
export type ListingBase = z.infer<typeof listingBaseSchema>;
export type ListingDraft = z.infer<typeof listingDraftSchema>;
export type ListingPublish = z.infer<typeof listingPublishSchema>;
export type CreateListing = z.infer<typeof createListingSchema>;
export type UpdateListing = z.infer<typeof updateListingSchema>;
