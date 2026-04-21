import { Schema, model } from "mongoose";
import { ISubcategory } from "../types/subcategory.type.js";
import { slugify } from "../utils/string.utils.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Subcategory:
 *       type: object
 *       required:
 *         - nameAr
 *         - nameEn
 *         - categoryId
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
 *         slug:
 *           type: string
 *         categoryId:
 *           type: string
 *         image:
 *           type: string
 *         priority:
 *           type: number
 *         isShow:
 *           type: boolean
 */

const SubcategorySchema = new Schema<ISubcategory>(
  {
    nameAr: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    nameEn: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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
    priority: {
      type: Number,
      required: true,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

SubcategorySchema.pre("validate", async function () {
  if (this.isModified("nameEn")) {
    const baseSlug = slugify(this.nameEn);
    let slug = baseSlug;
    let count = 0;
    
    // Check if slug already exists (excluding the current document)
    while (await model("subcategories").findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    
    this.slug = slug;
  }
});

SubcategorySchema.index({ nameAr: 1 });
SubcategorySchema.index({ nameEn: 1 });
SubcategorySchema.index({ categoryId: 1 });
SubcategorySchema.index({ isShow: 1 });
SubcategorySchema.index({ isDeleted: 1 });
SubcategorySchema.index({ priority: -1 });

export const SubcategoryModel = model<ISubcategory>("subcategories", SubcategorySchema);
