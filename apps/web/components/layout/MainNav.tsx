'use client';

import Link from "next/link";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import { Button } from "@workspace/ui/components/button";
import { useAuth } from "@/contexts/auth-context";

export function MainNav() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Siedliska pod Lasem
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/ogloszenia" className="text-sm hover:underline">
            Ogłoszenia
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/konto" className="text-sm hover:underline">
                Moje konto
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-sm"
              >
                Wyloguj
              </Button>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">
                Logowanie
              </Link>
              <Button asChild variant="default" size="sm">
                <Link href="/register">
                  Rejestracja
                </Link>
              </Button>
            </>
          )}
          
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
