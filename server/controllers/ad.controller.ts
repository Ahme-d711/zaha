import { Request, Response } from "express";
import {  QueryFilter } from "mongoose";
import { AdModel } from "../models/ad.model.js";
import { IAd } from "../types/ad.type.js";
import { createAdSchema, updateAdSchema, getAdsQuerySchema } from "../schemas/ad.schema.js";
import AppError from "../errors/AppError.js";
import fs from "fs";
import path from "path";

/**
 * Get all ads
 */
export const getAllAds = async (req: Request, res: Response) => {
  const validatedQuery = getAdsQuerySchema.parse(req.query);
  const { search, isShown, page, limit } = validatedQuery;

  const query: QueryFilter<IAd> = {};

  if (search) {
    query.$or = [
      { nameAr: { $regex: search, $options: "i" } },
      { nameEn: { $regex: search, $options: "i" } },
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: search,
            options: "i"
          }
        }
      }
    ];
  }

  if (isShown !== undefined) query.isShown = isShown;

  const skip = (page - 1) * limit;

  const [ads, total] = await Promise.all([
    AdModel.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("productId", "nameAr nameEn"),
    AdModel.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: "Ads fetched successfully",
    data: {
      ads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
  });
};

/**
 * Get ad by ID
 */
export const getAdById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ad = await AdModel.findById(id).populate("productId");

  if (!ad) {
    throw new AppError("Ad not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Ad fetched successfully",
    data: { ad },
  });
};

/**
 * Create new ad
 */
export const createAd = async (req: Request, res: Response) => {
  const validatedBody = createAdSchema.parse(req.body);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  
  if (!files || !files.photo || files.photo.length === 0) {
    throw new AppError("Ad photo is required", 400);
  }

  const photo = `/uploads/ads/${files.photo[0].filename}`;
  const mobilePhoto = files.mobilePhoto?.[0] 
    ? `/uploads/ads/${files.mobilePhoto[0].filename}` 
    : undefined;

  const ad = await AdModel.create({
    ...validatedBody,
    photo,
    mobilePhoto,
  } as unknown as IAd);

  res.status(201).json({
    success: true,
    message: "Ad created successfully",
    data: { ad },
  });
};

/**
 * Update ad
 */
export const updateAd = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedBody = updateAdSchema.parse(req.body);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  
  const ad = await AdModel.findById(id);
  if (!ad) {
    throw new AppError("Ad not found", 404);
  }

  const updateData: Partial<IAd> = { ...validatedBody } as unknown as Partial<IAd>;

  if (files) {
    if (files.photo?.[0]) {
      // Delete old photo if exists
      if (ad.photo) {
        const oldPhotoPath = path.join(process.cwd(), ad.photo);
        if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
      }
      updateData.photo = `/uploads/ads/${files.photo[0].filename}`;
    }

    if (files.mobilePhoto?.[0]) {
      // Delete old mobile photo if exists
      if (ad.mobilePhoto) {
        const oldMobilePhotoPath = path.join(process.cwd(), ad.mobilePhoto);
        if (fs.existsSync(oldMobilePhotoPath)) fs.unlinkSync(oldMobilePhotoPath);
      }
      updateData.mobilePhoto = `/uploads/ads/${files.mobilePhoto[0].filename}`;
    }
  }

  const updatedAd = await AdModel.findByIdAndUpdate(id, updateData, { new: true })
    .populate("productId");

  res.status(200).json({
    success: true,
    message: "Ad updated successfully",
    data: { ad: updatedAd },
  });
};

/**
 * Delete ad
 */
export const deleteAd = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ad = await AdModel.findById(id);

  if (!ad) {
    throw new AppError("Ad not found", 404);
  }

  // Delete photo file
  if (ad.photo) {
    const photoPath = path.join(process.cwd(), ad.photo);
    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
  }

  await AdModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Ad deleted successfully",
    data: null,
  });
};

/**
 * Toggle ad status (shown/hidden)
 */
export const toggleAdStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ad = await AdModel.findById(id);

  if (!ad) {
    throw new AppError("Ad not found", 404);
  }

  ad.isShown = !ad.isShown;
  await ad.save();

  res.status(200).json({
    success: true,
    message: `Ad ${ad.isShown ? "shown" : "hidden"} successfully`,
    data: { ad },
  });
};
