import Link from "next/link";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"

export function MainNav() {
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Siedliska pod Lasem
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/ogloszenia" className="text-sm">
            Ogłoszenia
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
