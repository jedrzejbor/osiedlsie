import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseUUIDPipe,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";
import { ListingsService } from "./listings.service";
import { CreateListingDto, UpdateListingDto } from "./dto/listing.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ListingStatus } from "./entities/listing.entity";

// Konfiguracja storage dla multer
const storage = diskStorage({
  destination: "./uploads/listings",
  filename: (req, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const imageFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(new BadRequestException("Dozwolone formaty: JPEG, PNG, WebP"), false);
  }
  cb(null, true);
};

@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // --- Publiczne endpointy ---

  @Get()
  async findAll(@Query("status") status?: ListingStatus) {
    return this.listingsService.findAll(undefined, status || "published");
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.listingsService.findOne(id);
  }

  // --- Endpointy wymagające autoryzacji ---

  @UseGuards(JwtAuthGuard)
  @Get("my/all")
  async findMyListings(@Request() req: any) {
    return this.listingsService.findMyListings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateListingDto, @Request() req: any) {
    return this.listingsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateListingDto,
    @Request() req: any,
  ) {
    return this.listingsService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/publish")
  async publish(@Param("id", ParseUUIDPipe) id: string, @Request() req: any) {
    return this.listingsService.publish(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/unpublish")
  async unpublish(@Param("id", ParseUUIDPipe) id: string, @Request() req: any) {
    return this.listingsService.unpublish(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/archive")
  async archive(@Param("id", ParseUUIDPipe) id: string, @Request() req: any) {
    return this.listingsService.archive(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string, @Request() req: any) {
    await this.listingsService.remove(id, req.user.userId);
    return { message: "Ogłoszenie zostało usunięte" };
  }

  // --- Upload zdjęć ---

  @UseGuards(JwtAuthGuard)
  @Post("images/upload")
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body("listingId") listingId: string | undefined,
    @Request() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("Nie przesłano żadnych plików");
    }

    const savedImages = await Promise.all(
      files.map((file, index) =>
        this.listingsService.saveImage(
          file,
          listingId || null,
          req.user.userId,
          index,
        ),
      ),
    );

    return savedImages;
  }

  @UseGuards(JwtAuthGuard)
  @Post("images/upload-single")
  @UseInterceptors(
    FileInterceptor("image", {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Body("listingId") listingId: string | undefined,
    @Body("order") order: string | undefined,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException("Nie przesłano pliku");
    }

    return this.listingsService.saveImage(
      file,
      listingId || null,
      req.user.userId,
      order ? parseInt(order, 10) : 0,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("images/:imageId")
  async removeImage(
    @Param("imageId", ParseUUIDPipe) imageId: string,
    @Request() req: any,
  ) {
    await this.listingsService.removeImage(imageId, req.user.userId);
    return { message: "Zdjęcie zostało usunięte" };
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/images/reorder")
  async reorderImages(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("imageIds") imageIds: string[],
    @Request() req: any,
  ) {
    await this.listingsService.reorderImages(id, imageIds, req.user.userId);
    return { message: "Kolejność zdjęć została zaktualizowana" };
  }
}
