import { apiClient } from './api-client';
import { ENDPOINTS } from './endpoints';
import { AuthResponse, User, LoginCredentials, RegisterData, ApiResponse } from '../types/api';

/**
 * Service layer for handling Auth-related API calls
 */
export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<unknown, ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<unknown, ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.REGISTER, userData);
  },

  logout: async (): Promise<void> => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiClient.get<unknown, ApiResponse<{ user: User }>>(ENDPOINTS.AUTH.ME);
  },

  verify: async (data: { email?: string; phone?: string; code: string }): Promise<ApiResponse<{ user: User }>> => {
    return apiClient.post<unknown, ApiResponse<{ user: User }>>(ENDPOINTS.AUTH.VERIFY, data);
  },

  resendVerification: async (data: { email?: string; phone?: string }): Promise<ApiResponse<void>> => {
    return apiClient.post<unknown, ApiResponse<void>>(ENDPOINTS.AUTH.RESEND_VERIFICATION, data);
  },
};


