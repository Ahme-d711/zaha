import { Schema, model } from "mongoose";
import { ISection } from "../types/section.type.js";
import { slugify } from "../utils/string.utils.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       required:
 *         - nameAr
 *         - nameEn
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
 *         image:
 *           type: string
 *         priority:
 *           type: number
 *         isShow:
 *           type: boolean
 */

const SectionSchema = new Schema<ISection>(
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

SectionSchema.pre("validate", async function () {
  if (this.isModified("nameEn")) {
    const baseSlug = slugify(this.nameEn);
    let slug = baseSlug;
    let count = 0;
    
    // Check if slug already exists (excluding the current document)
    while (await model("sections").findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    
    this.slug = slug;
  }
});

SectionSchema.index({ nameAr: 1 });
SectionSchema.index({ nameEn: 1 });
SectionSchema.index({ isShow: 1 });
SectionSchema.index({ isDeleted: 1 });
SectionSchema.index({ priority: -1 });

export const SectionModel = model<ISection>("sections", SectionSchema);
