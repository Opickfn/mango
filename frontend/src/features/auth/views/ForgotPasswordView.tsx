"use client";

import React from "react";
import { Link } from "@/src/i18n/navigation";
import { AlertCircle, ChevronLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useForgotPassword } from "../hooks/useForgotPassword";

export function ForgotPasswordView() {
  const { form, onSubmit, isLoading, message, error, t } = useForgotPassword();

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={16} />
          {t("back_to_login")}
        </Link>

        <div className="space-y-2">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Mail size={22} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {message && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email_label")}</Label>
            <Input 
                id="email" 
                type="email" 
                {...form.register("email")} 
                disabled={isLoading}
                placeholder={t("email_placeholder")}
                className="h-11 rounded-xl"
            />
            {form.formState.errors.email && (
                <p className="text-sm text-destructive">{t(`errors.${form.formState.errors.email.message}`)}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-11 font-bold rounded-xl bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : t("submit_button")}
          </Button>
        </form>
      </div>
    </main>
  );
}
