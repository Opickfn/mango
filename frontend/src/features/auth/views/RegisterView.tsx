"use client";

import React, { useRef, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Camera,
  Upload,
} from "lucide-react";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import Image from "next/image";

export const RegisterView = () => {
  const { form, onSubmit, isLoading, serverError, t } = useRegisterForm();
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setValue("avatar" as any, file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-background font-sans text-foreground">
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary overflow-hidden">
        <Image
          src="/images/login-hero.jpg"
          alt="Manufaktur Industri"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 0vw, 50vw"
        />

        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold font-heading mb-4">
            Ekosistem <span className="text-accent">MANGO</span>
          </h2>

          <p className="text-lg text-white/90 leading-relaxed">
            Daftarkan bisnis UMKM Anda sekarang dan mulai transformasi menuju
            manufaktur cerdas yang modern dan efisien.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:py-16 bg-background relative overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">
              {t("title")}
            </h1>

            <p className="text-muted-foreground">
              {t.rich("subtitle", {
                accent: (chunks) => (
                  <span className="text-accent font-semibold">{chunks}</span>
                ),
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
                <Alert className="rounded-xl border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-sm font-medium text-destructive">
                    {serverError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("profile_picture_label")}
              </Label>

              <div
                onClick={handleAvatarClick}
                className={`relative group cursor-pointer border rounded-2xl transition-all flex flex-col items-center justify-center h-28 w-28 shadow-sm hover:shadow-md ${
                  previewUrl
                    ? "border-primary/40 bg-background"
                    : "border-border hover:border-primary/40 bg-muted/20"
                }`}
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full rounded-[14px] object-cover"
                    />

                    <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-full shadow-lg border-2 border-white">
                      <Camera size={12} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Upload size={20} strokeWidth={1.5} />
                    </div>

                    <p className="text-sm font-medium text-foreground">
                      {t("upload_label")}
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-muted-foreground"
                >
                  {t("name_label")}
                </Label>

                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User size={18} strokeWidth={1.5} />
                  </div>

                  <Input
                    id="name"
                    {...register("name")}
                    placeholder={t("name_placeholder")}
                    disabled={isLoading}
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
                  />
                </div>

                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {t(`errors.${errors.name.message}`)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-muted-foreground"
                >
                  {t("email_label")}
                </Label>

                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>

                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder={t("email_placeholder")}
                    disabled={isLoading}
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
                  />
                </div>

                {errors.email && (
                  <p className="text-sm font-medium text-destructive">
                    {t(`errors.${errors.email.message}`)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {t("password_label")}
                  </Label>

                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock size={18} strokeWidth={1.5} />
                    </div>

                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
                    />
                  </div>

                  {errors.password && (
                    <p className="text-sm font-medium text-destructive">
                      {t(`errors.${errors.password.message}`)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password_confirmation"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {t("password_confirmation_label")}
                  </Label>

                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock size={18} strokeWidth={1.5} />
                    </div>

                    <Input
                      id="password_confirmation"
                      type="password"
                      {...register("password_confirmation")}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  <span>{t("processing")}</span>
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("submit_button")}
                  <ArrowRight size={18} strokeWidth={2.2} />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("already_have_account")}{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:text-accent underline underline-offset-4"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};