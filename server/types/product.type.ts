import { type Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  oldPrice?: number;
  costPrice?: number;
  stock: number;
  sku?: string;
  slug: string;
  mainImage: string;
  images: string[];
  sizes?: { 
    size: string; 
    stock: number; 
    price: number; 
    oldPrice?: number; 
    costPrice?: number; 
  }[]; 
  categoryId: Types.ObjectId;
  subCategoryId?: Types.ObjectId;
  brandId?: Types.ObjectId;
  sectionIds: Types.ObjectId[];
  priority: number;
  isShow: boolean;
  isDeleted: boolean;
  soldCount: number;
  averageRating: number;
  numReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}
