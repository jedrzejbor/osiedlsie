import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Listing } from "./listing.entity";

@Entity("listing_images")
export class ListingImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column({ default: 0 })
  order: number;

  @Column()
  path: string;

  @Column({ type: "uuid" })
  listingId: string;

  @ManyToOne(() => Listing, (listing) => listing.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "listingId" })
  listing: Listing;

  @CreateDateColumn()
  createdAt: Date;
}
