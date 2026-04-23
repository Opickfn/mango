import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { onboardingService } from "../services/onboardingService";
import { 
  companySchema, 
  businessProfileSchema, 
  CompanyFormData, 
  BusinessProfileFormData 
} from "../schema/onboardingSchema";

export const useOnboarding = () => {
  const router = useRouter();
  const t = useTranslations("OnboardingPage");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      owner_name: "",
      sector: "Manufaktur",
      nib: "",
      established_year: new Date().getFullYear(),
      employee_count: 0,
    },
  });

  const businessProfileForm = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      vision: "",
      mission: "",
      main_product: "",
      annual_revenue: "",
      market_target: "",
    },
  });

  useEffect(() => {
    onboardingService.getUserOnboardingStatus()
      .then((res) => {
        // Backend returns { success: true, data: { user: {...} }, message: "" }
        const user = res.data.data?.user || res.data.user || res.data;
        
        if (!user || !user.email_verified_at) {
          router.push("/verify-email");
          return;
        }

        if (user.umkm) {
          companyForm.reset({
            name: user.umkm.name || "",
            owner_name: user.umkm.owner_name || user.name || "",
            sector: user.umkm.sector || "Manufaktur",
            nib: user.umkm.nib || "",
            established_year: user.umkm.established_year || new Date().getFullYear(),
            employee_count: user.umkm.employee_count || 0,
          });

          if (user.umkm.profile) {
            businessProfileForm.reset({
              vision: user.umkm.profile.vision || "",
              mission: user.umkm.profile.mission || "",
              main_product: user.umkm.profile.main_product || "",
              annual_revenue: user.umkm.profile.annual_revenue || "",
              market_target: user.umkm.profile.market_target || "",
            });
            setStep(2);
          } else {
            setStep(2);
          }
        } else if (user.name) {
            companyForm.setValue("owner_name", user.name);
        }
      })
      .catch((err) => {
        console.error("Onboarding fetch error:", err);
        router.push("/login");
      })
      .finally(() => setIsLoading(false));
  }, [router, companyForm, businessProfileForm]);

  const onCompanySubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      await onboardingService.submitCompany(data);
      setStatus({ type: "success", message: "Company information saved." });
      setStep(2);
    } catch (error: any) {
      setStatus({ type: "destructive", message: error.response?.data?.message || t("errors.server_error") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBusinessProfileSubmit = async (data: BusinessProfileFormData) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      await onboardingService.submitBusinessProfile(data);
      setStatus({ type: "success", message: "Onboarding completed!" });
      const locale = window.location.pathname.split("/")[1];
      window.location.href = `/${locale}/dashboard`;
    } catch (error: any) {
      setStatus({ type: "destructive", message: error.response?.data?.message || t("errors.server_error") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    isLoading,
    isSubmitting,
    status,
    setStatus,
    companyForm,
    businessProfileForm,
    onCompanySubmit: companyForm.handleSubmit(onCompanySubmit),
    onBusinessProfileSubmit: businessProfileForm.handleSubmit(onBusinessProfileSubmit),
    t,
  };
};
