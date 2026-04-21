import type { Request, Response } from "express";
import { SectionModel } from "../models/section.model.js";
import mongoose from "mongoose";
import { sendResponse } from "../utils/sendResponse.js";
import AppError from "../errors/AppError.js";
import { deleteFile } from "../utils/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createSectionSchema,
  updateSectionSchema,
  getSectionsQuerySchema,
} from "../schemas/section.schema.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import { validateUserData } from "../schemas/user.schema.js";

/**
 * Get all sections with filtering, searching, and pagination
 */
export const getAllSections = asyncHandler(async (req: Request, res: Response) => {
  const validatedQuery = validateUserData(getSectionsQuerySchema, req.query);
  
  const query = SectionModel.find()
    .sort({ priority: -1, createdAt: -1 });

  const apiFeatures = new ApiFeatures(query, validatedQuery as Record<string, unknown>)
    .filter()
    .search(["nameAr", "nameEn", "slug"])
    .paginate();

  const { results: sections, pagination } = await apiFeatures.execute();

  sendResponse(res, 200, {
    success: true,
    message: "Sections retrieved successfully",
    data: {
      sections,
      pagination,
    },
  });
});

/**
 * Get single section by ID
 */
export const getSectionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Section ID format", 400);
  }
  
  const section = await SectionModel.findById(id);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  sendResponse(res, 200, {
    success: true,
    message: "Section retrieved successfully",
    data: { section },
  });
});

/**
 * Get single section by Slug
 */
export const getSectionBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const section = await SectionModel.findOne({ slug, isDeleted: false });

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  sendResponse(res, 200, {
    success: true,
    message: "Section retrieved successfully",
    data: { section },
  });
});

/**
 * Create new section
 */
export const createSection = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = validateUserData(createSectionSchema, req.body);
  const file = req.file;

  const imagePath = file ? `/uploads/sections/${file.filename}` : undefined;

  try {
    const section = await SectionModel.create({
      ...validatedData,
      image: imagePath,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Section created successfully",
      data: { section },
    });
  } catch (error) {
    if (file) {
      await deleteFile(`/uploads/sections/${file.filename}`).catch(console.error);
    }
    throw error;
  }
});

/**
 * Update section
 */
export const updateSection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = validateUserData(updateSectionSchema, req.body);
  const file = req.file;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    if (file) await deleteFile(`/uploads/sections/${file.filename}`).catch(console.error);
    throw new AppError("Invalid Section ID format", 400);
  }

  const section = await SectionModel.findById(id);
  if (!section) {
    if (file) await deleteFile(`/uploads/sections/${file.filename}`).catch(console.error);
    throw new AppError("Section not found", 404);
  }

  let imagePath = section.image;
  if (file) {
    if (section.image) {
      await deleteFile(section.image).catch(console.error);
    }
    imagePath = `/uploads/sections/${file.filename}`;
  }

  Object.assign(section, {
    ...validatedData,
    image: imagePath,
  });

  await section.save();

  sendResponse(res, 200, {
    success: true,
    message: "Section updated successfully",
    data: { section },
  });
});

/**
 * Delete section (Soft Delete)
 */
export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Section ID format", 400);
  }

  const section = await SectionModel.findById(id);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  section.isDeleted = true;
  await section.save();

  sendResponse(res, 200, {
    success: true,
    message: "Section deleted successfully",
  });
});

/**
 * Restore deleted section
 */
export const restoreSection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Section ID format", 400);
  }

  const section = await SectionModel.findById(id);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  section.isDeleted = false;
  await section.save();

  sendResponse(res, 200, {
    success: true,
    message: "Section restored successfully",
    data: { section },
  });
});

/**
 * Toggle section visibility status
 */
export const toggleSectionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    throw new AppError("Invalid Section ID format", 400);
  }

  const section = await SectionModel.findById(id);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  section.isShow = !section.isShow;
  await section.save();

  sendResponse(res, 200, {
    success: true,
    message: `Section ${section.isShow ? "shown" : "hidden"} successfully`,
    data: { section },
  });
});
