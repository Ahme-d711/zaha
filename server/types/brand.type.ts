import { type Document } from "mongoose";

export interface IBrand extends Document {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  priority: number;
  slug: string;
  logo?: string;
  isShow: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
