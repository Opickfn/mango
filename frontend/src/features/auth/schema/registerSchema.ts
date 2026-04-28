import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "name_required"),
  email: z.string().min(1, "email_required").email("email_invalid"),
  password: z.string().min(8, "password_min_8"),
  password_confirmation: z.string().min(1, "password_confirmation_required"),
  avatar: z.any()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size <= 2 * 1024 * 1024), "avatar_too_large"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "password_mismatch",
  path: ["password_confirmation"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
