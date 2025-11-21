import { z } from "zod";

export const userRoleSchema = z.enum(["ADMIN", "SUPPLIER", "SELLER"]);

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: userRoleSchema.default("SELLER"),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
