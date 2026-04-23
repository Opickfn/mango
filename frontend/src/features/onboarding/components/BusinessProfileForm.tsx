"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { BusinessProfileFormData } from "../schema/onboardingSchema";

interface BusinessProfileFormProps {
  form: UseFormReturn<BusinessProfileFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  onBack: () => void;
  t: any;
}

export const BusinessProfileForm = ({ form, onSubmit, isSubmitting, onBack, t }: BusinessProfileFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t("vision")}</Label>
          <Textarea {...register("vision")} placeholder={t("vision_placeholder")} disabled={isSubmitting} />
        </div>

        <div className="space-y-2">
          <Label>{t("mission")}</Label>
          <Textarea {...register("mission")} placeholder={t("mission_placeholder")} disabled={isSubmitting} />
        </div>

        <div className="space-y-2">
          <Label>{t("main_product")}</Label>
          <Input {...register("main_product")} placeholder={t("main_product_placeholder")} disabled={isSubmitting} />
          {errors.main_product && <p className="text-sm text-destructive">{t(`errors.${errors.main_product.message}`)}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>{t("annual_revenue")}</Label>
            <Input {...register("annual_revenue")} placeholder={t("annual_revenue_placeholder")} disabled={isSubmitting} />
            {errors.annual_revenue && <p className="text-sm text-destructive">{t(`errors.${errors.annual_revenue.message}`)}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("market_target")}</Label>
            <Input {...register("market_target")} placeholder={t("market_target_placeholder")} disabled={isSubmitting} />
            {errors.market_target && <p className="text-sm text-destructive">{t(`errors.${errors.market_target.message}`)}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting} className="flex-1">
          {t("back")}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-mango-blue">
          {isSubmitting ? <Loader2 className="animate-spin" /> : t("complete")}
        </Button>
      </div>
    </form>
  );
};
