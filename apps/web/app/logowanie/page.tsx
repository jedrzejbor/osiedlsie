"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";

export default function LoginPage() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await login({ email, password });
      // Redirect is handled in AuthContext
    } catch (err: any) {
      setError(err.message || "Nie udało się zalogować");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4">

      <div className="w-full max-w-md">
        <Card className="w-full border bg-card px-6 py-8 shadow-sm">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Zaloguj się
            </h1>
            <p className="text-sm text-muted-foreground">
              Wejdź na swoje konto, aby zarządzać ogłoszeniami.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

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
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* CTA */}
            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
            <p>
              Nie masz jeszcze konta?{" "}
              <Link
                href="/rejestracja"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Zarejestruj się
              </Link>
            </p>
            <p>
              <Link
                href="/reset-hasla"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Zapomniałeś hasła?
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}