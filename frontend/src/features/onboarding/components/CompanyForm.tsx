"use client";

import React from "react";
import { Store, User as UserIcon, Calendar, Users as UsersIcon, Briefcase, FileText, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { CompanyFormData } from "../schema/onboardingSchema";

interface CompanyFormProps {
  form: UseFormReturn<CompanyFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  t: any;
}

export const CompanyForm = ({ form, onSubmit, isSubmitting, t }: CompanyFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Store size={16} className="text-mango-blue" />
            {t("company_name")}
          </Label>
          <Input {...register("name")} placeholder={t("company_name_placeholder")} disabled={isSubmitting} />
          {errors.name && <p className="text-sm text-destructive">{t(`errors.${errors.name.message}`)}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <UserIcon size={16} className="text-mango-blue" />
            {t("owner_name")}
          </Label>
          <Input {...register("owner_name")} placeholder={t("owner_name_placeholder")} disabled={isSubmitting} />
          {errors.owner_name && <p className="text-sm text-destructive">{t(`errors.${errors.owner_name.message}`)}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Briefcase size={16} className="text-mango-blue" />
            {t("sector")}
          </Label>
          <select 
            {...register("sector")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            <option value="Manufaktur">Manufaktur</option>
            <option value="Makanan & Minuman">Makanan & Minuman</option>
            <option value="Tekstil">Tekstil</option>
            <option value="Kerajinan">Kerajinan</option>
            <option value="Elektronika">Elektronika</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {errors.sector && <p className="text-sm text-destructive">{t(`errors.${errors.sector.message}`)}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText size={16} className="text-mango-blue" />
            {t("nib")}
          </Label>
          <Input {...register("nib")} placeholder={t("nib_placeholder")} disabled={isSubmitting} />
          {errors.nib && <p className="text-sm text-destructive">{t(`errors.${errors.nib.message}`)}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar size={16} className="text-mango-blue" />
            {t("established_year")}
          </Label>
          <Input type="number" {...register("established_year")} disabled={isSubmitting} />
          {errors.established_year && <p className="text-sm text-destructive">{t(`errors.${errors.established_year.message}`)}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <UsersIcon size={16} className="text-mango-blue" />
            {t("employee_count")}
          </Label>
          <Input type="number" {...register("employee_count")} disabled={isSubmitting} />
          {errors.employee_count && <p className="text-sm text-destructive">{t(`errors.${errors.employee_count.message}`)}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-mango-blue">
        {isSubmitting ? <Loader2 className="animate-spin" /> : t("save_continue")}
      </Button>
    </form>
  );
};
