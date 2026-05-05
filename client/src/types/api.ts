/**
 * Global API response and model types
 * Ensures type safety across the application
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ProductImages {
  main: string;
  gallery: string[];
}

export interface ProductFeatures {
  battery_life: string;
  noise_cancelling: boolean;
  audio: string[];
}

export interface ProductShipping {
  free_shipping: boolean;
  condition: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  nameEn?: string;
  nameAr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  old_price: number;
  discount_percentage: number;
  rating: number;
  reviews_count: number;
  images: ProductImages;
  mainImage?: string;
  stock: number;
  is_best_seller: boolean;
  features: ProductFeatures;
  shipping: ProductShipping;
  warranty: string;
  returns: string;
  slug: string;
  categoryId: string | { _id: string; nameEn: string; nameAr: string };
  addedBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: string | User;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  products: Product[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'vendor' | 'super_admin';
  picture?: string;
  phone?: string;
  address?: string;
  gender?: 'male' | 'female' | null;
  isVerified: boolean;
  isActive: boolean;
  totalOrders?: number;
  walletBalance?: number;
}

export interface LoginCredentials {
  phone: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: 'male' | 'female';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
