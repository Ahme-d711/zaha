import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";

export type CheckoutPaymentMethod = "COD" | "CARD" | "PAYPAL" | "WALLET";

export interface CheckoutPayload {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  city: string;
  governorate: string;
  country: string;
  postalCode?: string;
  customerNotes?: string;
  paymentMethod: CheckoutPaymentMethod;
}

export interface CheckoutOrderResponse {
  order: {
    _id: string;
    trackingNumber?: string;
    totalAmount: number;
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    paymentMethod: CheckoutPaymentMethod;
    status: string;
  };
}

export interface MyOrderItem {
  productId?: { _id?: string; name?: string; nameEn?: string; mainImage?: string; images?: { main?: string } };
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

export interface MyOrder {
  _id: string;
  trackingNumber?: string;
  items: MyOrderItem[];
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: CheckoutPaymentMethod;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
  createdAt: string;
}

export const orderService = {
  checkout: async (payload: CheckoutPayload) => {
    return apiClient.post<unknown, ApiResponse<CheckoutOrderResponse>>(ENDPOINTS.ORDERS.CHECKOUT, payload);
  },
  getMyOrders: async (params?: { page?: number; limit?: number; status?: string }) => {
    return apiClient.get<
      unknown,
      ApiResponse<{
        orders: MyOrder[];
        pagination: { total: number; page: number; limit: number; pages: number };
      }>
    >(ENDPOINTS.ORDERS.MY_ORDERS, { params });
  },
};
