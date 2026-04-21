import { Request, Response } from "express";
import {  QueryFilter } from "mongoose";
import { ProductModel } from "../models/product.model.js";
import { IProduct } from "../types/product.type.js";
import { createProductSchema, updateProductSchema, queryProductSchema } from "../schemas/product.schema.js";
import AppError from "../errors/AppError.js";
import fs from "fs";
import path from "path";
import ApiFeatures from "../utils/ApiFeatures.js";

/**
 * Get all products
 */
export const getAllProducts = async (req: Request, res: Response) => {
  const validatedQuery = queryProductSchema.parse(req.query);

  // If categorySlug is provided, find the category and use its _id
  if (validatedQuery.categorySlug) {
    const { CategoryModel } = await import("../models/category.model.js");
    const category = await CategoryModel.findOne({ slug: validatedQuery.categorySlug });
    if (category) {
      validatedQuery.categoryId = category._id.toString();
    }
  }

  const query = ProductModel.find()
    .populate("categoryId", "nameAr nameEn")
    .populate("subCategoryId", "nameAr nameEn")
    .populate("brandId", "nameAr nameEn")
    .populate("sectionIds", "nameAr nameEn");

  // Handle sectionIds filter with support for legacy sectionId field
  if (validatedQuery.sectionIds && validatedQuery.sectionIds.length > 0) {
    const sectionIds = Array.isArray(validatedQuery.sectionIds) 
      ? validatedQuery.sectionIds 
      : [validatedQuery.sectionIds];
    
    query.find({
      $or: [
        { sectionIds: { $in: sectionIds } },
        { sectionId: { $in: sectionIds } }
      ]
    });
    
    // Remove from validatedQuery so ApiFeatures doesn't try to filter by it again
    delete validatedQuery.sectionIds;
  }

  const apiFeatures = new ApiFeatures(query, validatedQuery)
    .filter()
    .search(["nameAr", "nameEn", "sku"])
    .sort()
    .paginate();

  const { results: products, pagination } = await apiFeatures.execute();

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: {
      products,
      pagination,
    },
  });
};

/**
 * Get product by ID
 */
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id)
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("brandId")
    .populate("sectionIds");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: { product },
  });
};

/**
 * Get product by slug
 */
export const getProductBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await ProductModel.findOne({ slug, isDeleted: false })
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("brandId")
    .populate("sectionIds");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: { product },
  });
};

/**
 * Create new product
 */
export const createProduct = async (req: Request, res: Response) => {
  const validatedBody = createProductSchema.parse(req.body);
  
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  if (!files || !files.mainImage || files.mainImage.length === 0) {
    throw new AppError("Main image is required", 400);
  }

  const mainImage = `/uploads/products/${files.mainImage[0].filename}`;
  const images = files.images?.map(file => `/uploads/products/${file.filename}`) || [];

  if (images.length > 4) {
    throw new AppError("Maximum 4 additional images allowed", 400);
  }

  // Calculate total stock from sizes if provided and not empty
  let totalStock = validatedBody.stock || 0;
  if (validatedBody.sizes && validatedBody.sizes.length > 0) {
    totalStock = validatedBody.sizes.reduce((sum, size) => sum + size.stock, 0);
  }

  const product = await ProductModel.create({
    ...validatedBody,
    mainImage,
    images,
    stock: totalStock,
  } as unknown as IProduct);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: { product },
  });
};

/**
 * Update product
 */
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedBody = updateProductSchema.parse(req.body);
  
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const updateData: Partial<IProduct> = { ...validatedBody } as unknown as Partial<IProduct>;

  if (files) {
    if (files.mainImage && files.mainImage.length > 0) {
      // Delete old main image
      if (product.mainImage) {
        const oldImagePath = path.join(process.cwd(), product.mainImage);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updateData.mainImage = `/uploads/products/${files.mainImage[0].filename}`;
    }

    }

  // Handle images deletion and new uploads
  if (req.body.existingImages !== undefined || (files && files.images)) {
    let imagesToKeep: string[] = [];
    
    // 1. Determine base images (existing ones to keep)
    if (req.body.existingImages !== undefined) {
      // Use what frontend sent
      imagesToKeep = Array.isArray(req.body.existingImages) 
        ? req.body.existingImages 
        : [req.body.existingImages];
    } else {
      // If NOT sent, keep current images as base
      imagesToKeep = [...(product.images || [])];
    }

    // 2. Append new uploads if any
    if (files && files.images && files.images.length > 0) {
      const newImages = files.images.map(file => `/uploads/products/${file.filename}`);
      imagesToKeep = [...imagesToKeep, ...newImages];
    }

    if (imagesToKeep.length > 4) {
      throw new AppError("Maximum 4 additional images allowed", 400);
    }

    updateData.images = imagesToKeep;
  }

  // Calculate total stock from sizes if sizes are provided and not empty
  if (validatedBody.sizes && validatedBody.sizes.length > 0) {
    updateData.stock = validatedBody.sizes.reduce((sum, size) => sum + size.stock, 0);
  } else if (validatedBody.stock !== undefined) {
    updateData.stock = validatedBody.stock;
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: { product: updatedProduct },
  });
};

/**
 * Delete product (soft delete)
 */
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
};

/**
 * Toggle product status
 */
export const toggleProductStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  product.isShow = !product.isShow;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product status toggled successfully",
    data: { product },
  });
};

/**
 * Restore deleted product
 */
export const restoreProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product restored successfully",
    data: { product },
  });
};
