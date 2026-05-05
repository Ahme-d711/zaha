import { Request, Response } from "express";
import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";
import mongoose from "mongoose";

/**
 * Get vendor dashboard statistics
 */
export const getVendorStats = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?._id;

  if (!vendorId) {
    return sendResponse(res, 401, { success: false, message: "Unauthorized" });
  }

  // 1. Total products for this vendor
  const totalProducts = await ProductModel.countDocuments({ addedBy: vendorId, isDeleted: false });

  // 2. Orders containing this vendor's products
  // We find products first to get their IDs
  const vendorProducts = await ProductModel.find({ addedBy: vendorId }).select("_id");
  const productIds = vendorProducts.map(p => p._id);

  const orders = await OrderModel.find({
    "items.productId": { $in: productIds }
  });

  const totalOrders = orders.length;

  // 3. Calculate total revenue for this vendor specifically
  let totalRevenue = 0;
  orders.forEach(order => {
    order.items.forEach(item => {
      if (productIds.some(id => id.equals(item.productId as mongoose.Types.ObjectId))) {
        totalRevenue += item.price * item.quantity;
      }
    });
  });

  // 4. Recent orders for this vendor
  const recentOrders = await OrderModel.find({
    "items.productId": { $in: productIds }
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name email");

  sendResponse(res, 200, {
    success: true,
    message: "Vendor statistics retrieved successfully",
    data: {
      summary: {
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      recentOrders,
    },
  });
});

/**
 * Get vendor products
 */
export const getVendorProducts = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?._id;
  const products = await ProductModel.find({ addedBy: vendorId, isDeleted: false })
    .sort({ createdAt: -1 });

  sendResponse(res, 200, {
    success: true,
    message: "Vendor products retrieved successfully",
    data: { products },
  });
});

/**
 * Get vendor orders
 */
export const getVendorOrders = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?._id;
  
  const vendorProducts = await ProductModel.find({ addedBy: vendorId }).select("_id");
  const productIds = vendorProducts.map(p => p._id);

  const orders = await OrderModel.find({
    "items.productId": { $in: productIds }
  })
    .sort({ createdAt: -1 })
    .populate("userId", "name email phone");

  // Filter items in each order to only show vendor's products? 
  // Usually, a vendor should see the whole order but highlight their items, 
  // or just see their items. Let's return the whole order for context.

  sendResponse(res, 200, {
    success: true,
    message: "Vendor orders retrieved successfully",
    data: { orders },
  });
});
