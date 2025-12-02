"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import {
  passwordResetRequestSchema,
  type PasswordResetRequestInput,
} from "@workspace/zod-validation/src/user";

export default function ResetHaslaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordResetRequestInput | "form", string>>
  >({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const data: PasswordResetRequestInput = {
      email: String(formData.get("email") ?? ""),
    };

    const result = passwordResetRequestSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof PasswordResetRequestInput | "form", string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof PasswordResetRequestInput | undefined;
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

    // 🔹 TU normalnie wyślesz request do API
    // fetch("/auth/reset-password-request", { method: "POST", body: JSON.stringify(result.data) })

    // 🔒 UX / security: nigdy nie mówimy, czy email istnieje
    // Zawsze ten sam neutralny komunikat po poprawnym formacie emaila
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="w-full border bg-card px-6 py-8 shadow-sm">
          {!success ? (
            <>
              <div className="mb-6 space-y-1 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Reset hasła
                </h1>
                <p className="text-sm text-muted-foreground">
                  Wpisz adres e-mail, na który wyślemy link do zmiany hasła.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <p className="text-xs text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                {errors.form && (
                  <p className="text-xs text-destructive">{errors.form}</p>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij link resetujący"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <Link
                  href="/logowanie"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Wróć do logowania
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-semibold">Sprawdź skrzynkę 📬</h2>
              <p className="text-sm text-muted-foreground">
                Jeśli podałeś poprawny adres e-mail, wyślemy Ci wiadomość z linkiem
                do zmiany hasła.
              </p>
              <p className="text-xs text-muted-foreground">
                Zajmie to zwykle kilka minut. Pamiętaj, aby sprawdzić także folder
                spam.
              </p>
              <Link
                href="/logowanie"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Wróć do logowania
              </Link>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
