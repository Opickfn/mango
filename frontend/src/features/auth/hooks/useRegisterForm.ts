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

      if (status === 422) {
        if (responseData?.errors) {
          Object.keys(responseData.errors).forEach((key) => {
            form.setError(key as keyof RegisterFormData, {
              message: responseData.errors[key][0],
            });
          });
        } else {
          setServerError(responseData?.message || t("errors.server_error"));
        }
      } else if (status >= 500) {
        setServerError(t("errors.server_error"));
      } else {
        setServerError(t("errors.network_error"));
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
