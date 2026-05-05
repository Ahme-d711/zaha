import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse, Product } from "@/types/api";

export const productService = {
  getAll: async (params?: any) => {
    return apiClient.get<unknown, ApiResponse<{ products: Product[]; pagination: any }>>(
      ENDPOINTS.PRODUCTS.LIST,
      { params }
    );
  },

  getById: async (id: string) => {
    return apiClient.get<unknown, ApiResponse<{ product: Product }>>(
      `${ENDPOINTS.PRODUCTS.LIST}/${id}`
    );
  },

  getBySlug: async (slug: string) => {
    return apiClient.get<unknown, ApiResponse<{ product: Product }>>(
      `${ENDPOINTS.PRODUCTS.LIST}/slug/${slug}`
    );
  },
};
