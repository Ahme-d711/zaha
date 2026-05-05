import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse } from "@/types/api";
import { CategoryListItem } from "./dashboard-management.service";

export const categoryService = {
  getAll: async (params?: { search?: string }) => {
    return apiClient.get<
      unknown,
      ApiResponse<{ categories: CategoryListItem[] }>
    >(ENDPOINTS.CATEGORIES.LIST, { params });
  },

  getById: async (id: string) => {
    return apiClient.get<unknown, ApiResponse<{ category: CategoryListItem }>>(
      `${ENDPOINTS.CATEGORIES.LIST}/${id}`
    );
  },

  getBySlug: async (slug: string) => {
    return apiClient.get<unknown, ApiResponse<{ category: CategoryListItem }>>(
      `${ENDPOINTS.CATEGORIES.LIST}/slug/${slug}`
    );
  },
};
