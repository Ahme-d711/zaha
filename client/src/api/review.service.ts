import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse, Review } from "@/types/api";

export const reviewService = {
  getByProduct: async (productId: string) => {
    return apiClient.get<unknown, ApiResponse<{ reviews: Review[] }>>(
      ENDPOINTS.REVIEWS.BY_PRODUCT(productId)
    );
  },

  add: async (data: { productId: string; rating: number; comment?: string }) => {
    return apiClient.post<unknown, ApiResponse<{ review: Review }>>(
      ENDPOINTS.REVIEWS.BASE,
      data
    );
  },

  update: async (id: string, data: { rating?: number; comment?: string }) => {
    return apiClient.patch<unknown, ApiResponse<{ review: Review }>>(
      `${ENDPOINTS.REVIEWS.BASE}/${id}`,
      data
    );
  },

  delete: async (id: string) => {
    return apiClient.delete<unknown, ApiResponse<null>>(
      `${ENDPOINTS.REVIEWS.BASE}/${id}`
    );
  },
};
