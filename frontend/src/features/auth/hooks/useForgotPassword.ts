import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { authService } from "../services/authService";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../schema/passwordSchema";

export const useForgotPassword = () => {
  const t = useTranslations("ForgotPasswordPage");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await authService.forgotPassword(data);
      setMessage(response.data?.status || "Reset link sent.");
    } catch (err: any) {
      const responseData = err.response?.data;
      setError(responseData?.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    message,
    error,
    t,
  };
};
