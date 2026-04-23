"use client";

import React from "react";
import { Link } from "@/src/i18n/navigation";
import { AlertCircle, ChevronLeft, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useResetPassword } from "../hooks/useResetPassword";

interface ResetPasswordViewProps {
  token: string;
  email: string;
}

export function ResetPasswordView({ token, email }: ResetPasswordViewProps) {
  const { form, onSubmit, isLoading, error, t } = useResetPassword(token, email);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={16} />
          {t("back_to_login")}
        </Link>

        <div className="space-y-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <KeyRound size={22} />
            </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email_label")}</Label>
            <Input id="email" type="email" {...form.register("email")} disabled required className="h-11 rounded-xl bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("new_password_label")}</Label>
            <Input id="password" type="password" {...form.register("password")} disabled={isLoading} className="h-11 rounded-xl" />
            {form.formState.errors.password && (
                <p className="text-sm text-destructive">{t(`errors.${form.formState.errors.password.message}`)}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">{t("confirm_password_label")}</Label>
            <Input id="password_confirmation" type="password" {...form.register("password_confirmation")} disabled={isLoading} className="h-11 rounded-xl" />
            {form.formState.errors.password_confirmation && (
                <p className="text-sm text-destructive">{t(`errors.${form.formState.errors.password_confirmation.message}`)}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-11 font-bold rounded-xl">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : t("submit_button")}
          </Button>
        </form>
      </div>
    </main>
  );
}
