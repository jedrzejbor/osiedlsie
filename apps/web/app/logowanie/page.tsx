"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { userLoginSchema } from "@workspace/zod-validation/src/user";
import type { UserLoginInput } from "@workspace/zod-validation/src/user";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserLoginInput | "form", string>>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const data = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const result = userLoginSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof UserLoginInput | "form", string>> =
        {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UserLoginInput | undefined;
        if (field) {
          fieldErrors[field] = issue.message;
        } else {
          fieldErrors.form = issue.message;
        }
      });

      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // TODO: tu później wywołasz /auth/login na backendzie
    console.log("Login payload (valid):", result.data);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
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
            {/* email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Adres e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jan.kowalski@example.com"
                required
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
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
                required
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
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
            {/* miejsce na przypomnienie hasła w przyszłości */}
            <p className="text-xs">
              <Link
                href="/reset-hasla"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >Zapomniałeś hasła?</Link> Opcja resetu pojawi się tutaj później.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
