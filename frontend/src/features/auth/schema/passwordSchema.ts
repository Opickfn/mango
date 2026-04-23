import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "email_required").email("email_invalid"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "token_required"),
  email: z.string().min(1, "email_required").email("email_invalid"),
  password: z.string().min(8, "password_min_8"),
  password_confirmation: z.string().min(1, "password_confirmation_required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "password_mismatch",
  path: ["password_confirmation"],
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
