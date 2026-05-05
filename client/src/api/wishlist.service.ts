import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse, Wishlist } from "@/types/api";

export const wishlistService = {
  get: async () => {
    return apiClient.get<unknown, ApiResponse<{ wishlist: Wishlist }>>(
      ENDPOINTS.WISHLIST.BASE
    );
  },

  toggle: async (productId: string) => {
    return apiClient.post<unknown, ApiResponse<{ wishlist: Wishlist }>>(
      ENDPOINTS.WISHLIST.TOGGLE,
      { productId }
    );
  },

  clear: async () => {
    return apiClient.delete<unknown, ApiResponse<{ wishlist: Wishlist }>>(
      ENDPOINTS.WISHLIST.CLEAR
    );
  },
};
