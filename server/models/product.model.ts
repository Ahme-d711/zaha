import { Schema, model } from "mongoose";
import { IProduct } from "../types/product.type.js";
import { slugify } from "../utils/string.utils.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - nameAr
 *         - nameEn
 *         - price
 *         - stock
 *         - categoryId
 *         - mainImage
 *       properties:
 *         id:
 *           type: string
 *         nameAr:
 *           type: string
 *         nameEn:
 *           type: string
 *         descriptionAr:
 *           type: string
 *         descriptionEn:
 *           type: string
 *         price:
 *           type: number
 *         oldPrice:
 *           type: number
 *         costPrice:
 *           type: number
 *         stock:
 *           type: number
 *         sku:
 *           type: string
 *         slug:
 *           type: string
 *         mainImage:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         categoryId:
 *           type: string
 *         subCategoryId:
 *           type: string
 *         brandId:
 *           type: string
 *         sectionIds:
 *           type: array
 *           items:
 *             type: string
 *         averageRating:
 *           type: number
 *         numReviews:
 *           type: number
 */

const ProductSchema = new Schema<IProduct>(
  {
    nameAr: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    nameEn: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    descriptionAr: {
      type: String,
      required: false,
      trim: true,
    },
    descriptionEn: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: false,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mainImage: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [
        {
          size: { type: String, required: true },
          stock: { type: Number, required: true, min: 0, default: 0 },
          price: { type: Number, required: true, min: 0 },
          oldPrice: { type: Number, required: false, min: 0 },
          costPrice: { type: Number, required: false, min: 0 },
        },
      ],
      default: [],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "subcategories",
      required: false,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: false,
    },
    sectionIds: {
      type: [Schema.Types.ObjectId],
      ref: "sections",
      default: [],
    },
    priority: {
      type: Number,
      required: true,
      default: 0,
    },
    isShow: {
      type: Boolean,
      required: true,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    soldCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.pre("validate", async function () {
  if (this.isModified("nameEn")) {
    const baseSlug = slugify(this.nameEn);
    let slug = baseSlug;
    let count = 0;
    
    // Check if slug already exists (excluding the current document)
    while (await model("products").findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    
    this.slug = slug;
  }

  if (!this.sku) {
    const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"; // Removed O and 0 to avoid confusion
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.sku = `SG-${result}`;
    
    // Check if SKU exists and regenerate if it does
    while (await model("products").findOne({ sku: this.sku, _id: { $ne: this._id } })) {
      let retry = "";
      for (let i = 0; i < 6; i++) {
        retry += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      this.sku = `SG-${retry}`;
    }
  }
});

ProductSchema.index({ nameAr: "text", nameEn: "text" });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ subCategoryId: 1 });
ProductSchema.index({ brandId: 1 });
ProductSchema.index({ sectionIds: 1 });
ProductSchema.index({ isShow: 1 });
ProductSchema.index({ isDeleted: 1 });
ProductSchema.index({ priority: -1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ createdAt: -1 });

export const ProductModel = model<IProduct>("products", ProductSchema);
