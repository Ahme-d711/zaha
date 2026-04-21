import type { Request, Response } from "express";
import { BrandModel } from "../models/brand.model.js";
import mongoose from "mongoose";
import { sendResponse } from "../utils/sendResponse.js";
import AppError from "../errors/AppError.js";
import { deleteFile } from "../utils/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createBrandSchema,
  updateBrandSchema,
  getBrandsQuerySchema,
} from "../schemas/brand.schema.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import { validateUserData } from "../schemas/user.schema.js";

/**
 * Get all brands with filtering, searching, and pagination
 */
export const getAllBrands = asyncHandler(async (req: Request, res: Response) => {
  const validatedQuery = validateUserData(getBrandsQuerySchema, req.query);
  
  const query = BrandModel.find()
    .sort({ priority: -1, createdAt: -1 });

  const apiFeatures = new ApiFeatures(query, validatedQuery as Record<string, unknown>)
    .filter()
    .search(["nameAr", "nameEn", "slug"])
    .paginate();

  const { results: brands, pagination } = await apiFeatures.execute();

  sendResponse(res, 200, {
    success: true,
    message: "Brands retrieved successfully",
    data: {
      brands,
      pagination,
    },
  });
});

/**
 * Get single brand by ID
 */
export const getBrandById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Brand ID format", 400);
  }
  
  const brand = await BrandModel.findById(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  sendResponse(res, 200, {
    success: true,
    message: "Brand retrieved successfully",
    data: { brand },
  });
});

/**
 * Get single brand by Slug
 */
export const getBrandBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const brand = await BrandModel.findOne({ slug, isDeleted: false });

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  sendResponse(res, 200, {
    success: true,
    message: "Brand retrieved successfully",
    data: { brand },
  });
});

/**
 * Create new brand
 */
export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = validateUserData(createBrandSchema, req.body);
  const file = req.file;

  const logoPath = file ? `/uploads/brands/${file.filename}` : undefined;

  try {
    const brand = await BrandModel.create({
      ...validatedData,
      logo: logoPath,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Brand created successfully",
      data: { brand },
    });
  } catch (error) {
    if (file) {
      await deleteFile(`/uploads/brands/${file.filename}`).catch(console.error);
    }
    throw error;
  }
});

/**
 * Update brand
 */
export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = validateUserData(updateBrandSchema, req.body);
  const file = req.file;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    if (file) await deleteFile(`/uploads/brands/${file.filename}`).catch(console.error);
    throw new AppError("Invalid Brand ID format", 400);
  }

  const brand = await BrandModel.findById(id);
  if (!brand) {
    if (file) await deleteFile(`/uploads/brands/${file.filename}`).catch(console.error);
    throw new AppError("Brand not found", 404);
  }

  let logoPath = brand.logo;
  if (file) {
    if (brand.logo) {
      await deleteFile(brand.logo).catch(console.error);
    }
    logoPath = `/uploads/brands/${file.filename}`;
  }

  Object.assign(brand, {
    ...validatedData,
    logo: logoPath,
  });

  await brand.save();

  sendResponse(res, 200, {
    success: true,
    message: "Brand updated successfully",
    data: { brand },
  });
});

/**
 * Delete brand (Soft Delete)
 */
export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Brand ID format", 400);
  }

  const brand = await BrandModel.findById(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  brand.isDeleted = true;
  await brand.save();

  sendResponse(res, 200, {
    success: true,
    message: "Brand deleted successfully",
  });
});

/**
 * Restore deleted brand
 */
export const restoreBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Brand ID format", 400);
  }

  const brand = await BrandModel.findById(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  brand.isDeleted = false;
  await brand.save();

  sendResponse(res, 200, {
    success: true,
    message: "Brand restored successfully",
    data: { brand },
  });
});

/**
 * Toggle brand visibility status
 */
export const toggleBrandStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Brand ID format", 400);
  }

  const brand = await BrandModel.findById(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  brand.isShow = !brand.isShow;
  await brand.save();

  sendResponse(res, 200, {
    success: true,
    message: `Brand ${brand.isShow ? "shown" : "hidden"} successfully`,
    data: { brand },
  });
});
