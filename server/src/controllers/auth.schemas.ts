import { z } from "zod";

const emailSchema = z
  .string()
  .email({ message: "Invalid email" })
  .min(6, { message: "Email is required" })
  .max(255);

const passwordSchema = z
  .string()
  .min(6, { message: "Password too short" })
  .max(255, { message: "Password too long" });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password too short" })
      .max(255, { message: "Confirm password too long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export const forgetPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  token: z.string(),
});

export const verificationCodeSchema = z
  .string()
  .min(1, { message: "Code required" })
  .max(24, { message: "Code too long" });
