import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { profileService } from "../services/profileService";
import { 
  profileSchema, 
  passwordSchema, 
  ProfileFormData, 
  PasswordFormData 
} from "../schema/profileSchema";

export const useProfile = () => {
  const { user, refreshUser } = useAuth();
  const t = useTranslations("ProfilePage");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      await profileService.updateProfile(data);
      await refreshUser();
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (err: any) {
      const responseData = err.response?.data;
      setStatus({ type: "destructive", message: responseData?.message || "Failed to update profile." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      await profileService.updatePassword(data);
      passwordForm.reset();
      setStatus({ type: "success", message: "Password updated successfully." });
    } catch (err: any) {
      const responseData = err.response?.data;
      if (responseData?.errors) {
        Object.keys(responseData.errors).forEach((key) => {
            passwordForm.setError(key as any, { message: responseData.errors[key][0] });
        });
      }
      setStatus({ type: "destructive", message: responseData?.message || "Failed to update password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    profileForm,
    passwordForm,
    onProfileSubmit: profileForm.handleSubmit(onProfileSubmit),
    onPasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    isSubmitting,
    status,
    setStatus,
    t,
  };
};
