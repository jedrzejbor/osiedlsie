import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { ListingsController } from "./listings.controller";
import { ListingsService } from "./listings.service";
import { Listing } from "./entities/listing.entity";
import { ListingImage } from "./entities/listing-image.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, ListingImage]),
    MulterModule.register({
      dest: "./uploads/listings",
    }),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
