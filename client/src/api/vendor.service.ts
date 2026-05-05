import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse } from "@/types/api";
import { ProductListItem, OrderListItem } from "./dashboard-management.service";

export interface VendorStats {
  summary: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
  recentOrders: OrderListItem[];
}

export const vendorService = {
  getStats: async () => {
    return apiClient.get<unknown, ApiResponse<VendorStats>>(ENDPOINTS.VENDOR.STATS);
  },

  getProducts: async () => {
    return apiClient.get<unknown, ApiResponse<{ products: ProductListItem[] }>>(
      ENDPOINTS.VENDOR.PRODUCTS
    );
  },

  getOrders: async () => {
    return apiClient.get<unknown, ApiResponse<{ orders: OrderListItem[] }>>(
      ENDPOINTS.VENDOR.ORDERS
    );
  },
};
