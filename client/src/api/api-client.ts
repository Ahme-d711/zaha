import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3131/api';

/**
 * Professional Axios instance configuration
 * Includes base URL, timeout, and common headers
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for session/cookie based auth
});

/**
 * Request Interceptor
 * Useful for adding auth tokens to headers dynamically
 */
apiClient.interceptors.request.use(
  (config) => {
    // You can get the token from localStorage or Zustand store here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Standardized error handling and data extraction
 */
apiClient.interceptors.response.use(
  (response) => response.data, // Directly return the data part of the response
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Global error handling (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      // Clear local storage / logout user
      console.error('Unauthorized access - logging out');
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      data: (error.response?.data as unknown),
    });
  }
);

