import { Request, Response } from "express";
import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * Get dashboard overview statistics
 */
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  // 1. Basic counts
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenueResult,
    ordersByCategory,
    ordersByGovernorate,
    ordersByStatus,
  ] = await Promise.all([
    UserModel.countDocuments({ isDeleted: false }),
    ProductModel.countDocuments({ isDeleted: false }),
    OrderModel.countDocuments(),
    OrderModel.aggregate([
      { $match: { status: "DELIVERED", paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: { nameAr: "$category.nameAr", nameEn: "$category.nameEn" },
          value: { $sum: 1 },
        },
      },
      { $project: { _id: 0, nameAr: "$_id.nameAr", nameEn: "$_id.nameEn", value: 1 } },
      { $sort: { value: -1 } },
    ]),
    OrderModel.aggregate([
      { $group: { _id: "$governorate", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 6 },
      { $project: { _id: 0, name: "$_id", value: 1 } },
    ]),
    OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  // Format orders by status into a cleaner object
  const statusCounts: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    RETURNED: 0,
  };
  
  ordersByStatus.forEach((item: { _id: string; count: number }) => {
    if (item._id in statusCounts) {
      statusCounts[item._id] = item.count;
    }
  });

  // 2. Monthly Revenue (Last 6 months) for Chart
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyRevenue = await OrderModel.aggregate([
    {
      $match: {
        status: "DELIVERED",
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // 3. User Growth (Last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newUsersLast30Days = await UserModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
    isDeleted: false,
  });

  // 4. Recent Orders
  const recentOrders = await OrderModel.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name email");

  sendResponse(res, 200, {
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: {
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        newUsersLast30Days,
      },
      charts: {
        ordersByCategory,
        monthlyRevenue,
        ordersByGovernorate,
      },
      ordersByStatus: statusCounts,
      recentOrders,
    },
  });
});

/**
 * Get filtered revenue analytics
 */
export const getRevenueAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const period = (req.query.period as string) || "Today";
  const now = new Date();
  let startDate = new Date();
  let grouping: Record<string, Record<string, string>> = { day: { $dayOfMonth: "$createdAt" } };
  let formatKey = "name";

  switch (period) {
    case "Today":
      startDate.setHours(0, 0, 0, 0);
      grouping = { hour: { $hour: "$createdAt" } };
      formatKey = "hour";
      break;
    case "Yesterday":
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      startDate = yesterday;
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      // We need to add $match for end range too for yesterday specifically
      break;
    case "Week":
      startDate.setDate(now.getDate() - 7);
      grouping = { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } };
      break;
    case "Month":
      startDate.setDate(now.getDate() - 30);
      grouping = { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } };
      break;
  }

  const matchQuery: Record<string, unknown> = {
    status: "DELIVERED",
    createdAt: { $gte: startDate },
  };

  if (period === "Yesterday") {
    const endOfYesterday = new Date(startDate);
    endOfYesterday.setHours(23, 59, 59, 999);
    (matchQuery.createdAt as { $gte: Date; $lte?: Date }).$lte = endOfYesterday;
  }

  const analytics = await OrderModel.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: grouping,
        profits: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1, "_id.day": 1, "_id.hour": 1 } },
  ]);

  // Transform data for frontend
  const result = analytics.map((item) => ({
    name: period === "Today" || period === "Yesterday" 
      ? `${item._id.hour}:00` 
      : `${item._id.day}/${item._id.month}`,
    profits: item.profits,
    orders: item.orders,
  }));

  sendResponse(res, 200, {
    success: true,
    message: "Revenue analytics retrieved successfully",
    data: result,
  });
});
