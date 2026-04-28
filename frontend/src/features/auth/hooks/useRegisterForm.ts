import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { authService } from "../services/authService";
import { registerSchema, RegisterFormData } from "../schema/registerSchema";

export const useRegisterForm = () => {
  const router = useRouter();
  const t = useTranslations("RegisterPage");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await authService.register(data);
      router.push("/verify-email");
    } catch (error: any) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      console.error("Full Registration error:", responseData);

      if (status === 422) {
        if (responseData?.errors) {
          Object.keys(responseData.errors).forEach((key) => {
            const serverMessage = responseData.errors[key][0];
            let messageKey = serverMessage;
            
            // Map common Laravel error messages to translation keys if they match
            if (serverMessage.includes("email has already been taken")) {
                messageKey = "email_taken";
            } else if (serverMessage.includes("greater than 2048 kilobytes")) {
                messageKey = "avatar_too_large";
            }

            form.setError(key as any, {
              message: messageKey,
            });
          });
        } else {
          setServerError(responseData?.message || "Data yang diberikan tidak valid.");
        }
      } else if (status >= 500) {
        setServerError("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
      } else {
        setServerError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    serverError,
    t,
  };
};
