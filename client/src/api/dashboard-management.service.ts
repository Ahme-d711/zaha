import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse } from "@/types/api";

export interface ProductListItem {
  _id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  stock: number;
  isShow: boolean;
  mainImage: string;
  categoryId?: {
    _id: string;
    nameEn: string;
    nameAr: string;
  };
}

export interface UserListItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "user";
  isActive: boolean;
}

export interface CategoryListItem {
  _id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  priority?: number;
  image?: string;
  isShow: boolean;
  subcategoriesCount?: number;
  productsCount?: number;
}

export interface OrderListItem {
  _id: string;
  trackingNumber?: string;
  recipientName: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
}

export interface SettingsData {
  _id: string;
  shippingCost: number;
  taxRate: number;
  freeShippingThreshold: number;
  currency: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const dashboardManagementService = {
  getProducts: async (params?: { search?: string; page?: number; limit?: number }) => {
    return apiClient.get<
      unknown,
      ApiResponse<{ products: ProductListItem[]; pagination: Pagination }>
    >(ENDPOINTS.PRODUCTS.LIST, { params });
  },

  getProductById: async (id: string) => {
    return apiClient.get<unknown, ApiResponse<{ product: ProductListItem }>>(
      `${ENDPOINTS.PRODUCTS.BASE}/${id}`
    );
  },

  createProduct: async (payload: FormData) => {
    return apiClient.post<unknown, ApiResponse<{ product: ProductListItem }>>(
      ENDPOINTS.PRODUCTS.BASE,
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  updateProduct: async (id: string, payload: FormData) => {
    return apiClient.put<unknown, ApiResponse<{ product: ProductListItem }>>(
      `${ENDPOINTS.PRODUCTS.BASE}/${id}`,
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  getUsers: async (params?: { search?: string; page?: number; limit?: number }) => {
    return apiClient.get<
      unknown,
      ApiResponse<{ users: UserListItem[]; pagination: Pagination }>
    >(ENDPOINTS.USERS.BASE, { params });
  },

  getUserById: async (id: string) => {
    return apiClient.get<unknown, ApiResponse<{ user: UserListItem }>>(`${ENDPOINTS.USERS.BASE}/${id}`);
  },

  createUser: async (payload: FormData) => {
    return apiClient.post<unknown, ApiResponse<{ user: UserListItem }>>(ENDPOINTS.USERS.BASE, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateUser: async (id: string, payload: FormData) => {
    return apiClient.put<unknown, ApiResponse<{ user: UserListItem }>>(`${ENDPOINTS.USERS.BASE}/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getCategories: async (params?: { search?: string; page?: number; limit?: number }) => {
    return apiClient.get<
      unknown,
      ApiResponse<{ categories: CategoryListItem[]; pagination: Pagination }>
    >(ENDPOINTS.CATEGORIES.LIST, { params });
  },

  getCategoryById: async (id: string) => {
    return apiClient.get<unknown, ApiResponse<{ category: CategoryListItem }>>(
      `${ENDPOINTS.CATEGORIES.LIST}/${id}`
    );
  },

  createCategory: async (payload: FormData) => {
    return apiClient.post<unknown, ApiResponse<{ category: CategoryListItem }>>(
      ENDPOINTS.CATEGORIES.LIST,
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  updateCategory: async (id: string, payload: FormData) => {
    return apiClient.put<unknown, ApiResponse<{ category: CategoryListItem }>>(
      `${ENDPOINTS.CATEGORIES.LIST}/${id}`,
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  getOrders: async (params?: { search?: string; page?: number; limit?: number; status?: string }) => {
    return apiClient.get<
      unknown,
      ApiResponse<{ orders: OrderListItem[]; pagination: Pagination }>
    >(ENDPOINTS.ORDERS.LIST, { params });
  },

  getOrderById: async (id: string) => {
    return apiClient.get<unknown, ApiResponse<{ order: OrderListItem }>>(`${ENDPOINTS.ORDERS.LIST}/${id}`);
  },

  updateOrderStatus: async (id: string, status: string) => {
    return apiClient.patch<unknown, ApiResponse<{ order: OrderListItem }>>(`${ENDPOINTS.ORDERS.LIST}/${id}/status`, {
      status,
    });
  },

  getSettings: async () => {
    return apiClient.get<unknown, ApiResponse<SettingsData>>(ENDPOINTS.SETTINGS.BASE);
  },

  updateSettings: async (payload: Partial<SettingsData>) => {
    return apiClient.put<unknown, ApiResponse<SettingsData>>(ENDPOINTS.SETTINGS.BASE, payload);
  },
};
