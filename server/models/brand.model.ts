import { Schema, model } from "mongoose";
import { IBrand } from "../types/brand.type.js";
import { slugify } from "../utils/string.utils.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         slug:
 *           type: string
 *         logo:
 *           type: string
 *         priority:
 *           type: number
 *         isShow:
 *           type: boolean
 */

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
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
    logo: {
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BrandSchema.pre("validate", async function (this: any) {
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name);
    let slug = baseSlug;
    let count = 0;
    
    // Check if slug already exists (excluding the current document)
    while (await model("brands").findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    
    this.slug = slug;
  }
});

BrandSchema.index({ name: 1 });
BrandSchema.index({ isShow: 1 });
BrandSchema.index({ isDeleted: 1 });
BrandSchema.index({ priority: -1 });

export const BrandModel = model<IBrand>("brands", BrandSchema);
