import { type Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  description?: string;
  priority: number;
  slug: string;
  logo?: string;
  isShow: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
