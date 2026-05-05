import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  description: z.string().optional(),
  priority: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().int().optional().default(0)
  ),
  logo: z.string().optional(),
  isShow: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(true)
  ),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

export const getBrandsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  isShow: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : val),
    z.boolean().optional()
  ),
  isDeleted: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : val),
    z.boolean().optional()
  ),
});
