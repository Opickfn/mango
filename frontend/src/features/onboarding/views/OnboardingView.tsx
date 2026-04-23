"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { CompanyForm } from "../components/CompanyForm";
import { BusinessProfileForm } from "../components/BusinessProfileForm";
import { useOnboarding } from "../hooks/useOnboarding";

export function OnboardingView() {
  const { 
    step, 
    setStep, 
    isLoading, 
    isSubmitting, 
    status,
    setStatus,
    companyForm, 
    businessProfileForm,
    onCompanySubmit,
    onBusinessProfileSubmit,
    t 
  } = useOnboarding();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-mango-blue h-12 w-12" />
        <p className="mt-4 text-muted-foreground animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mango-blue/10 mb-4">
            <img src="/images/logos/logo-mango.png" alt="Logo" className="w-10 h-auto" />
          </div>
          <h1 className="text-3xl font-extrabold text-mango-blue">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-mango-blue" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-mango-blue bg-mango-blue text-white" : "border-muted"}`}>
                {step > 1 ? <CheckCircle2 size={16} /> : "1"}
              </div>
              <span className="text-sm font-semibold">{t("step_1")}</span>
            </div>
            <div className="w-12 h-px bg-muted" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-mango-blue" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-mango-blue bg-mango-blue text-white" : "border-muted"}`}>
                2
              </div>
              <span className="text-sm font-semibold">{t("step_2")}</span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-2xl shadow-sm border p-6 md:p-10">
          <AnimatePresence mode="wait">
            {status && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert variant={status.type}>
                  {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription className="flex items-center justify-between">
                    {status.message}
                    <button onClick={() => setStatus(null)} className="ml-4 text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100">
                      Close
                    </button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold">{t("company_info_title")}</h2>
                  <p className="text-muted-foreground text-sm">{t("company_info_desc")}</p>
                </div>
                <CompanyForm 
                  form={companyForm} 
                  onSubmit={onCompanySubmit} 
                  isSubmitting={isSubmitting} 
                  t={t} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold">{t("business_profile_title")}</h2>
                  <p className="text-muted-foreground text-sm">{t("business_profile_desc")}</p>
                </div>
                <BusinessProfileForm 
                  form={businessProfileForm} 
                  onSubmit={onBusinessProfileSubmit} 
                  isSubmitting={isSubmitting} 
                  onBack={() => setStep(1)}
                  t={t} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
