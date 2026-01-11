import { apiClient } from "../api-client";

export interface ListingImage {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  order: number;
}

export interface Listing {
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

export interface CreateListingData {
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

export interface UpdateListingData extends Partial<CreateListingData> {}

class ListingsService {
  async getAll(): Promise<Listing[]> {
    const response = await apiClient.get<Listing[]>("/listings");
    return response.data;
  }

  async getById(id: string): Promise<Listing> {
    const response = await apiClient.get<Listing>(`/listings/${id}`);
    return response.data;
  }

  async getMyListings(): Promise<Listing[]> {
    const response = await apiClient.get<Listing[]>("/listings/my/all");
    return response.data;
  }

  async create(data: CreateListingData): Promise<Listing> {
    const response = await apiClient.post<Listing>("/listings", data);
    return response.data;
  }

  async update(id: string, data: UpdateListingData): Promise<Listing> {
    const response = await apiClient.put<Listing>(`/listings/${id}`, data);
    return response.data;
  }

  async publish(id: string): Promise<Listing> {
    const response = await apiClient.post<Listing>(`/listings/${id}/publish`);
    return response.data;
  }

  async unpublish(id: string): Promise<Listing> {
    const response = await apiClient.post<Listing>(`/listings/${id}/unpublish`);
    return response.data;
  }

  async archive(id: string): Promise<Listing> {
    const response = await apiClient.post<Listing>(`/listings/${id}/archive`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/listings/${id}`);
  }

  // Zdjęcia
  async uploadImages(files: File[], listingId?: string): Promise<ListingImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    if (listingId) {
      formData.append("listingId", listingId);
    }

    const response = await apiClient.post<ListingImage[]>(
      "/listings/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async uploadSingleImage(
    file: File,
    listingId?: string,
    order?: number
  ): Promise<ListingImage> {
    const formData = new FormData();
    formData.append("image", file);
    if (listingId) {
      formData.append("listingId", listingId);
    }
    if (order !== undefined) {
      formData.append("order", order.toString());
    }

    const response = await apiClient.post<ListingImage>(
      "/listings/images/upload-single",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async deleteImage(imageId: string): Promise<void> {
    await apiClient.delete(`/listings/images/${imageId}`);
  }

  async reorderImages(listingId: string, imageIds: string[]): Promise<void> {
    await apiClient.post(`/listings/${listingId}/images/reorder`, { imageIds });
  }
}

export const listingsService = new ListingsService();
