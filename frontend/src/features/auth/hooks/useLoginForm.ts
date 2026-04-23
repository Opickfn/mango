import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { authService } from "../services/authService";
import { loginSchema, LoginFormData } from "../schema/loginSchema";

export const useLoginForm = () => {
  const t = useTranslations("LoginPage");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await authService.login(data);
      const locale = window.location.pathname.split("/")[1];
      window.location.href = `/${locale}/dashboard?login=success`;
    } catch (error: any) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      if (status === 422) {
        if (responseData?.errors) {
          Object.keys(responseData.errors).forEach((key) => {
            form.setError(key as keyof LoginFormData, {
              message: responseData.errors[key][0],
            });
          });
        } else {
          setServerError(responseData?.message || t("errors.wrong_credentials"));
        }
      } else if (status === 401) {
        setServerError(responseData?.message || t("errors.wrong_credentials"));
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
