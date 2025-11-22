import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

type ListingCardProps = {
  title: string;
  location: string;
  price: string;
  plotArea: string;
  houseArea?: string;
  tags?: string[];
  imageUrl?: string;
};

export function ListingCard({
  title,
  location,
  price,
  plotArea,
  houseArea,
  tags = [],
  imageUrl = "/images/hurtlink-dashboard.png",
}: ListingCardProps) {
  return (
    <Card className="w-full overflow-hidden border bg-card">
      <div className="flex gap-4">
        {/* LEWA STRONA – ZDJĘCIE (KWADRAT) */}
        <div className="flex-shrink-0">
          <div className="relative aspect-square w-28 md:w-36 lg:w-40 overflow-hidden rounded-lg bg-muted">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* PRAWA STRONA – TREŚĆ OGŁOSZENIA */}
        <div className="flex flex-1 flex-col justify-between py-3 pr-3">
          {/* Tytuł + lokalizacja */}
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {location}
            </p>
          </div>

          {/* Tagi (cechy siedliska) */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] uppercase tracking-wide"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Cena + powierzchnie */}
          <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-lg font-bold text-primary">
                {price}
              </p>
              <p className="text-xs text-muted-foreground">
                Działka {plotArea}
                {houseArea ? ` • dom ${houseArea}` : ""}
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Siedlisko • ogłoszenie prywatne
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
