import { Button } from "@workspace/ui/components/button"
import z from "zod"


export default function Page() {
  const schema = z.object({
    name: z.string(),
  });

  
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Siedliska pod lasem</h1>
        <Button size="sm">Przeglądaj oferty</Button>
        <Button size="sm">Dodaj oferte</Button>
      </div>
    </div>
  )
}
