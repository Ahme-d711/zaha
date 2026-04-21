import { Schema, model } from "mongoose";
import { IAd } from "../types/ad.type.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Ad:
 *       type: object
 *       required:
 *         - nameAr
 *         - nameEn
 *         - photo
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
 *         photo:
 *           type: string
 *         mobilePhoto:
 *           type: string
 *         isShown:
 *           type: boolean
 *         priority:
 *           type: number
 *         link:
 *           type: string
 *         productId:
 *           type: string
 */

const AdSchema = new Schema<IAd>(
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
    photo: {
      type: String,
      required: true,
      trim: true,
    },
    mobilePhoto: {
      type: String,
      required: false,
      trim: true,
    },
    isShown: {
      type: Boolean,
      required: true,
      default: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 0,
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AdSchema.index({ nameAr: 1 });
AdSchema.index({ nameEn: 1 });
AdSchema.index({ isShown: 1 });
AdSchema.index({ priority: -1 });

export const AdModel = model<IAd>("ads", AdSchema);
