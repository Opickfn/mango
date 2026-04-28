import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "name_required"),
  legal_entity_type: z.string().min(1, "legal_entity_type_required"),
  owner_name: z.string().min(1, "owner_name_required"),
  nik: z.string().length(16, "nik_invalid"),
  npwp: z.string().optional(),
  phone: z.string().min(10, "phone_invalid"),
  address: z.string().min(5, "address_required"),
  province: z.string().min(1, "province_required"),
  regency: z.string().min(1, "regency_required"),
  district: z.string().min(1, "district_required"),
  village: z.string().min(1, "village_required"),
  sector: z.string().min(1, "sector_required"),
  kbli: z.string().length(5, "kbli_invalid"),
  nib: z.string().length(13, "nib_invalid"),
  certifications: z.array(z.string()).optional(),
  umkm_organization_id: z.number().optional().nullable(),
  logo: z.any().optional(),
  nib_file: z.any().refine((file) => file instanceof File, "nib_file_required"),
  ktp_file: z.any().refine((file) => file instanceof File, "ktp_file_required"),
});

export const businessProfileSchema = z.object({
  main_product: z.string().min(1, "main_product_required"),
  market_target: z.string().min(1, "market_target_required"),
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;
export type OnboardingData = CompanyFormData & BusinessProfileFormData;
