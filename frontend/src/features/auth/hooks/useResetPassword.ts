import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { authService } from "../services/authService";
import { resetPasswordSchema, ResetPasswordFormData } from "../schema/passwordSchema";

export const useResetPassword = (token: string, email: string) => {
  const router = useRouter();
  const t = useTranslations("ResetPasswordPage");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      email,
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(data);
      router.push("/login");
    } catch (err: any) {
      const responseData = err.response?.data;
      setError(responseData?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    t,
  };
};
