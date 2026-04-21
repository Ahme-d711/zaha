import { z } from "zod";

export const createProductSchema = z.object({
  nameAr: z.string().min(1, "الاسم بالعربية مطلوب").max(200),
  nameEn: z.string().min(1, "English name is required").max(200),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  oldPrice: z.coerce.number().min(0).optional(),
  costPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  sku: z.string().optional(),
  sizes: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        return [];
      }
    }
    return val;
  }, z.array(z.object({
    size: z.string().min(1),
    stock: z.coerce.number().min(0),
    price: z.coerce.number().min(0),
    oldPrice: z.coerce.number().min(0).optional(),
    costPrice: z.coerce.number().min(0).optional(),
  }))).optional().default([]),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  brandId: z.string().optional(),
  sectionIds: z.preprocess((val) => {
    if (typeof val === "string") return val.split(",").filter(Boolean);
    return val;
  }, z.array(z.string())).optional().default([]),
  priority: z.coerce.number().int().min(0).default(0),
  soldCount: z.coerce.number().int().min(0).default(0),
  isShow: z.preprocess((val) => val === "true" || val === true, z.boolean()).default(true),
});

export const updateProductSchema = createProductSchema.partial().extend({
  existingImages: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string()).max(4, "Maximum 4 additional images allowed")).optional().default([]),
});

export const queryProductSchema = z.preprocess(
  (data: unknown) => {
    // Handle Axios-style array parameters with []
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      if (record['sectionIds[]'] !== undefined) {
        record.sectionIds = record['sectionIds[]'];
        delete record['sectionIds[]'];
      }
    }
    return data;
  },
  z.object({
    search: z.string().optional(),
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    brandId: z.string().optional(),
    sectionIds: z.preprocess((val) => {
      if (typeof val === "string") return val.split(",").filter(Boolean);
      return val;
    }, z.array(z.string())).optional(),
    isDeleted: z.preprocess((val) => val === "true", z.boolean()).optional(),
    isShow: z.preprocess((val) => val === "true", z.boolean()).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    sort: z.string().optional(),
    categorySlug: z.string().optional(),
  })
);
