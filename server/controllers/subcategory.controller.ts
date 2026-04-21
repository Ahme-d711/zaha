import type { Request, Response } from "express";
import { SubcategoryModel } from "../models/subcategory.model.js";
import { CategoryModel } from "../models/category.model.js";
import mongoose from "mongoose";
import { sendResponse } from "../utils/sendResponse.js";
import AppError from "../errors/AppError.js";
import { deleteFile } from "../utils/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createSubcategorySchema,
  updateSubcategorySchema,
  getSubcategoriesQuerySchema,
} from "../schemas/subcategory.schema.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import { validateUserData } from "../schemas/user.schema.js";

interface ICategoryPopulated {
  _id: mongoose.Types.ObjectId | string;
  nameAr: string;
  nameEn: string;
}

/**
 * Get all subcategories with filtering, searching, and pagination
 */
export const getAllSubcategories = asyncHandler(async (req: Request, res: Response) => {
  const validatedQuery = validateUserData(getSubcategoriesQuerySchema, req.query);
  
  // No default isDeleted filter here. ApiFeatures.filter() will handle it if provided.
  const query = SubcategoryModel.find()
    .populate("categoryId", "nameAr nameEn")
    .sort({ priority: -1, createdAt: -1 });

  const apiFeatures = new ApiFeatures(query, validatedQuery as Record<string, unknown>)
    .filter()
    .search(["nameAr", "nameEn", "slug"])
    .paginate();

  const { results: rawSubcategories, pagination } = await apiFeatures.execute();

  // Map to the format the client expects
  const subcategories = rawSubcategories.map((sub) => {
    const category = sub.categoryId as unknown as ICategoryPopulated | undefined;
    return {
      ...sub.toObject(),
      categoryNameAr: category?.nameAr,
      categoryNameEn: category?.nameEn,
      categoryId: category?._id || sub.categoryId,
    };
  });

  sendResponse(res, 200, {
    success: true,
    message: "Subcategories retrieved successfully",
    data: {
      subcategories,
      pagination,
    },
  });
});

/**
 * Get single subcategory by ID
 */
export const getSubcategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Subcategory ID format", 400);
  }
  
  const subcategory = await SubcategoryModel.findById(id).populate("categoryId", "nameAr nameEn");

  if (!subcategory) {
    throw new AppError("Subcategory not found", 404);
  }

  const category = subcategory.categoryId as unknown as ICategoryPopulated | undefined;
  const subcategoryData = {
    ...subcategory.toObject(),
    categoryNameAr: category?.nameAr,
    categoryNameEn: category?.nameEn,
    categoryId: category?._id || subcategory.categoryId,
  };

  sendResponse(res, 200, {
    success: true,
    message: "Subcategory retrieved successfully",
    data: { subcategory: subcategoryData },
  });
});

/**
 * Get single subcategory by Slug
 */
export const getSubcategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const subcategory = await SubcategoryModel.findOne({ slug, isDeleted: false }).populate("categoryId", "nameAr nameEn");

  if (!subcategory) {
    throw new AppError("Subcategory not found", 404);
  }

  const category = subcategory.categoryId as unknown as ICategoryPopulated | undefined;
  const subcategoryData = {
    ...subcategory.toObject(),
    categoryNameAr: category?.nameAr,
    categoryNameEn: category?.nameEn,
    categoryId: category?._id || subcategory.categoryId,
  };

  sendResponse(res, 200, {
    success: true,
    message: "Subcategory retrieved successfully",
    data: { subcategory: subcategoryData },
  });
});

/**
 * Create new subcategory
 */
export const createSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = validateUserData(createSubcategorySchema, req.body);
  const file = req.file;

  // Check if parent category exists
  const parentCategory = await CategoryModel.findById(validatedData.categoryId);
  if (!parentCategory) {
    if (file) await deleteFile(`/uploads/subcategories/${file.filename}`).catch(console.error);
    throw new AppError("Parent category not found", 404);
  }

  const { categoryId, ...otherData } = validatedData;
  const imagePath = file ? `/uploads/subcategories/${file.filename}` : undefined;

  try {
    const subcategory = await SubcategoryModel.create({
      ...otherData,
      categoryId: categoryId as unknown as mongoose.Types.ObjectId,
      image: imagePath,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Subcategory created successfully",
      data: { subcategory },
    });
  } catch (error) {
    if (file) {
      await deleteFile(`/uploads/subcategories/${file.filename}`).catch(console.error);
    }
    throw error;
  }
});

/**
 * Update subcategory
 */
export const updateSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = validateUserData(updateSubcategorySchema, req.body);
  const file = req.file;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    if (file) await deleteFile(`/uploads/subcategories/${file.filename}`).catch(console.error);
    throw new AppError("Invalid Subcategory ID format", 400);
  }

  const subcategory = await SubcategoryModel.findById(id);
  if (!subcategory) {
    if (file) await deleteFile(`/uploads/subcategories/${file.filename}`).catch(console.error);
    throw new AppError("Subcategory not found", 404);
  }

  // If categoryId is being updated, check if it exists
  if (validatedData.categoryId && validatedData.categoryId !== subcategory.categoryId.toString()) {
    const parentCategory = await CategoryModel.findById(validatedData.categoryId);
    if (!parentCategory) {
      if (file) await deleteFile(`/uploads/subcategories/${file.filename}`).catch(console.error);
      throw new AppError("Parent category not found", 404);
    }
  }

  let imagePath = subcategory.image;
  if (file) {
    if (subcategory.image) {
      await deleteFile(subcategory.image).catch(console.error);
    }
    imagePath = `/uploads/subcategories/${file.filename}`;
  }

  const { categoryId, ...otherData } = validatedData;

  Object.assign(subcategory, {
    ...otherData,
    ...(categoryId && { categoryId: categoryId as unknown as mongoose.Types.ObjectId }),
    image: imagePath,
  });

  await subcategory.save();

  sendResponse(res, 200, {
    success: true,
    message: "Subcategory updated successfully",
    data: { subcategory },
  });
});

/**
 * Delete subcategory (Soft Delete)
 */
export const deleteSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Subcategory ID format", 400);
  }

  const subcategory = await SubcategoryModel.findById(id);

  if (!subcategory) {
    throw new AppError("Subcategory not found", 404);
  }

  subcategory.isDeleted = true;
  await subcategory.save();

  sendResponse(res, 200, {
    success: true,
    message: "Subcategory deleted successfully",
  });
});

/**
 * Toggle subcategory visibility status
 */
export const toggleSubcategoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Subcategory ID format", 400);
  }

  const subcategory = await SubcategoryModel.findById(id);

  if (!subcategory) {
    throw new AppError("Subcategory not found", 404);
  }

  subcategory.isShow = !subcategory.isShow;
  await subcategory.save();

  sendResponse(res, 200, {
    success: true,
    message: `Subcategory ${subcategory.isShow ? "shown" : "hidden"} successfully`,
    data: { subcategory },
  });
});

/**
 * Restore deleted subcategory
 */
export const restoreSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Subcategory ID format", 400);
  }

  const subcategory = await SubcategoryModel.findById(id);

  if (!subcategory) {
    throw new AppError("Subcategory not found", 404);
  }

  subcategory.isDeleted = false;
  await subcategory.save();

  sendResponse(res, 200, {
    success: true,
    message: "Subcategory restored successfully",
    data: { subcategory },
  });
});
