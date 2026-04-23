import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { authService } from "../services/authService";
import { useAuth } from "@/src/components/providers/AuthProvider";

export const useVerifyEmail = () => {
  const router = useRouter();
  const t = useTranslations("VerifyEmailPage");
  const { user, refreshUser, logout, isLoading: isAuthLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && user?.email_verified_at) {
      router.push("/onboarding");
    }
  }, [user, isAuthLoading, router]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      await authService.resendVerification();
      setStatus("verification-link-sent");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleResendVerification,
    handleLogout: logout,
    isLoading,
    isAuthLoading,
    status,
    t,
  };
};
