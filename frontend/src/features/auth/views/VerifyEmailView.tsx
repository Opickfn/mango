"use client";

import React from "react";
import { Mail, Loader2, LogOut, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import Image from "next/image";

export function VerifyEmailView() {
  const { handleResendVerification, handleLogout, isLoading, isAuthLoading, status, t } = useVerifyEmail();

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex bg-background font-sans text-foreground">
      {/* Hero Section (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary">
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
            Aktivasi <span className="text-accent">Akun</span>
          </h2>
          <p className="text-lg text-white/90">
            Satu langkah lagi untuk bergabung dalam ekosistem manufaktur cerdas MANGO.
          </p>
        </div>
      </div>

      {/* Content Section (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background relative">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-sm border border-primary/5">
                <Mail size={28} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-3">
              {t("title")}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
          </div>

          <AnimatePresence>
            {status === "verification-link-sent" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert variant="success" className="bg-success/5 border-success/20">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success font-medium italic">
                    {t("resent_success")}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <Button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-primary text-base font-black text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  <span>Mengirim ulang...</span>
                </>
              ) : (
                <span>{t("resend_button")}</span>
              )}
            </Button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 text-sm font-bold text-muted-foreground transition-all hover:text-destructive group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>{t("logout_button")}</span>
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center lg:text-left">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">
                Akses Terverifikasi MANGO v2.0
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
