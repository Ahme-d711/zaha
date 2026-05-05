import { apiClient } from './api-client';
import { ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api';

export interface DashboardStats {
  summary: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    newUsersLast30Days: number;
  };
  charts: {
    ordersByCategory: Array<{ nameAr: string; nameEn: string; value: number }>;
    monthlyRevenue: Array<{ _id: { year: number; month: number }; revenue: number; orders: number }>;
    ordersByGovernorate: Array<{ name: string; value: number }>;
  };
  ordersByStatus: Record<string, number>;
  recentOrders: Array<any>;
}

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get<unknown, ApiResponse<DashboardStats>>(ENDPOINTS.DASHBOARD.STATS);
  },
  
  getRevenueAnalytics: async (period: string = 'Month'): Promise<ApiResponse<any[]>> => {
    return apiClient.get<unknown, ApiResponse<any[]>>(`${ENDPOINTS.DASHBOARD.REVENUE_ANALYTICS}?period=${period}`);
  },
};
