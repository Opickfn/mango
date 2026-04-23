"use client";

import React from "react";
import { Mail, Loader2, LogOut, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export function VerifyEmailView() {
  const { handleResendVerification, handleLogout, isLoading, isAuthLoading, status, t } = useVerifyEmail();

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-mango-blue" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex bg-background font-sans text-foreground">
      <div className="hidden lg:flex lg:w-1/2 relative bg-mango-blue">
        <div
          role="img"
          aria-label="Email Verification"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-mango-blue/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-mango-blue/85 via-mango-blue/20 to-transparent" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:justify-start">
              <div className="p-4 rounded-full bg-mango-blue/10 text-mango-blue">
                <Mail size={40} />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-mango-blue">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">
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
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{t("resent_success")}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <Button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-mango-blue text-base font-bold text-white shadow-lg shadow-mango-blue/20 hover:bg-mango-hover"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  <span>{t("resend_button")}</span>
                </>
              ) : (
                <span>{t("resend_button")}</span>
              )}
            </Button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut size={18} />
              <span>{t("logout_button")}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
