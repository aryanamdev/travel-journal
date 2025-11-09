// src/schemas/auth.ts
import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.email("Invalid email"),
  fullName: z.string().min(2, "Full name too short"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const VerifySchema = z.object({
  token: z.string().min(10, "Invalid token"),
});

export const TokenSchema = VerifySchema

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type ViewerDTO = z.infer<typeof TokenSchema>
export type VerifyDTO = z.infer<typeof VerifySchema>;
