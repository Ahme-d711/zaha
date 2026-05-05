/**
 * Centralized API endpoint constants
 * Makes it easier to manage and update URLs across the application
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    VERIFY: '/auth/verify',
    RESEND_VERIFICATION: '/auth/resend-verification',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    REVENUE_ANALYTICS: '/dashboard/revenue-analytics',
  },
  ORDERS: {
    LIST: '/orders',
    CHECKOUT: "/orders/checkout",
    MY_ORDERS: "/orders/my-orders",
    DETAILS: (id: string) => `/orders/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
  },
  SETTINGS: {
    BASE: '/settings',
  },
  USERS: {
    BASE: '/users',
    PROFILE: (id: string) => `/users/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    LIST: '/products',
    DETAILS: (id: string) => `/products/${id}`,
  },
  WISHLIST: {
    BASE: '/wishlist',
    TOGGLE: '/wishlist/toggle',
    CLEAR: '/wishlist/clear',
  },
  REVIEWS: {
    BASE: '/reviews',
    BY_PRODUCT: (id: string) => `/reviews/product/${id}`,
    TOP: '/reviews/top',
  },
  CART: {
    BASE: "/cart",
    ADD: "/cart/add",
    UPDATE: "/cart/update",
    REMOVE: (productId: string) => `/cart/remove/${productId}`,
    CLEAR: "/cart/clear",
  },
  // Add more as needed
} as const;
