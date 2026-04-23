import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "name_required"),
  owner_name: z.string().min(1, "owner_name_required"),
  sector: z.string().min(1, "sector_required"),
  nib: z.string().min(1, "nib_required"),
  established_year: z.number().min(1900).max(new Date().getFullYear()),
  employee_count: z.number().min(0),
});

export const businessProfileSchema = z.object({
  vision: z.string().optional(),
  mission: z.string().optional(),
  main_product: z.string().min(1, "main_product_required"),
  annual_revenue: z.string().min(1, "annual_revenue_required"),
  market_target: z.string().min(1, "market_target_required"),
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;
export type OnboardingData = CompanyFormData & BusinessProfileFormData;
