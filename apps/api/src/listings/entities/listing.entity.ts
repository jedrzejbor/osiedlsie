import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { ListingImage } from "./listing-image.entity";

export type PropertyType =
  | "dom"
  | "dzialka"
  | "dom_z_dzialka"
  | "siedlisko"
  | "gospodarstwo";

export type AdvertiserType = "prywatny" | "firma" | "agencja";

export type PropertyFeature =
  | "przy_lesie"
  | "bez_sasiadow_300m"
  | "do_remontu"
  | "gotowe_do_zamieszkania"
  | "z_widokiem"
  | "przy_jeziorze"
  | "przy_rzece"
  | "media_w_dzialce"
  | "droga_asfaltowa"
  | "okolica_spokojna";

export type ListingStatus = "draft" | "published" | "archived";

@Entity("listings")
export class Listing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  title: string | null;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  price: number | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  wojewodztwo: string | null;

  @Column({ type: "varchar", length: 30, nullable: true })
  propertyType: PropertyType | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  advertiserType: AdvertiserType | null;

  @Column({ type: "int", nullable: true })
  plotSize: number | null;

  @Column({ type: "int", nullable: true })
  houseSize: number | null;

  @Column({ type: "simple-array", nullable: true })
  features: PropertyFeature[];

  @Column({ type: "varchar", length: 100, nullable: true })
  contactName: string | null;

  @Column({ type: "varchar", length: 30, nullable: true })
  contactPhone: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  contactEmail: string | null;

  @Column({ default: false })
  negotiable: boolean;

  @Column({
    type: "varchar",
    length: 20,
    default: "draft",
  })
  status: ListingStatus;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => ListingImage, (image) => image.listing, {
    cascade: true,
    eager: true,
  })
  images: ListingImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  publishedAt: Date | null;
}
