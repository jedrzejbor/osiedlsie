// packages/zod-validation/src/user.ts
import { z } from "zod";

// Role – na razie prosto: zwykły użytkownik + admin.
// Zawsze możesz później rozszerzyć (np. AGENCY, OWNER, itp.)
export const userRoleSchema = z.enum(["USER", "ADMIN"]);

export type UserRole = z.infer<typeof userRoleSchema>;

// Wspólny kawałek walidacji hasła – możesz go użyć w kilku schematach
const passwordSchema = z
  .string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków");

// Schemat rejestracji użytkownika
export const userRegisterSchema = z.object({
  name: z
    .string()
    .min(1, "Imię lub nazwa jest wymagane")
    .max(80, "Maksymalnie 80 znaków")
    .optional(), // jak chcesz, możesz zrobić .optional() lub .min(1) bez optional
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: passwordSchema,
  role: userRoleSchema.default("USER"),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;

// Schemat logowania – tylko email + hasło
export const userLoginSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: passwordSchema,
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

// Opcjonalnie: możesz zostawić alias na potrzeby backendu
export const userCreateSchema = userRegisterSchema;
export type UserCreateInput = z.infer<typeof userCreateSchema>;


export const passwordResetRequestSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
});

export type PasswordResetRequestInput = z.infer<
  typeof passwordResetRequestSchema
>;

export const passwordResetSchema = z.object({
  password: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
