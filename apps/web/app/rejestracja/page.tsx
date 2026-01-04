"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";

export default function RejestrPage() {
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await registerUser({ email, password, name: name || undefined });
      // Redirect is handled in AuthContext
    } catch (err: any) {
      setError(err.message || "Nie udało się zarejestrować");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* przełącznik motywu w prawym górnym rogu */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <Card className="w-full border bg-card px-6 py-8 shadow-sm">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Zarejestruj się
            </h1>
            <p className="text-sm text-muted-foreground">
              Utwórz konto, aby korzystać z platformy.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* imię i nazwisko (opcjonalne) */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Imię i nazwisko (opcjonalne)</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jan Kowalski"
                disabled={isSubmitting}
              />
            </div>

            {/* email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Adres e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jan.kowalski@example.com"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* hasło */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 znaków
              </p>
            </div>

            {/* CTA */}
            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Rejestrowanie..." : "Utwórz konto"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Masz już konto?{" "}
              <Link
                href="/logowanie"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Zaloguj się
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}