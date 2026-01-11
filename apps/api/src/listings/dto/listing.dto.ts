export class CreateListingDto {
  title?: string;
  description?: string;
  price?: number;
  city?: string;
  wojewodztwo?: string;
  propertyType?: string;
  advertiserType?: string;
  plotSize?: number;
  houseSize?: number;
  features?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  negotiable?: boolean;
  status?: "draft" | "published";
  imageIds?: string[];
}

export class UpdateListingDto {
  title?: string;
  description?: string;
  price?: number;
  city?: string;
  wojewodztwo?: string;
  propertyType?: string;
  advertiserType?: string;
  plotSize?: number;
  houseSize?: number;
  features?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  negotiable?: boolean;
  status?: "draft" | "published" | "archived";
  imageIds?: string[];
}

export class ListingResponseDto {
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
  status: string;
  userId: string;
  images: {
    id: string;
    filename: string;
    originalName: string;
    path: string;
    order: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export class PublishListingDto {
  // Pusty DTO - publikacja wymaga tylko walidacji istniejących danych
}
