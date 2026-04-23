"use client";

import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Link } from "@/src/i18n/navigation";
import { useRegisterForm } from "../hooks/useRegisterForm";

export function RegisterView() {
  const { form, onSubmit, isLoading, serverError, t } = useRegisterForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen w-full flex bg-background font-sans text-foreground">
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" 
          alt="Manufacturing Industry" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-mango-blue/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-mango-blue/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold font-heading mb-4">
            {t.rich("hero_title", {
              accent: (chunks) => <span className="text-accent">{chunks}</span>
            })}
          </h2>
          <p className="text-lg text-white/90">
            {t("hero_desc")}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background relative">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-mango-blue tracking-tight mb-2">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">
              {t.rich("subtitle", {
                accent: (chunks) => <span className="text-accent font-bold">{chunks}</span>
              })}
            </p>
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {serverError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                {t("name_label")}
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder={t("name_placeholder")}
                disabled={isLoading}
                className={`h-11 rounded-xl bg-muted/50 transition-all ${
                  form.formState.errors.name ? "border-destructive" : "focus-visible:ring-mango-blue"
                }`}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive font-medium mt-1">
                  {t(`errors.${form.formState.errors.name.message}`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                {t("email_label")}
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder={t("email_placeholder")}
                disabled={isLoading}
                className={`h-11 rounded-xl bg-muted/50 transition-all ${
                  form.formState.errors.email ? "border-destructive" : "focus-visible:ring-mango-blue"
                }`}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive font-medium mt-1">
                  {t(`errors.${form.formState.errors.email.message}`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                {t("password_label")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder={t("password_placeholder")}
                  disabled={isLoading}
                  className={`h-11 rounded-xl bg-muted/50 pr-12 transition-all ${
                    form.formState.errors.password ? "border-destructive" : "focus-visible:ring-mango-blue"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive font-medium mt-1">
                  {t(`errors.${form.formState.errors.password.message}`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-sm font-semibold">
                {t("password_confirmation_label")}
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("password_confirmation")}
                  placeholder={t("password_confirmation_placeholder")}
                  disabled={isLoading}
                  className={`h-11 rounded-xl bg-muted/50 pr-12 transition-all ${
                    form.formState.errors.password_confirmation ? "border-destructive" : "focus-visible:ring-mango-blue"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.formState.errors.password_confirmation && (
                <p className="text-sm text-destructive font-medium mt-1">
                  {t(`errors.${form.formState.errors.password_confirmation.message}`)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-mango-blue hover:bg-mango-hover text-white rounded-xl font-bold mt-4"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>{t("processing")}</span>
                </div>
              ) : (
                t("submit_button")
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
            {t("already_have_account")}{" "}
            <Link href="/login" className="text-mango-blue font-bold hover:text-accent transition-colors">
              {t("login_link")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
