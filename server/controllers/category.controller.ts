import type { Request, Response } from "express";
import { CategoryModel } from "../models/category.model.js";
import mongoose from "mongoose";
import { sendResponse } from "../utils/sendResponse.js";
import AppError from "../errors/AppError.js";
import { deleteFile } from "../utils/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesQuerySchema,
} from "../schemas/category.schema.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import { validateUserData } from "../schemas/user.schema.js"; // Reuse validation helper

/**
 * Get all categories with filtering, searching, and pagination
 */
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const validatedQuery = validateUserData(getCategoriesQuerySchema, req.query);
  
  // No default isDeleted filter here. ApiFeatures.filter() will handle it if provided.
  const query = CategoryModel.find()
    .populate("subcategoriesCount")
    .populate("productsCount")
    .sort({ priority: -1, createdAt: -1 });

  const apiFeatures = new ApiFeatures(query, validatedQuery as Record<string, unknown>)
    .filter()
    .search(["nameAr", "nameEn", "slug"])
    .paginate();

  const { results: categories, pagination } = await apiFeatures.execute();

  sendResponse(res, 200, {
    success: true,
    message: "Categories retrieved successfully",
    data: {
      categories,
      pagination,
    },
  });
});

/**
 * Get single category by ID
 */
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Category ID format", 400);
  }
  
  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  sendResponse(res, 200, {
    success: true,
    message: "Category retrieved successfully",
    data: { category },
  });
});

/**
 * Get single category by Slug
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const category = await CategoryModel.findOne({ slug, isDeleted: false });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  sendResponse(res, 200, {
    success: true,
    message: "Category retrieved successfully",
    data: { category },
  });
});

/**
 * Create new category
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = validateUserData(createCategorySchema, req.body);
  const file = req.file;

  const imagePath = file ? `/uploads/categories/${file.filename}` : undefined;

  try {
    const category = await CategoryModel.create({
      ...validatedData,
      image: imagePath,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  } catch (error) {
    if (file) {
      await deleteFile(`/uploads/categories/${file.filename}`).catch(console.error);
    }
    throw error;
  }
});

/**
 * Update category
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = validateUserData(updateCategorySchema, req.body);
  const file = req.file;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    if (file) await deleteFile(`/uploads/categories/${file.filename}`).catch(console.error);
    throw new AppError("Invalid Category ID format", 400);
  }

  const category = await CategoryModel.findById(id);
  if (!category) {
    if (file) await deleteFile(`/uploads/categories/${file.filename}`).catch(console.error);
    throw new AppError("Category not found", 404);
  }

  let imagePath = category.image;
  if (file) {
    if (category.image) {
      await deleteFile(category.image).catch(console.error);
    }
    imagePath = `/uploads/categories/${file.filename}`;
  }

  Object.assign(category, {
    ...validatedData,
    image: imagePath,
  });

  await category.save();

  sendResponse(res, 200, {
    success: true,
    message: "Category updated successfully",
    data: { category },
  });
});

/**
 * Delete category (Soft Delete)
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Category ID format", 400);
  }

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  category.isDeleted = true;
  await category.save();

  // Cascade delete subcategories
  await mongoose.model("subcategories").updateMany(
    { categoryId: category._id },
    { isDeleted: true }
  );

  sendResponse(res, 200, {
    success: true,
    message: "Category and its subcategories deleted successfully",
  });
});

/**
 * Restore deleted category
 */
export const restoreCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Category ID format", 400);
  }

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  category.isDeleted = false;
  await category.save();

  // Cascade restore subcategories
  await mongoose.model("subcategories").updateMany(
    { categoryId: category._id },
    { isDeleted: false }
  );

  sendResponse(res, 200, {
    success: true,
    message: "Category and its subcategories restored successfully",
    data: { category },
  });
});

/**
 * Toggle category visibility status
 */
export const toggleCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Category ID format", 400);
  }

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  category.isShow = !category.isShow;
  await category.save();

  sendResponse(res, 200, {
    success: true,
    message: `Category ${category.isShow ? "shown" : "hidden"} successfully`,
    data: { category },
  });
});
