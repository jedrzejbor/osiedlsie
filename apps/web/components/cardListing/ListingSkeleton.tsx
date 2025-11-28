import { Card } from "@workspace/ui/components/card";

export function ListingSkeleton() {
  return (
    <Card className="w-full overflow-hidden border bg-card">
      <div className="flex flex-col gap-4 md:flex-row animate-pulse">
        {/* Lewa część – pseudo-zdjęcie */}
        <div className="md:flex-shrink-0">
          <div className="w-full aspect-[4/3] md:w-36 md:aspect-square lg:w-80 rounded-lg bg-muted" />
        </div>

        {/* Prawa część */}
        <div className="flex flex-1 flex-col justify-between px-3 pb-3 pt-2 md:py-6 md:pr-3 md:pl-0">
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="h-5 w-24 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
