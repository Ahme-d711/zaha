import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";

export interface CartApiProduct {
  _id: string;
  id?: string;
  name?: string;
  nameEn?: string;
  nameAr?: string;
  price: number;
  mainImage?: string;
  images?: {
    main?: string;
    gallery?: string[];
  };
  category?: string;
  categoryId?: string | { _id?: string; name?: string; nameEn?: string };
}

export interface CartApiItem {
  productId: CartApiProduct | null;
  quantity: number;
  size?: string;
}

export interface CartApiData {
  _id: string;
  userId: string;
  items: CartApiItem[];
  createdAt: string;
  updatedAt: string;
}

export const cartService = {
  getCart: async () => {
    return apiClient.get<unknown, ApiResponse<{ cart: CartApiData }>>(ENDPOINTS.CART.BASE);
  },

  addItem: async (payload: { productId: string; quantity?: number; size?: string }) => {
    return apiClient.post<unknown, ApiResponse<{ cart: CartApiData }>>(ENDPOINTS.CART.ADD, payload);
  },

  updateItem: async (payload: { productId: string; quantity: number; size?: string }) => {
    return apiClient.patch<unknown, ApiResponse<{ cart: CartApiData }>>(ENDPOINTS.CART.UPDATE, payload);
  },

  removeItem: async (productId: string, size?: string) => {
    return apiClient.delete<unknown, ApiResponse<{ cart: CartApiData }>>(ENDPOINTS.CART.REMOVE(productId), {
      params: size ? { size } : undefined,
    });
  },

  clearCart: async () => {
    return apiClient.delete<unknown, ApiResponse<{ cart: CartApiData }>>(ENDPOINTS.CART.CLEAR);
  },
};
