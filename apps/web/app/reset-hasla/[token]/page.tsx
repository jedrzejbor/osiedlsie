"use client";

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Link from "next/link";

import {
  passwordResetSchema,
  type PasswordResetInput,
} from "@workspace/zod-validation/src/user";

type ResetPasswordPageParams = {
  token: string;
};

export default function ResetPasswordPage() {
  const params = useParams<ResetPasswordPageParams>();
  const token = params?.token;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordResetInput | "confirmPassword" | "form", string>>
  >({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Hasła muszą być takie same.",
      });
      setIsSubmitting(false);
      return;
    }

    const result = passwordResetSchema.safeParse({ password });

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof PasswordResetInput | "confirmPassword" | "form", string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof PasswordResetInput | undefined;
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

    // 🔹 tutaj normalnie:
    // POST /auth/reset-password { token, password: result.data.password }

    console.log("Reset password token:", token);
    console.log("New password:", result.data.password);

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
                  Ustaw nowe hasło
                </h1>
                <p className="text-sm text-muted-foreground">
                  Wprowadź nowe hasło dla swojego konta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Nowe hasło</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimum 8 znaków"
                    required
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password}
                    </p>
                  )}
                </div>

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
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {errors.form && (
                  <p className="text-xs text-destructive">{errors.form}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Zapisywanie..." : "Zapisz nowe hasło"}
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
              <h2 className="text-xl font-semibold">Hasło zmienione 🔒</h2>
              <p className="text-sm text-muted-foreground">
                Możesz teraz zalogować się używając nowego hasła.
              </p>
              <Link
                href="/logowanie"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Przejdź do logowania
              </Link>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
