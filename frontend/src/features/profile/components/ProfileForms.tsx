"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Save, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card";
import { ProfileFormData, PasswordFormData } from "../schema/profileSchema";

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  t: any;
}

export const ProfileForm = ({ form, onSubmit, isSubmitting, t }: ProfileFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("personal_info")}</CardTitle>
        <CardDescription>{t("personal_info_desc")}</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("full_name")}</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="name" {...register("name")} className="pl-10" disabled={isSubmitting} />
            </div>
            {errors.name && <p className="text-sm text-destructive">{t(`errors.${errors.name.message}`)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email_address")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" {...register("email")} className="pl-10" disabled={isSubmitting} />
            </div>
            {errors.email && <p className="text-sm text-destructive">{t(`errors.${errors.email.message}`)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone_number")}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="phone" {...register("phone")} className="pl-10" disabled={isSubmitting} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 pt-6">
          <Button type="submit" disabled={isSubmitting} className="ml-auto">
            {isSubmitting ? t("saving") : t("save_changes")}
            {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

interface PasswordFormProps {
  form: UseFormReturn<PasswordFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  t: any;
}

export const PasswordForm = ({ form, onSubmit, isSubmitting, t }: PasswordFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("change_password")}</CardTitle>
        <CardDescription>{t("change_password_desc")}</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">{t("current_password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="current_password" type="password" {...register("current_password")} className="pl-10" disabled={isSubmitting} />
            </div>
            {errors.current_password && <p className="text-sm text-destructive">{errors.current_password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("new_password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" {...register("password")} className="pl-10" disabled={isSubmitting} />
            </div>
            {errors.password && <p className="text-sm text-destructive">{t(`errors.${errors.password.message}`)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">{t("confirm_password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password_confirmation" type="password" {...register("password_confirmation")} className="pl-10" disabled={isSubmitting} />
            </div>
            {errors.password_confirmation && <p className="text-sm text-destructive">{t(`errors.${errors.password_confirmation.message}`)}</p>}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 pt-6">
          <Button type="submit" variant="destructive" disabled={isSubmitting} className="ml-auto">
            {isSubmitting ? t("updating") : t("update_password")}
            {!isSubmitting && <Lock className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
