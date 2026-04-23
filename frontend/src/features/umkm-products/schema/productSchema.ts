import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "name_required"),
  sku: z.string().min(1, "sku_required"),
  unit: z.string().min(1, "unit_required"),
  price: z.number().min(0, "price_min_0"),
  is_active: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
