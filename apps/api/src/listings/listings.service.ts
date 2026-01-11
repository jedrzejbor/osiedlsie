import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Listing, ListingStatus } from "./entities/listing.entity";
import { ListingImage } from "./entities/listing-image.entity";
import { CreateListingDto, UpdateListingDto } from "./dto/listing.dto";
import {
  listingBaseSchema,
  listingPublishSchema,
  createListingSchema,
  updateListingSchema,
} from "../validation/listing.validation";

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(ListingImage)
    private imagesRepository: Repository<ListingImage>,
  ) {}

  async create(dto: CreateListingDto, userId: string): Promise<Listing> {
    // Walidacja danych wejściowych
    const validationResult = createListingSchema.safeParse(dto);
    if (!validationResult.success) {
      throw new BadRequestException(validationResult.error.errors);
    }

    const listing = this.listingsRepository.create({
      ...validationResult.data,
      userId,
      status: "draft",
      features: validationResult.data.features || [],
    });

    const saved = await this.listingsRepository.save(listing);

    // Przypisz zdjęcia do ogłoszenia jeśli podano imageIds
    if (dto.imageIds && dto.imageIds.length > 0) {
      await this.imagesRepository.update(
        { id: dto.imageIds as unknown as string },
        { listingId: saved.id },
      );
    }

    return this.findOne(saved.id, userId);
  }

  async findAll(userId?: string, status?: ListingStatus): Promise<Listing[]> {
    const query = this.listingsRepository.createQueryBuilder("listing")
      .leftJoinAndSelect("listing.images", "images")
      .orderBy("listing.createdAt", "DESC");

    if (userId) {
      query.andWhere("listing.userId = :userId", { userId });
    }

    if (status) {
      query.andWhere("listing.status = :status", { status });
    } else {
      // Domyślnie pokaż tylko opublikowane dla publicznych widoków
      if (!userId) {
        query.andWhere("listing.status = :status", { status: "published" });
      }
    }

    return query.getMany();
  }

  async findOne(id: string, userId?: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ["images"],
    });

    if (!listing) {
      throw new NotFoundException("Ogłoszenie nie zostało znalezione");
    }

    // Jeśli szkic lub zarchiwizowane - tylko właściciel może zobaczyć
    if (listing.status !== "published" && listing.userId !== userId) {
      throw new ForbiddenException("Brak dostępu do tego ogłoszenia");
    }

    return listing;
  }

  async findMyListings(userId: string): Promise<Listing[]> {
    return this.listingsRepository.find({
      where: { userId },
      relations: ["images"],
      order: { createdAt: "DESC" },
    });
  }

  async update(id: string, dto: UpdateListingDto, userId: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException("Ogłoszenie nie zostało znalezione");
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException("Nie masz uprawnień do edycji tego ogłoszenia");
    }

    // Walidacja danych
    const validationResult = updateListingSchema.safeParse(dto);
    if (!validationResult.success) {
      throw new BadRequestException(validationResult.error.errors);
    }

    // Aktualizacja pól
    Object.assign(listing, validationResult.data);

    // Aktualizuj przypisanie zdjęć jeśli podano
    if (dto.imageIds) {
      // Usuń stare przypisania
      await this.imagesRepository.update(
        { listingId: id },
        { listingId: null as unknown as string },
      );
      // Przypisz nowe
      if (dto.imageIds.length > 0) {
        for (const imageId of dto.imageIds) {
          await this.imagesRepository.update({ id: imageId }, { listingId: id });
        }
      }
    }

    await this.listingsRepository.save(listing);
    return this.findOne(id, userId);
  }

  async publish(id: string, userId: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ["images"],
    });

    if (!listing) {
      throw new NotFoundException("Ogłoszenie nie zostało znalezione");
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException("Nie masz uprawnień do publikacji tego ogłoszenia");
    }

    // Walidacja pełna przed publikacją
    const dataToValidate = {
      title: listing.title,
      description: listing.description,
      price: listing.price ? Number(listing.price) : undefined,
      city: listing.city,
      wojewodztwo: listing.wojewodztwo,
      propertyType: listing.propertyType,
      advertiserType: listing.advertiserType,
      plotSize: listing.plotSize,
      houseSize: listing.houseSize,
      features: listing.features || [],
      contactName: listing.contactName,
      contactPhone: listing.contactPhone,
      contactEmail: listing.contactEmail,
      negotiable: listing.negotiable,
      imageIds: listing.images?.map((img) => img.id) || [],
    };

    const validationResult = listingPublishSchema.safeParse(dataToValidate);
    if (!validationResult.success) {
      throw new BadRequestException({
        message: "Ogłoszenie nie spełnia wymagań do publikacji",
        errors: validationResult.error.errors,
      });
    }

    listing.status = "published";
    listing.publishedAt = new Date();

    await this.listingsRepository.save(listing);
    return this.findOne(id, userId);
  }

  async unpublish(id: string, userId: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException("Ogłoszenie nie zostało znalezione");
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException("Nie masz uprawnień do tej operacji");
    }

    listing.status = "draft";
    await this.listingsRepository.save(listing);
    return this.findOne(id, userId);
  }

  async archive(id: string, userId: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException("Ogłoszenie nie zostało znalezione");
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException("Nie masz uprawnień do tej operacji");
    }

    listing.status = "archived";
    await this.listingsRepository.save(listing);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException("Ogłoszenie nie zostało znalezione");
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException("Nie masz uprawnień do usunięcia tego ogłoszenia");
    }

    await this.listingsRepository.remove(listing);
  }

  // --- Obsługa zdjęć ---

  async saveImage(
    file: Express.Multer.File,
    listingId: string | null,
    userId: string,
    order: number = 0,
  ): Promise<ListingImage> {
    const image = this.imagesRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/listings/${file.filename}`,
      listingId: listingId || undefined,
      order,
    });

    return this.imagesRepository.save(image);
  }

  async removeImage(imageId: string, userId: string): Promise<void> {
    const image = await this.imagesRepository.findOne({
      where: { id: imageId },
      relations: ["listing"],
    });

    if (!image) {
      throw new NotFoundException("Zdjęcie nie zostało znalezione");
    }

    if (image.listing && image.listing.userId !== userId) {
      throw new ForbiddenException("Nie masz uprawnień do usunięcia tego zdjęcia");
    }

    await this.imagesRepository.remove(image);
  }

  async reorderImages(
    listingId: string,
    imageIds: string[],
    userId: string,
  ): Promise<void> {
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });

    if (!listing || listing.userId !== userId) {
      throw new ForbiddenException("Brak dostępu");
    }

    for (let i = 0; i < imageIds.length; i++) {
      await this.imagesRepository.update({ id: imageIds[i] }, { order: i });
    }
  }
}
