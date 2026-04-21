import { Schema, model, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         shippingCost:
 *           type: number
 *         taxRate:
 *           type: number
 *         freeShippingThreshold:
 *           type: number
 *         currency:
 *           type: string
 *         contactEmail:
 *           type: string
 *         contactPhone:
 *           type: string
 *         socialLinks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *               link:
 *                 type: string
 */

export interface ISettings extends Document {
  shippingCost: number;
  taxRate: number; // Percentage
  freeShippingThreshold: number;
  currency: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks: {
    platform: string;
    link: string;
  }[];
}

const SettingsSchema = new Schema<ISettings>(
  {
    shippingCost: {
      type: Number,
      required: true,
      default: 50, // Default shipping cost
    },
    taxRate: {
      type: Number,
      required: true,
      default: 14, // Default tax rate (14%)
    },
    freeShippingThreshold: {
      type: Number,
      required: true,
      default: 1000, // Free shipping over 1000
    },
    currency: {
       type: String,
       required: true,
       default: "EGP",
     },
     contactEmail: {
       type: String,
       default: "",
     },
     contactPhone: {
       type: String,
       default: "",
     },
     socialLinks: [
      {
        platform: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// We only need one settings document, so we can ensure it exists or create it
export const SettingsModel = model<ISettings>("settings", SettingsSchema);
