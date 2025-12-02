"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  userRegisterSchema,
  type UserRegisterInput,
} from "@workspace/zod-validation/src/user";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserRegisterInput | "confirmPassword" | "form", string>>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const rawPassword = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (rawPassword !== confirm) {
      setErrors({
        confirmPassword: "Hasła muszą być takie same.",
      });
      setIsSubmitting(false);
      return;
    }

    const data: UserRegisterInput = {
      name: formData.get("name")
        ? String(formData.get("name"))
        : undefined,
      email: String(formData.get("email") ?? ""),
      password: rawPassword,
      role: "USER", // lub zostaw default z schematu
    };

    const result = userRegisterSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof UserRegisterInput | "confirmPassword" | "form", string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UserRegisterInput | undefined;
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

    // TODO: tu później wywołasz /auth/register
    console.log("Register payload (valid):", result.data);

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
              Załóż konto
            </h1>
            <p className="text-sm text-muted-foreground">
              Utwórz konto, aby dodawać i obserwować ogłoszenia.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* imię / nazwa */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Imię lub nazwa</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jan Kowalski"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
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
                autoComplete="new-password"
                placeholder="Minimum 8 znaków"
                required
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>


            {/* powtórz hasło */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Powtórz hasło</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Powtórz hasło"
                required
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>


            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Tworzenie konta..." : "Zarejestruj się"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
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
